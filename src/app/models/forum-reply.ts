import { Timestamp } from '@angular/fire/firestore';

export interface ForumReply {
  id?: string;
  postId: string;
  content: string;
  authorId: string;
  authorEmail: string;
  createdAt: Timestamp;
}