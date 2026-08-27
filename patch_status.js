const fs = require('fs');
const content = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetStr = `export const checkCompatibilityStatus = (userSpecs: {ram: number, os: string, cpuTier: number, gpuTier: number}, reqs: {label: string, value: string}[]) => {
  if (!reqs || reqs.length === 0) return 'unknown';
  const parsedReqs = analyzeRequirements(reqs);
  let status: 'pass'|'fail'|'warn' = 'pass';

  if (parsedReqs.minRam > 0 && userSpecs.ram < parsedReqs.minRam) status = 'fail';
  if (parsedReqs.minOs > 0 && parseInt(userSpecs.os) < parsedReqs.minOs) status = 'fail';
  
  if (status !== 'fail') {
      if (parsedReqs.minGpuTier > 1 && userSpecs.gpuTier < parsedReqs.minGpuTier) status = 'warn';
      if (parsedReqs.minCpuTier > 1 && userSpecs.cpuTier < parsedReqs.minCpuTier) status = 'warn';
  }
  return status;
};`;

const replacementStr = `export const checkCompatibilityStatus = (userSpecs: {ram: number, os: string, cpuTier: number, gpuTier: number}, reqs: {label: string, value: string}[]) => {
  if (!reqs || reqs.length === 0) return 'unknown';
  const parsedReqs = analyzeRequirements(reqs);
  let status: 'pass'|'fail'|'warn' = 'pass';

  if (parsedReqs.minRam > 0 && userSpecs.ram < parsedReqs.minRam) status = 'fail';
  if (parsedReqs.minOs > 0 && parseInt(userSpecs.os) < parsedReqs.minOs) status = 'fail';
  
  if (status !== 'fail') {
      let gpuDiff = parsedReqs.minGpuTier > 1 ? parsedReqs.minGpuTier - userSpecs.gpuTier : 0;
      let cpuDiff = parsedReqs.minCpuTier > 1 ? parsedReqs.minCpuTier - userSpecs.cpuTier : 0;
      
      if (gpuDiff >= 2 || cpuDiff >= 2) status = 'fail';
      else if (gpuDiff === 1 || cpuDiff === 1) status = 'warn';
  }
  return status;
};`;

if (content.includes(targetStr)) {
    fs.writeFileSync('pages/SecretArea.tsx', content.replace(targetStr, replacementStr));
    console.log('Successfully patched checkCompatibilityStatus!');
} else {
    console.log('Target string not found for checkCompatibilityStatus!');
}
