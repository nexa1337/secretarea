cat << 'INNER_EOF' > tmp_top.txt
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiWolframlanguage } from 'react-icons/si';
import Icon from './Icon';

export interface CommentReply {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  reactions: {
    like: number;
    dislike: number;
    love: number;
  };
}

export interface Comment {
  id: string;
  itemId: string;
  author: string;
  text: string;
  tags: string[];
  reactions: {
    like: number;
    dislike: number;
    love: number;
  };
  timestamp: string;
  replies?: CommentReply[];
}

const AVAILABLE_TAGS = [
INNER_EOF
sed -i '1,/const AVAILABLE_TAGS = \[/d' components/CommentsSection.tsx
cat tmp_top.txt components/CommentsSection.tsx > tmp_combined.txt
mv tmp_combined.txt components/CommentsSection.tsx
