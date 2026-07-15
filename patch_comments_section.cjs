const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

if (!code.includes("import { CommentItem }")) {
  code = code.replace("import Icon from './Icon';", "import Icon from './Icon';\nimport { CommentItem } from './CommentItem';");
}

code = code.replace(
  "const handleReaction = async (commentId: string, type: 'like' | 'dislike' | 'love') => {",
  "const handleReaction = async (commentId: string, replyId: string | null, type: 'like' | 'dislike' | 'love') => {"
);

code = code.replace(
  "    const updatedComments = comments.map(c => {\n      if (c.id === commentId) {\n        return { ...c, reactions: { ...c.reactions, [type]: c.reactions[type] + 1 } };\n      }\n      return c;\n    });",
  "    const updatedComments = comments.map(c => {\n      if (c.id === commentId) {\n        if (replyId) {\n          const replies = c.replies ? [...c.replies] : [];\n          const rIdx = replies.findIndex(r => r.id === replyId);\n          if (rIdx >= 0) {\n            replies[rIdx] = { ...replies[rIdx], reactions: { ...replies[rIdx].reactions, [type]: replies[rIdx].reactions[type] + 1 } };\n          }\n          return { ...c, replies };\n        }\n        return { ...c, reactions: { ...c.reactions, [type]: c.reactions[type] + 1 } };\n      }\n      return c;\n    });"
);

code = code.replace(
  "body: JSON.stringify({ action: 'reactComment', commentId, type }),",
  "body: JSON.stringify({ action: 'reactComment', commentId, replyId, type }),"
);

const oldCommentsList = `<AnimatePresence>
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <SiWolframlanguage size={20} className="text-slate-800 dark:text-slate-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                        {comment.author}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {comment.tags && comment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {comment.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[9px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed mb-3">
                      {comment.text}
                    </p>
                    
                    {/* Reactions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button 
                        onClick={() => handleReaction(comment.id, 'like')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700/50"
                      >
                        👍 <span>{comment.reactions?.like || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(comment.id, 'dislike')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700/50"
                      >
                        👎 <span>{comment.reactions?.dislike || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(comment.id, 'love')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-500/20"
                      >
                        ❤️ <span>{comment.reactions?.love || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>`;

const newCommentsList = `<AnimatePresence>
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                onReaction={handleReaction}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </AnimatePresence>`;

code = code.replace(oldCommentsList, newCommentsList);


const replySubmitHandler = `
  const handleReplySubmit = async (commentId: string, replyText: string) => {
    const reply: CommentReply = {
      id: Date.now().toString(),
      author: authorName.trim() || 'Anonymous Wolf',
      text: replyText,
      timestamp: new Date().toISOString(),
      reactions: { like: 0, dislike: 0, love: 0 }
    };
    
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...(c.replies || []), reply] };
      }
      return c;
    });
    
    setComments(updatedComments);
    localStorage.setItem(\`comments_\${itemId}\`, JSON.stringify(updatedComments));
    
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addReply', commentId, reply }),
      });
    } catch (e) {
      // Ignored
    }
  };
`;

code = code.replace("const handleSubmit = async (e: React.FormEvent) => {", replySubmitHandler + "\n\n  const handleSubmit = async (e: React.FormEvent) => {");

fs.writeFileSync('components/CommentsSection.tsx', code);
