import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QualityStatus {
  quality: string | null;
  isTesting: boolean;
}

export const NetworkDiagnostic: React.FC<{ onStatusChange?: (status: QualityStatus) => void }> = ({ onStatusChange }) => {
  const [ping, setPing] = useState<number>(0);
  const [jitter, setJitter] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);
  const [quality, setQuality] = useState<string>('Analyzing...');
  const [testPhase, setTestPhase] = useState<string>('Initializing...');
  const [packetLoss, setPacketLoss] = useState<number>(0);
  const [stabilityScore, setStabilityScore] = useState<string>('--');
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [bufferbloat, setBufferbloat] = useState<string>('Detecting...');
  const [networkInfo, setNetworkInfo] = useState<{ip?: string, isp?: string, location?: string}>({});
  const [lastTest, setLastTest] = useState<string>('Live');
  
  const [selectedServer, setSelectedServer] = useState<string>('auto');
  const [activeServerDetails, setActiveServerDetails] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const servers = [
    { name: "Auto Select Best Server", url: "auto" },
    { name: "Cloudflare (Global) - 100MB", url: "https://speed.cloudflare.com/__down?bytes=100000000" },
    { name: "Cloudflare (Global) - 10MB", url: "https://speed.cloudflare.com/__down?bytes=10000000" },
    { name: "Cloudflare (Global) - Fast", url: "https://speed.cloudflare.com/__down?bytes=25000000" }
  ];

  // Rolling data for charts (last 30 seconds)
  const [perfData, setPerfData] = useState<any[]>([]);
  const [latencyData, setLatencyData] = useState<any[]>([]);

  // Refs for tracking recent history to calculate jitter and smoothing
  const pingsRef = useRef<number[]>([]);
  const lastTimeStr = useRef<string>('');

  // Generate initial dummy data for a smooth startup
  useEffect(() => {
    const defaultPerf = [];
    const defaultLat = [];
    const now = new Date();
    
    for(let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2000);
        const timeStr = time.toTimeString().split(' ')[0];
        defaultPerf.push({
            time: timeStr,
            download: 0,
            upload: 0,
        });
        defaultLat.push({
            time: timeStr,
            ping: 0,
            jitter: 0,
        });
    }
    setPerfData(defaultPerf);
    setLatencyData(defaultLat);
  }, []);

  // Continuous Telemetry Loop
  useEffect(() => {
    let isActive = true;

    const runTelemetry = async () => {
      // Auto server selection
      let bestServer = selectedServer;
      let activeServerName = 'Unknown Server';
      let minPing = Infinity;
      try {
          if (selectedServer === 'auto') {
              for (const s of servers) {
                  if (s.url === 'auto') continue;
                  const targetUrl = s.url.includes('cloudflare.com') 
                      ? `https://speed.cloudflare.com/__down?bytes=1`
                      : `${s.url.split('?')[0]}?r=${Math.random()}`;
                  const startPing = performance.now();
                  // simple quick ping to see which is fastest
                  await fetch(targetUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' }).catch(() => {});
                  const pingTime = performance.now() - startPing;
                  if (pingTime < minPing) {
                      minPing = pingTime;
                      bestServer = s.url;
                      activeServerName = s.name;
                  }
              }
          } else {
              activeServerName = servers.find(s => s.url === selectedServer)?.name || 'Unknown Server';
          }
          if (isActive) {
              setActiveServerDetails(activeServerName);
          }
      } catch (e) {}

      // Fetch network contextual info
      try {
          const metaFetch = await fetch('https://speed.cloudflare.com/meta', { cache: 'no-store' }).catch(()=>null);
          if (metaFetch && metaFetch.ok) {
              const metaData = await metaFetch.json();
              if (isActive) {
                  setNetworkInfo({
                      ip: metaData.clientIp,
                      isp: metaData.asOrganization || metaData.clientAsnName || metaData.asnName || 'Unknown ISP',
                      location: [metaData.city, metaData.region, metaData.country].filter(Boolean).join(', ') || 'Unknown Location'
                  });
              }
          } else {
              const altFetch = await fetch('https://ipapi.co/json/').catch(()=>null);
              if (altFetch && altFetch.ok) {
                  const altData = await altFetch.json();
                  if (isActive) {
                      setNetworkInfo({
                          ip: altData.ip,
                          isp: altData.org || 'Unknown ISP',
                          location: [altData.city, altData.region, altData.country_name].filter(Boolean).join(', ') || 'Unknown Location'
                      });
                  }
              }
          }
      } catch (e) {}

      while (isActive) {
        // Wait before starting the next test cycle
        await new Promise(r => setTimeout(r, 1000));
        if (!isActive) break;

        // Reset display
        setBufferbloat('Detecting...');
        setConfidenceScore(null);
        
        let emaDownload = 0;
        let emaUpload = 0;
        const EMA_ALPHA = 0.3; // Smoothing factor for UI

        // Variance calculation utility
        const calcVariance = (arr: number[]) => {
            if (arr.length < 2) return 0;
            const mean = arr.reduce((a,b)=>a+b,0)/arr.length;
            return arr.reduce((a,b)=>a + Math.pow(b - mean, 2), 0) / arr.length;
        };

        setTestPhase('Ping Phase');
        if (onStatusChange) onStatusChange({ quality: 'Testing...', isTesting: true });
        setQuality('Testing...');

        // Unified Data Streams
        const pingSamples: number[] = [];
        const downloadSpeedStream: number[] = [];
        const uploadSpeedStream: number[] = [];
        let failedRequests = 0;
        let totalRequests = 0;

        // Common Chart Appender
        const appendChart = (d: number, u: number) => {
            const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
            setPerfData(prev => {
                const newData = [...prev, { time: timeStr, download: d, upload: u }];
                return newData.length > 20 ? newData.slice(newData.length - 20) : newData;
            });
        };

        const targetPingUrl = bestServer.includes('cloudflare.com') 
                ? `https://speed.cloudflare.com/__down?bytes=1`
                : `${bestServer.split('?')[0]}?r=${Math.random()}`;

        // 1. Latency & Ping Phase
        // Measure ping using the same server used for download/upload, 10 small requests
        for (let i = 0; i < 10; i++) {
            if (!isActive) break;
            const startPing = performance.now();
            totalRequests++;
            try {
                await fetch(targetPingUrl, { method: 'HEAD', mode: "no-cors", cache: "no-store" });
                pingSamples.push(performance.now() - startPing);
            } catch(e) {
                failedRequests++;
            }
        }
        
        if (!isActive) break;
        
        let finalPing = pingSamples.length ? pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length : 0;
        let finalJitter = pingSamples.length ? pingSamples.reduce((a, b) => a + Math.abs(b - finalPing), 0) / pingSamples.length : 0;
        const idlePing = finalPing;
        
        setPing(Math.round(finalPing));
        setJitter(Math.round(finalJitter));
        setPacketLoss(totalRequests > 0 ? Math.round((failedRequests / totalRequests) * 100) : 0);

        const timePingStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        setLatencyData(prev => {
            const newData = [...prev, { time: timePingStr, ping: Math.round(finalPing), jitter: Math.round(finalJitter) }];
            return newData.length > 20 ? newData.slice(newData.length - 20) : newData;
        });

        let finalDownSpeed = 0;
        let finalUpSpeed = 0;
        let downMicroStalls = 0;
        let upMicroStalls = 0;

        const computeLiveDiagnostics = (curDown: number, curUp: number) => {
            const downVar = calcVariance(downloadSpeedStream);
            const upVar = calcVariance(uploadSpeedStream);
            const pingVar = calcVariance(pingSamples);
            
            const downStd = downVar > 0 ? Math.sqrt(downVar) : 0;
            const upStd = upVar > 0 ? Math.sqrt(upVar) : 0;
            const pingStd = pingVar > 0 ? Math.sqrt(pingVar) : 0;
            
            const currentPing = pingSamples.length ? pingSamples.reduce((a,b)=>a+b,0)/pingSamples.length : 0;
            
            const covDown = curDown > 0 ? downStd / curDown : 1;
            const covUp = curUp > 0 ? upStd / curUp : 1;
            const covPing = currentPing > 0 ? pingStd / currentPing : 1;

            let stabilityScoreAvg = 1 - Math.min((covDown + covUp + (covPing / 2)) / 2.5, 1);
            
            const totalMicroStalls = downMicroStalls + upMicroStalls;
            if (totalMicroStalls > 0) {
                stabilityScoreAvg -= (totalMicroStalls * 0.05); 
            }
            
            const stabilityPercent = Math.max(0, Math.round(stabilityScoreAvg * 100));
            setStabilityScore(`${stabilityPercent}%`);
            setPacketLoss(totalRequests > 0 ? Math.round((failedRequests / totalRequests) * 100) : 0);

            // Bufferbloat live
            const pingDiff = currentPing - idlePing;
            if (pingDiff > 50) setBufferbloat('High');
            else if (pingDiff > 15) setBufferbloat('Moderate');
            else setBufferbloat('Low');

            let conf = 100;
            if (totalRequests > 0) conf -= (failedRequests / totalRequests) * 200; 
            if (stabilityScoreAvg < 1) conf -= (1 - stabilityScoreAvg) * 40; 
            conf -= totalMicroStalls * 3; 
            if (downloadSpeedStream.length < 10) conf -= 15; 
            if (uploadSpeedStream.length < 10) conf -= 15;
            
            const finalConfidence = Math.max(0, Math.min(100, Math.round(conf)));
            setConfidenceScore(finalConfidence);
            
            const isStableDown = curDown > 0 ? covDown < 0.2 : false; 
            
            let q = 'Fair';
            if (curDown > 50 && curUp > 10 && currentPing < 20) {
                q = 'Excellent';
            } else if (curDown > 15 && curUp > 5 && currentPing < 60 && isStableDown) {
                q = 'Good';
            } else if (curDown > 5 && currentPing < 150) {
                q = 'Fair';
            } else if (curDown > 0) {
                q = 'Poor';
            }
            setQuality(q);
            return q;
        };

        // Background continuous pinging during file tests for real-time jitter/server routing validation
        const bgPingInterval = setInterval(() => {
            if (!isActive) return;
            totalRequests++;
            const startBg = performance.now();
            fetch(targetPingUrl, { method: 'HEAD', mode: "no-cors", cache: "no-store" }).then(()=> {
                const val = performance.now() - startBg;
                pingSamples.push(val);
                // Update ping/jitter slightly as we go for UI
                const currentPing = pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length;
                const currentJitter = pingSamples.reduce((a, b) => a + Math.abs(b - currentPing), 0) / pingSamples.length;
                setPing(Math.round(currentPing));
                setJitter(Math.round(currentJitter));
                
                const timePingStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
                setLatencyData(prev => {
                    const newData = [...prev, { time: timePingStr, ping: Math.round(currentPing), jitter: Math.round(currentJitter) }];
                    return newData.length > 20 ? newData.slice(newData.length - 20) : newData;
                });
            }).catch(() => {
                failedRequests++;
                setPacketLoss(totalRequests > 0 ? Math.round((failedRequests / totalRequests) * 100) : 0);
            });
        }, 1500);

        // 2. Download Phase
        setTestPhase('Download Phase');
        let downConnections = 2; 
        const maxDownConnections = 8;
        let downloadDuration = 8000; // flexible test duration
        
        const downAbort = new AbortController();
        let globalDownBytes = 0;
        let downActiveTasks = 0;

        const startDownloadTask = async () => {
            downActiveTasks++;
            try {
                const targetUrl = bestServer.includes('cloudflare.com') 
                    ? `https://speed.cloudflare.com/__down?bytes=50000000&r=${Math.random()}`
                    : `${bestServer}${bestServer.includes('?') ? '&' : '?'}r=${Math.random()}`;
                
                const response = await fetch(targetUrl, { cache: "no-store", signal: downAbort.signal });
                if (!response.body) return;
                const reader = response.body.getReader();

                while (isActive) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    globalDownBytes += value.length;
                }
            } catch (e) {
                // Ignore aborts
            }
            downActiveTasks--;
        };

        const downTasks = Array(downConnections).fill(0).map(() => startDownloadTask());
        
        let downPassed = 0;
        let lastDownBytes = 0;
        let downPlateauTicks = 0;
        
        await new Promise(resolve => {
            const monitor = setInterval(() => {
                if (!isActive) {
                    clearInterval(monitor);
                    resolve(null);
                    return;
                }
                downPassed += 400; // ~400ms tick
                const bytesDelta = globalDownBytes - lastDownBytes;
                lastDownBytes = globalDownBytes;
                
                if (downPassed > 1000) { // Ignore warm-up (first 1 sec)
                    const speedMbps = (bytesDelta * 8) / 0.4 / (1024 * 1024);
                    downloadSpeedStream.push(speedMbps);
                    
                    if (bytesDelta === 0) downMicroStalls++;
                    
                    // Plateau detection: smooth real-time update
                    const recentSize = Math.min(5, downloadSpeedStream.length);
                    const recentSamples = downloadSpeedStream.slice(-recentSize);
                    const smoothedSpeed = recentSamples.reduce((a,b)=>a+b,0) / recentSize;
                    
                    emaDownload = emaDownload === 0 ? smoothedSpeed : (EMA_ALPHA * smoothedSpeed) + ((1 - EMA_ALPHA) * emaDownload);
                    
                    setDownloadSpeed(Number(emaDownload.toFixed(2)));
                    appendChart(Number(emaDownload.toFixed(2)), 0);
                    finalDownSpeed = smoothedSpeed;
                    
                    computeLiveDiagnostics(finalDownSpeed, finalUpSpeed);

                    // Adaptive Connection Scaling
                    if (smoothedSpeed > 50 && downActiveTasks < maxDownConnections) {
                        const needed = Math.min(maxDownConnections, Math.floor(smoothedSpeed / 25) + 2);
                        while(downActiveTasks < needed) {
                            startDownloadTask();
                        }
                    }

                    // Dynamically extend test if fluctuating (Stabilizing)
                    if (downPassed > 6000 && downloadSpeedStream.length > 5) {
                       const stdDev = Math.sqrt(calcVariance(recentSamples));
                       const cv = smoothedSpeed > 0 ? stdDev / smoothedSpeed : 1;
                       
                       if (cv > 0.05) {
                           downPlateauTicks = 0;
                           if (downPassed < 15000) { // Keep trying to plateau up to 15s
                               setTestPhase('Stabilizing Download...');
                               downloadDuration = Math.min(15000, downloadDuration + 400); 
                           } else {
                               setTestPhase('Download Phase');
                           }
                       } else {
                           downPlateauTicks++;
                           setTestPhase('Download Phase');
                           if (downPlateauTicks >= 7) { // 7 * 400ms = 2.8s stable plateau lock
                               clearInterval(monitor);
                               resolve(null);
                               return;
                           }
                       }
                    }
                } else if (downPassed > 0) {
                    // Visual only during warm-up, not saved to stream
                    const speedMbps = (bytesDelta * 8) / 0.4 / (1024 * 1024);
                    setDownloadSpeed(Number(speedMbps.toFixed(2)));
                }

                if (downPassed >= downloadDuration) {
                    clearInterval(monitor);
                    resolve(null);
                }
            }, 400);
        });
        
        downAbort.abort();
        
        // Finalized Download Speed calculation (trimmed mean of stream avoiding spikes)
        if (downloadSpeedStream.length > 0) {
            downloadSpeedStream.sort((a,b)=>a-b);
            // Mid 90% of samples (trim top/bottom 5%)
            const mid = downloadSpeedStream.slice(Math.floor(downloadSpeedStream.length * 0.05), Math.ceil(downloadSpeedStream.length * 0.95));
            finalDownSpeed = mid.length ? mid.reduce((a,b)=>a+b,0)/mid.length : finalDownSpeed;
            setDownloadSpeed(Number(finalDownSpeed.toFixed(2)));
        }

        if (!isActive) break;

        // 3. Upload Phase
        setTestPhase('Upload Phase');
        let upConnections = 2;
        const maxUpConnections = 4;
        let uploadDuration = 8000; // flexible test duration
        
        const upAbort = new AbortController();
        let globalUpBytes = 0;
        let upActiveTasks = 0;

        const startUploadTask = async () => {
            upActiveTasks++;
            try {
                while (isActive) {
                    // Use slightly smaller chunks for better acknowledgement speed/accuracy
                    const chunk = new Uint8Array(256 * 1024); 
                    for(let i=0; i<chunk.length; i++) chunk[i] = Math.random() * 255;
                    const data = new Blob([chunk]);
                    
                    const response = await fetch("https://speed.cloudflare.com/__up", {
                        method: "POST", body: data, signal: upAbort.signal, cache: 'no-store'
                    });
                    
                    // Only count bytes if transmission is acknowledged/completed
                    if (response.ok || response.type === 'opaque') {
                       globalUpBytes += data.size;
                    } else {
                       failedRequests++; // Drop
                    }
                }
            } catch (e) {
                // Abort or fail
                failedRequests++;
            }
            upActiveTasks--;
        };

        const upTasks = Array(upConnections).fill(0).map(() => startUploadTask());

        let upPassed = 0;
        let lastUpBytes = 0;
        let upPlateauTicks = 0;

        await new Promise(resolve => {
            const monitor = setInterval(() => {
                if (!isActive) {
                    clearInterval(monitor);
                    resolve(null);
                    return;
                }
                upPassed += 400; // ~400ms tick
                const bytesDelta = globalUpBytes - lastUpBytes;
                lastUpBytes = globalUpBytes;

                if (upPassed > 1000) { // Ignore warm-up
                    const speedMbps = (bytesDelta * 8) / 0.4 / (1024 * 1024);
                    uploadSpeedStream.push(speedMbps);
                    
                    if (bytesDelta === 0) upMicroStalls++;
                    
                    const recentSize = Math.min(5, uploadSpeedStream.length);
                    const recentSamples = uploadSpeedStream.slice(-recentSize);
                    const smoothedSpeed = recentSamples.reduce((a,b)=>a+b,0) / recentSize;
                    
                    emaUpload = emaUpload === 0 ? smoothedSpeed : (EMA_ALPHA * smoothedSpeed) + ((1 - EMA_ALPHA) * emaUpload);
                    
                    setUploadSpeed(Number(emaUpload.toFixed(2)));
                    appendChart(0, Number(emaUpload.toFixed(2)));
                    finalUpSpeed = smoothedSpeed;
                    
                    computeLiveDiagnostics(finalDownSpeed, finalUpSpeed);

                    if (smoothedSpeed > 10 && upActiveTasks < maxUpConnections) {
                        const needed = Math.min(maxUpConnections, Math.floor(smoothedSpeed / 10) + 2);
                        while(upActiveTasks < needed) {
                            startUploadTask();
                        }
                    }

                    if (upPassed > 6000 && uploadSpeedStream.length > 5) {
                       const stdDev = Math.sqrt(calcVariance(recentSamples));
                       const cv = smoothedSpeed > 0 ? stdDev / smoothedSpeed : 1;
                       
                       if (cv > 0.05) { 
                           upPlateauTicks = 0;
                           if (upPassed < 15000) {
                               setTestPhase('Stabilizing Upload...');
                               uploadDuration = Math.min(15000, uploadDuration + 400); 
                           } else {
                               setTestPhase('Upload Phase');
                           }
                       } else {
                           upPlateauTicks++;
                           setTestPhase('Upload Phase');
                           if (upPlateauTicks >= 7) { // 2.8s lock
                               clearInterval(monitor);
                               resolve(null);
                               return;
                           }
                       }
                    }

                } else if (upPassed > 0) {
                    const speedMbps = (bytesDelta * 8) / 0.4 / (1024 * 1024);
                    setUploadSpeed(Number(speedMbps.toFixed(2)));
                }

                if (upPassed >= uploadDuration) {
                    clearInterval(monitor);
                    resolve(null);
                }
            }, 400);
        });

        upAbort.abort();

        if (uploadSpeedStream.length > 0) {
            uploadSpeedStream.sort((a,b)=>a-b);
            // Mid 90%
            const mid = uploadSpeedStream.slice(Math.floor(uploadSpeedStream.length * 0.05), Math.ceil(uploadSpeedStream.length * 0.95));
            finalUpSpeed = mid.length ? mid.reduce((a,b)=>a+b,0)/mid.length : finalUpSpeed;
            setUploadSpeed(Number(finalUpSpeed.toFixed(2)));
        }

        clearInterval(bgPingInterval);
        
        // Refresh final ping/jitter with combined trace
        finalPing = pingSamples.length ? pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length : finalPing;
        finalJitter = pingSamples.length ? pingSamples.reduce((a, b) => a + Math.abs(b - finalPing), 0) / pingSamples.length : finalJitter;

        if (!isActive) break;

        // 4. Data-Driven Diagnostics
        setTestPhase('Final Result');

        const computedQuality = computeLiveDiagnostics(finalDownSpeed, finalUpSpeed) || 'Poor';

        if (onStatusChange) {
            // Note: Since this is called in an async block within useEffect, 
            // the state update isn't queued during the synchronous render
            // but we still shouldn't call it inside a setState updater function.
            onStatusChange({ quality: computedQuality, isTesting: false });
        }
        
        setLastTest(new Date().toLocaleTimeString());
      }
    };

    runTelemetry();

    return () => {
      isActive = false;
    };
  }, [onStatusChange, selectedServer]);

  const Gauge = ({ value, label }: { value: number | null, label: string }) => {
    const val = value || 0;
    const max = val <= 15 ? 25 : val <= 50 ? 100 : val <= 100 ? 200 : val <= 500 ? 1000 : Math.ceil(val / 100) * 100;
    
    let color = '#ef4444'; // Red for poor
    if (label === 'Download') {
        if (val >= 10 && val < 50) color = '#e67e22'; // Orange for fair
        if (val >= 50 && val < 100) color = '#00c3ff'; // Cyan for good
        if (val >= 100) color = '#00ff00'; // Green for excellent
    } else {
        // Upload speeds are typically lower
        if (val >= 3 && val < 10) color = '#e67e22'; // Orange for fair
        if (val >= 10 && val < 25) color = '#00c3ff'; // Cyan for good
        if (val >= 25) color = '#00ff00'; // Green for excellent
    }

    const r = 70;
    const cx = 100;
    const cy = 80;
    const strokeWidth = 14;
    const circumference = Math.PI * r;
    const percent = Math.min(val / max, 1);
    const strokeDashoffset = circumference - percent * circumference;

    return (
      <div className="flex flex-col items-center my-2 relative w-full">
        <div className="text-sm md:text-base font-medium mb-1 text-stone-600 dark:text-stone-300">{label}</div>
        <svg width="100%" height={100} viewBox="0 0 200 100" className="drop-shadow-sm dark:drop-shadow-lg overflow-visible" preserveAspectRatio="xMidYMid meet">
          {/* Background arc */}
          <path 
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} 
            fill="none" 
            stroke="currentColor" 
            className="text-stone-200 dark:text-[#444]"
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
          />
          {/* Foreground arc */}
          <path 
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} 
            fill="none" 
            stroke={color} 
            strokeWidth={strokeWidth} 
            strokeLinecap="round" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-1 flex flex-col items-center w-full text-center">
            <span className="text-2xl md:text-3xl font-black tracking-tight transition-all duration-300" style={{ color: color, textShadow: `0 0 12px ${color}80` }}>
              {val > 0 ? val.toFixed(2) : '0.00'}
            </span>
        </div>
        <div className="w-[180px] flex justify-between -mt-1 text-[10px] text-stone-400 dark:text-stone-500 font-mono">
           <span>0</span>
           <span className="translate-y-1 lowercase tracking-widest text-[#00a8ff]">Mbps</span>
           <span>{max}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 sm:px-4 md:px-6 relative group">
      <div className="w-full flex justify-center mb-2 transition-opacity duration-300">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center gap-2 bg-gradient-to-b from-white to-stone-50 dark:from-[#2a2a2a] dark:to-[#1f1f1f] hover:from-stone-50 hover:to-stone-100 dark:hover:from-[#333] dark:hover:to-[#252525] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#444] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-sm hover:shadow active:scale-95 z-10"
        >
          {isVisible ? 'Hide Telemetry View' : 'Show Telemetry View'}
          <span className="relative flex h-2.5 w-2.5 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff00]"></span>
          </span>
        </button>
      </div>
      
      {isVisible && (
      <div className="w-full mt-4 max-w-full flex flex-col lg:flex-row bg-white dark:bg-[#1e1e1e] border border-stone-200 dark:border-stone-800 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl font-sans text-stone-900 dark:text-stone-100 h-auto lg:min-h-[600px] animate-in fade-in slide-in-from-top-4 duration-500">
        
        {/* Left Sidebar / Real-time Data */}
        <div className="w-full lg:w-[320px] xl:w-[360px] bg-stone-50 dark:bg-[#252525] flex flex-col border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-[#333] shrink-0 p-4 lg:p-6 shadow-inner relative overflow-y-auto overflow-x-hidden custom-scrollbar">

          <div className="text-center mb-4 mt-2 relative z-10">
            <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff00]"></span>
              </span>
              LIVE TELEMETRY
            </h2>
            <div className="text-stone-500 dark:text-[#888] text-[10px] lg:text-xs font-mono mt-1 font-semibold uppercase tracking-widest">{testPhase}</div>
          </div>
          
          <div className="mb-4 text-center">
             <select 
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="w-full bg-white dark:bg-[#1a1a1a] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-[#333] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 shadow-sm transition-all mb-1"
             >
                {servers.map(s => (
                   <option key={s.url} value={s.url}>{s.name}</option>
                ))}
             </select>
             {selectedServer === 'auto' && activeServerDetails && (
                 <div className="text-[10px] text-stone-400 font-mono">Testing via: {activeServerDetails}</div>
             )}
          </div>
          
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-stone-200 dark:border-[#333] flex flex-col items-center shadow-sm dark:shadow-inner">
             <div className="text-stone-500 dark:text-[#888] text-xs uppercase tracking-widest mb-2 font-semibold">Latency & Loss</div>
             <div className="flex gap-6 w-full justify-center">
                 <div className="flex flex-col items-center">
                     <div className="flex items-baseline gap-1">
                        <span className="text-[#00c3ff] dark:text-[#00ffff] text-3xl font-black tabular-nums transition-all duration-300">{ping}</span>
                        <span className="text-stone-400 dark:text-stone-500 font-bold text-xs">ms</span>
                     </div>
                     <div className="text-stone-400 text-[10px] font-mono mt-1">±{jitter} ms jitter</div>
                 </div>
                 <div className="w-[1px] bg-stone-200 dark:bg-[#333]"></div>
                 <div className="flex flex-col items-center">
                     <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-black tabular-nums transition-all duration-300 ${packetLoss > 2 ? 'text-red-500' : 'text-[#00ff00]'}`}>{packetLoss}</span>
                        <span className="text-stone-400 dark:text-stone-500 font-bold text-xs">%</span>
                     </div>
                     <div className="text-stone-400 text-[10px] font-mono mt-1">packet loss</div>
                 </div>
             </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-stone-200 dark:border-[#333] shadow-sm dark:shadow-inner flex flex-col items-center justify-center min-h-[60px]">
             {quality && quality !== 'Analyzing...' ? (
               <div className="w-full flex items-center justify-between px-2">
                 <div className="flex flex-col items-center">
                     <div className="text-stone-500 dark:text-[#888] text-[10px] uppercase tracking-widest mb-1 font-semibold">Quality</div>
                     <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                        quality === 'Excellent' ? 'bg-[#00ff00]/10 text-[#00c800] dark:text-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.1)]' :
                        quality === 'Good' ? 'bg-[#00ffff]/10 text-[#0099cc] dark:text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.1)]' :
                        quality === 'Fair' ? 'bg-[#e67e22]/10 text-[#d35400] dark:text-[#e67e22] shadow-[0_0_15px_rgba(230,126,34,0.1)]' :
                        'bg-red-500/10 text-red-600 dark:text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                     }`}>
                       {quality}
                     </div>
                 </div>
                 <div className="w-[1px] h-8 bg-stone-200 dark:bg-[#333]"></div>
                 <div className="flex flex-col items-center">
                     <div className="text-stone-500 dark:text-[#888] text-[10px] uppercase tracking-widest mb-1 font-semibold">Stability</div>
                     <div className="text-lg font-black text-stone-800 dark:text-stone-200">{stabilityScore}</div>
                 </div>
               </div>
             ) : (
                <div className="text-stone-400 dark:text-stone-500 animate-pulse text-xs tracking-widest uppercase">Analyzing...</div>
             )}
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-stone-200 dark:border-[#333] shadow-sm dark:shadow-inner flex flex-col w-full">
            <div className="text-stone-500 dark:text-[#888] text-[10px] uppercase tracking-widest mb-3 font-semibold text-center w-full">Diagnostics & Context</div>
            <div className="flex justify-between items-center w-full px-2 mb-3">
                <div className="flex flex-col">
                    <div className="text-lg font-black">{confidenceScore !== null ? `${confidenceScore}%` : '--'}</div>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">Confidence</div>
                </div>
                <div className="w-[1px] h-8 bg-stone-200 dark:bg-[#333]"></div>
                <div className="flex flex-col items-end">
                    <div className={`text-sm font-black uppercase ${bufferbloat === 'High' ? 'text-red-500' : bufferbloat === 'Moderate' ? 'text-orange-500' : 'text-stone-700 dark:text-stone-300'}`}>{bufferbloat}</div>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">Bufferbloat</div>
                </div>
            </div>
            <div className="w-full h-[1px] bg-stone-200 dark:bg-[#333] mb-3"></div>
            <div className="flex flex-col text-[10px] font-mono gap-1.5 px-1">
                <div className="flex justify-between">
                    <span className="text-stone-500">ISP</span>
                    <span className="text-stone-700 dark:text-stone-300 font-semibold truncate max-w-[150px]" title={networkInfo.isp}>{networkInfo.isp || '--'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-500">IP</span>
                    <span className="text-stone-700 dark:text-stone-300 font-semibold truncate max-w-[150px]">{networkInfo.ip || '--'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-stone-500">Location</span>
                    <span className="text-stone-700 dark:text-stone-300 font-semibold truncate max-w-[150px]">{networkInfo.location || '--'}</span>
                </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row lg:flex-col items-center justify-center gap-2 lg:gap-6 w-full mt-2 lg:mt-0 pb-4 lg:pb-0">
             <div className="flex-1 w-full"><Gauge value={downloadSpeed} label="Download" /></div>
             <div className="flex-1 w-full"><Gauge value={uploadSpeed} label="Upload" /></div>
          </div>
        </div>

        {/* Right Content Area (Charts) */}
        <div className="flex-1 flex flex-col bg-stone-50 dark:bg-[#1e1e1e] p-4 sm:p-6 lg:p-8 min-w-0 relative">
          
           {/* Background Grid Pattern for high-tech look */}
           <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}
           ></div>

           <div className="relative z-10 flex-1 flex flex-col gap-4 lg:gap-6">
             {/* Performance Chart */}
             <div className="flex-1 flex flex-col bg-white dark:bg-[#252525] rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-stone-200 dark:border-[#333] shadow-sm dark:shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-base lg:text-lg font-bold text-stone-800 dark:text-white tracking-wide">Bandwidth Timeline</h3>
                  <div className="flex justify-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-semibold uppercase tracking-wider bg-stone-100 dark:bg-[#1a1a1a] px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg border border-stone-200 dark:border-[#333]">
                     <span className="flex items-center gap-1.5 lg:gap-2">
                       <span className="w-2h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#00a8ff]"></span> Download
                     </span>
                     <span className="flex items-center gap-1.5 lg:gap-2">
                       <span className="w-2h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#b2bec3]"></span> Upload
                     </span>
                  </div>
                </div>
                <div className="h-48 lg:flex-1 w-full min-h-[150px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={1}>
                     <LineChart data={perfData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-stone-200 dark:text-[#333]" vertical={true} />
                        <XAxis dataKey="time" stroke="currentColor" className="text-stone-400 dark:text-[#666]" tick={{ fill: 'currentColor', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="currentColor" className="text-stone-400 dark:text-[#666]" tick={{ fill: 'currentColor', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--tw-prose-body, #1a1a1a)', borderColor: 'var(--tw-prose-hr, #333)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                          content={(props: any) => {
                              if (props.active && props.payload && props.payload.length) {
                                  return (
                                      <div className="bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-[#333] p-2 rounded-lg shadow-lg">
                                          <p className="text-[#888] text-[10px] mb-1">{props.label}</p>
                                          {props.payload.map((entry: any, index: number) => (
                                              <div key={index} className="text-xs font-bold" style={{ color: entry.color }}>
                                                  {entry.name}: {entry.value}
                                              </div>
                                          ))}
                                      </div>
                                  );
                              }
                              return null;
                          }}
                          cursor={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Line type="monotone" dataKey="download" stroke="#00a8ff" strokeWidth={3} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="upload" stroke="#b2bec3" strokeWidth={3} dot={false} isAnimationActive={false} />
                     </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>

             {/* Latency Chart */}
             <div className="flex-1 flex flex-col bg-white dark:bg-[#252525] rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-stone-200 dark:border-[#333] shadow-sm dark:shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-base lg:text-lg font-bold text-stone-800 dark:text-white tracking-wide">Network Stability</h3>
                  <div className="flex justify-center gap-3 lg:gap-4 text-[10px] lg:text-xs font-semibold uppercase tracking-wider bg-stone-100 dark:bg-[#1a1a1a] px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg border border-stone-200 dark:border-[#333]">
                     <span className="flex items-center gap-1.5 lg:gap-2">
                       <span className="w-2h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#00c3ff] dark:bg-[#00ffff]"></span> Ping
                     </span>
                     <span className="flex items-center gap-1.5 lg:gap-2">
                       <span className="w-2h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#e67e22]"></span> Jitter
                     </span>
                  </div>
                </div>
                <div className="h-48 lg:flex-1 w-full min-h-[150px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={150} minWidth={1}>
                     <LineChart data={latencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-stone-200 dark:text-[#333]" vertical={true} />
                        <XAxis dataKey="time" stroke="currentColor" className="text-stone-400 dark:text-[#666]" tick={{ fill: 'currentColor', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="currentColor" className="text-stone-400 dark:text-[#666]" tick={{ fill: 'currentColor', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          content={(props: any) => {
                              if (props.active && props.payload && props.payload.length) {
                                  return (
                                      <div className="bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-[#333] p-2 rounded-lg shadow-lg">
                                          <p className="text-stone-500 dark:text-[#888] text-[10px] mb-1">{props.label}</p>
                                          {props.payload.map((entry: any, index: number) => (
                                              <div key={index} className="text-xs font-bold" style={{ color: entry.color }}>
                                                  {entry.name}: {entry.value}
                                              </div>
                                          ))}
                                      </div>
                                  );
                              }
                              return null;
                          }}
                          cursor={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Line type="monotone" dataKey="ping" stroke="#00c3ff" strokeWidth={3} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="jitter" stroke="#e67e22" strokeWidth={3} dot={false} isAnimationActive={false} />
                     </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>
           </div>
           
        </div>
      </div>
      )}
    </div>
  );
};


