const fs = require('fs');
let content = fs.readFileSync('pages/Settings.tsx', 'utf8');

// 1. Add addDoc, collection to imports
if (!content.includes('addDoc') || !content.includes('collection')) {
    content = content.replace(
        /import \{ doc, onSnapshot, updateDoc \} from 'firebase\/firestore';/,
        "import { doc, onSnapshot, updateDoc, addDoc, collection } from 'firebase/firestore';"
    );
}

// 2. Add state variables
const stateVars = `
    // Request form state
    const [requestTitle, setRequestTitle] = useState('');
    const [requestSection, setRequestSection] = useState('game');
    const [requestImageUrl, setRequestImageUrl] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
`;

content = content.replace(
    /    const \[cpuModel, setCpuModel\] = useState\(''\);\n    const \[ram, setRam\] = useState\(''\);/,
    "    const [cpuModel, setCpuModel] = useState('');\n    const [ram, setRam] = useState('');\n" + stateVars
);

// 3. Add handleSubmitRequest
const submitLogic = `
    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestTitle || !requestSection || !requestImageUrl || !user) return;
        setIsSubmittingRequest(true);
        try {
            await addDoc(collection(db, 'requests'), {
                title: requestTitle,
                section: requestSection,
                imageUrl: requestImageUrl,
                message: requestMessage,
                userId: user.uid,
                userEmail: user.email,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            setRequestSuccess(true);
            setRequestTitle('');
            setRequestSection('game');
            setRequestImageUrl('');
            setRequestMessage('');
            setTimeout(() => setRequestSuccess(false), 3000);
        } catch (error) {
            console.error("Error submitting request:", error);
        } finally {
            setIsSubmittingRequest(false);
        }
    };
`;

content = content.replace(
    /    const handleSaveHardware = async \(\) => \{/,
    submitLogic + "\n    const handleSaveHardware = async () => {"
);

// 4. Update the tabs array
content = content.replace(
    /\{ \['Profile', 'Hardware'\]\.map\(tab => \(/,
    "{ ['Profile', 'Hardware', 'Requests'].map(tab => ("
);

// 5. Add Requests tab content
const requestsContent = `
                {activeTab === 'Requests' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request Games/Tools</h2>
                            <p className="text-slate-600 dark:text-slate-400">Can't find what you're looking for? Send a request to the admin.</p>
                        </div>

                        <form onSubmit={handleSubmitRequest} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 dark:text-white">Title *</label>
                                <input 
                                    type="text" 
                                    value={requestTitle} 
                                    onChange={e => setRequestTitle(e.target.value)} 
                                    placeholder="Enter game or tool name"
                                    required
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#6366f1] transition-colors text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 dark:text-white">Section *</label>
                                <select 
                                    value={requestSection} 
                                    onChange={e => setRequestSection(e.target.value)} 
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#6366f1] transition-colors text-slate-900 dark:text-white appearance-none"
                                >
                                    <option value="game">game</option>
                                    <option value="hypervisor">hypervisor</option>
                                    <option value="steamtools">steamtools</option>
                                    <option value="tools">tools</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 dark:text-white">Image URL Good Quality *</label>
                                <input 
                                    type="url" 
                                    value={requestImageUrl} 
                                    onChange={e => setRequestImageUrl(e.target.value)} 
                                    placeholder="https://example.com/image.png"
                                    required
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#6366f1] transition-colors text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 dark:text-white">Message to Admin (Optional)</label>
                                <textarea 
                                    value={requestMessage} 
                                    onChange={e => setRequestMessage(e.target.value)} 
                                    placeholder="Any additional details..."
                                    rows={4}
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#6366f1] transition-colors text-slate-900 dark:text-white resize-none"
                                />
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex items-center justify-between">
                                <div>
                                    {requestSuccess && (
                                        <span className="text-emerald-500 font-medium flex items-center gap-2">
                                            <Icon name="CheckCircle" size={18} />
                                            Request sent successfully!
                                        </span>
                                    )}
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmittingRequest}
                                    className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmittingRequest ? 'Sending...' : 'Send Request'}
                                    <Icon name="Send" size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
`;

content = content.replace(
    /                    <\/div>\n                \)}\n            <\/div>\n        <\/div>\n    \);\n\};/,
    "                    </div>\n                )}\n" + requestsContent + "\n            </div>\n        </div>\n    );\n};"
);

fs.writeFileSync('pages/Settings.tsx', content);
console.log("pages/Settings.tsx updated");
