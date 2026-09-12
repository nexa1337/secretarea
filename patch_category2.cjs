const fs = require('fs');
let code = fs.readFileSync('pages/CategoryDetail.tsx', 'utf8');

// I need to make the Modal aware of tracking, but NexaProjectModal is defined outside the main component. 
// I'll pass the tracker function to the Modal.

code = code.replace(
    "const NexaProjectModal: React.FC<{ project: NexaProject; onClose: () => void }> = ({ project, onClose }) => {",
    "const NexaProjectModal: React.FC<{ project: NexaProject; onClose: () => void; onTrack: (p: any, t: any) => void }> = ({ project, onClose, onTrack }) => {"
);

code = code.replace(
    "                    {project.link && (",
    `
                    <div className="flex gap-3">
                        <button 
                            onClick={() => onTrack(project, 'like')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all font-semibold"
                        >
                            <Icon name="Heart" size={18} /> Like
                        </button>
                        <button 
                            onClick={() => onTrack(project, 'favorite')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all font-semibold"
                        >
                            <Icon name="Star" size={18} /> Favorite
                        </button>
                    </div>
                    {project.link && (`
);

code = code.replace(
    "<NexaProjectModal \n                project={activeNexaProject} \n                onClose={() => setActiveNexaProject(null)}",
    "<NexaProjectModal \n                project={activeNexaProject} \n                onClose={() => setActiveNexaProject(null)} \n                onTrack={trackProjectInteraction}"
);

fs.writeFileSync('pages/CategoryDetail.tsx', code);
