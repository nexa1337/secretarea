sed -i 's/interface Comment {/interface CommentReply {\n  id: string;\n  author: string;\n  text: string;\n  timestamp: string;\n  reactions: {\n    like: number;\n    dislike: number;\n    love: number;\n  };\n}\n\ninterface Comment {/g' components/CommentsSection.tsx

sed -i 's/timestamp: string;/timestamp: string;\n  replies?: CommentReply[];/g' components/CommentsSection.tsx
