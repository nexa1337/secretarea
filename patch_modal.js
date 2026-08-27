const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

content = content.replace(
  `const ResourceDetailModal: React.FC<{ 
  item: ResourceItem; 
  onClose: () => void;
  isHypervisor?: boolean;
  stash: string[];
  toggleStash: (id: string, e?: React.MouseEvent) => void;
  isPinned?: boolean;
  togglePin?: (id: string, e?: React.MouseEvent) => void;
}> = ({ item, onClose, isHypervisor, stash, toggleStash, isPinned, togglePin }) => {`,
  `const ResourceDetailModal: React.FC<{ 
  item: ResourceItem; 
  onClose: () => void;
  isHypervisor?: boolean;
  stash: string[];
  toggleStash: (id: string, e?: React.MouseEvent) => void;
  isPinned?: boolean;
  togglePin?: (id: string, e?: React.MouseEvent) => void;
  globalSpecs?: { ram: number, os: string, cpuModel: string, gpuModel: string, isActive: boolean };
}> = ({ item, onClose, isHypervisor, stash, toggleStash, isPinned, togglePin, globalSpecs }) => {`
);

content = content.replace(
  `<HardwareCompatibility requirements={item.systemReqs} />`,
  `<HardwareCompatibility requirements={item.systemReqs} globalSpecs={globalSpecs} />`
);

content = content.replace(
  `<ResourceDetailModal item={selectedResource}`,
  `<ResourceDetailModal globalSpecs={globalSpecs} item={selectedResource}`
);

content = content.replace(
  `<ResourceDetailModal 
              item={selectedResource}`,
  `<ResourceDetailModal 
              globalSpecs={globalSpecs}
              item={selectedResource}`
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log('Successfully patched ResourceDetailModal');
