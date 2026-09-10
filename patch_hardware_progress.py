import re

with open('components/HardwareCompatibility.tsx', 'r') as f:
    content = f.read()

replacement = """const CircularProgress: React.FC<{ progress: number; colorClass: string }> = ({ progress, colorClass }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle 
          cx="24" 
          cy="24" 
          r={radius} 
          className="fill-none stroke-slate-200 dark:stroke-slate-800" 
          strokeWidth="4"
        />
        <circle 
          cx="24" 
          cy="24" 
          r={radius} 
          className={`fill-none stroke-current ${colorClass}`}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
        {progress}%
      </span>
    </div>
  );
};"""

content = re.sub(r'const CircularProgress: React\.FC<{ progress: number; colorClass: string }> = \({ progress, colorClass }\) => \{.*?</svg>\s*</div>\s*\);\s*};', replacement, content, flags=re.DOTALL)

with open('components/HardwareCompatibility.tsx', 'w') as f:
    f.write(content)
