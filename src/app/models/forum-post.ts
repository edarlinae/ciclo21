import { Timestamp } from '@angular/fire/firestore';

export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorEmail: string;
  createdAt: Timestamp;
  replyCount?: number;
}