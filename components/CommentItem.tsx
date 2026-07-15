import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiWolframlanguage } from 'react-icons/si';
import Icon from './Icon';
import { Comment, CommentReply } from './CommentsSection';

interface CommentItemProps {
  comment: Comment;
  onReaction: (commentId: string, replyId: string | null, type: 'like' | 'dislike' | 'love') => void;
  onReplySubmit: (commentId: string, replyText: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onReaction, onReplySubmit }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(true);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
    setShowReplies(true);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-4"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner z-10">
          <SiWolframlanguage size={20} className="text-slate-800 dark:text-slate-200" />
        </div>
        <div className="flex-1 min-w-0 pb-2">
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
          
          {/* Reactions & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-blue-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest px-2 py-1 transition-colors">
              Reply
            </button>
            
            {hasReplies && (
              <button 
                onClick={() => setShowReplies(!showReplies)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-colors ml-auto flex items-center gap-1"
              >
                {showReplies ? <Icon name="ChevronUp" size={14}/> : <Icon name="ChevronDown" size={14}/>}
                {comment.replies!.length} {comment.replies!.length === 1 ? 'Reply' : 'Replies'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-4 ml-12 sm:ml-14 mb-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            <button type="submit" disabled={!replyText.trim()} className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 font-bold text-sm disabled:opacity-50 transition-colors">
              Post
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      <AnimatePresence>
        {hasReplies && showReplies && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-5 sm:ml-5 pl-7 sm:pl-9 border-l-2 border-slate-200 dark:border-slate-800 mt-2 space-y-4 pt-2"
          >
            {comment.replies!.map((reply, idx) => (
              <div key={reply.id} className="relative">
                {/* Horizontal connector line */}
                <div className="absolute -left-7 sm:-left-9 top-4 w-5 sm:w-7 h-[2px] bg-slate-200 dark:bg-slate-800"></div>
                
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 z-10">
                    <SiWolframlanguage size={14} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h5 className="font-black text-xs text-slate-800 dark:text-slate-200 truncate">
                        {reply.author}
                      </h5>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(reply.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words leading-relaxed mb-2">
                      <span className="text-blue-500 font-bold">@{comment.author}</span>, {reply.text}
                    </p>
                    
                    {/* Reply Reactions */}
                    
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
