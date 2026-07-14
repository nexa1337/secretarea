sed -i '1510,1555c\
const analyzeRequirements = (reqs: {label: string, value: string}[]) => {\
  let minRam = 0;\
  let minOs = 0;\
  let minGpuTier = 1;\
  let minCpuTier = 1;\
  \
  reqs.forEach(req => {\
    const label = req.label.toLowerCase();\
    const val = req.value.toLowerCase();\
    \
    if (label.includes("memory") || label.includes("ram")) {\
      const match = val.match(/(\\d+)\\s*gb/);\
      if (match) minRam = parseInt(match[1]);\
      else {\
        const mbMatch = val.match(/(\\d+)\\s*mb/);\
        if (mbMatch) minRam = parseInt(mbMatch[1]) / 1024;\
      }\
    }\
    \
    if (label.includes("os") || label.includes("system") || label.includes("windows")) {\
      if (val.includes("11")) minOs = 11;\
      else if (val.includes("10")) minOs = 10;\
      else if (val.includes("8.1")) minOs = 8;\
      else if (val.includes("8")) minOs = 8;\
      else if (val.includes("7")) minOs = 7;\
    }\
    \
    if (label.includes("graphics") || label.includes("gpu") || label.includes("video")) {\
      if (val.match(/5090|5080|4090|4080|7900\\s?xtx|7900\\s?xt|3090|rx\\s?6950|rx\\s?6900|rx\\s?7900/)) minGpuTier = 6;\
      else if (val.match(/5070|4070\\s?ti|4070|3080\\s?ti|3080|6800\\s?xt|6800|7800\\s?xt|rx\\s?7800/)) minGpuTier = 5;\
      else if (val.match(/4060\\s?ti|4060|3070\\s?ti|3070|2080\\s?ti|6750\\s?xt|6700\\s?xt|7700\\s?xt|1080\\s?ti/)) minGpuTier = 4;\
      else if (val.match(/3060\\s?ti|3060|2070\\s?super|2070|2060\\s?super|2060|1080|1070\\s?ti|1070|6650\\s?xt|6600\\s?xt|6600|7600|rx\\s?5700\\s?xt|rx\\s?5700|arc\\s?a770/)) minGpuTier = 3;\
      else if (val.match(/1660\\s?ti|1660\\s?super|1660|1650\\s?super|1650|1060|1050\\s?ti|980\\s?ti|980|970|rx\\s?590|rx\\s?580|rx\\s?570|rx\\s?480|rx\\s?470|arc\\s?a750/)) minGpuTier = 2;\
      else if (val.match(/1050|1030|960|950|750\\s?ti|750|mx\\d{3}|intel\\s?hd|intel\\s?uhd|iris\\s?xe|vega\\s?\\d+/)) minGpuTier = 1;\
      else if (val.match(/(\\d+)\\s*gb\\s*vram|vram\\s*(\\d+)\\s*gb/)) {\
         const vramMatch = val.match(/(\\d+)\\s*gb\\s*vram|vram\\s*(\\d+)\\s*gb/);\
         const vram = parseInt(vramMatch?.[1] || vramMatch?.[2] || "0");\
         if (vram >= 16) minGpuTier = 5;\
         else if (vram >= 12) minGpuTier = 4;\
         else if (vram >= 8) minGpuTier = 3;\
         else if (vram >= 4) minGpuTier = 2;\
         else minGpuTier = 1;\
      }\
      else minGpuTier = 3;\
    }\
    \
    if (label.includes("processor") || label.includes("cpu")) {\
      if (val.match(/i9|ryzen\\s?9|threadripper|core\\s?ultra\\s?9/)) minCpuTier = 5;\
      else if (val.match(/i7|ryzen\\s?7|core\\s?ultra\\s?7/)) minCpuTier = 4;\
      else if (val.match(/i5|ryzen\\s?5|core\\s?ultra\\s?5/)) minCpuTier = 3;\
      else if (val.match(/i3|ryzen\\s?3|pentium|celeron|athlon/)) minCpuTier = 2;\
      else minCpuTier = 3;\
    }\
  });\
  \
  return { minRam, minOs, minGpuTier, minCpuTier };\
};\
' pages/SecretArea.tsx
