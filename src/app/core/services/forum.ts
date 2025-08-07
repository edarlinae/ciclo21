import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc, query, orderBy, Timestamp, where, getDocs, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth';
import { ForumPost } from '../../models/forum-post';
import { ForumReply } from '../../models/forum-reply';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  getPosts(): Observable<ForumPost[]> {
    const postsCollection = collection(this.firestore, 'forum-posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<ForumPost[]>;
  }

  async getPostById(postId: string): Promise<ForumPost | null> {
    const postRef = doc(this.firestore, `forum-posts/${postId}`);
    const docSnap = await getDoc(postRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as ForumPost : null;
  }

  getRepliesForPost(postId: string): Observable<ForumReply[]> {
    const repliesCollection = collection(this.firestore, `forum-posts/${postId}/replies`);
    const q = query(repliesCollection, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<ForumReply[]>;
  }

  createPost(postData: { title: string, content: string }): Promise<any> {
    const user = this.authService.userSubject.getValue();
    if (!user) return Promise.reject('User not logged in');

    const newPost: ForumPost = {
      ...postData,
      authorId: user.uid,
      authorEmail: user.email || 'Anónimo',
      createdAt: Timestamp.now(),
      replyCount: 0
    };
    const postsCollection = collection(this.firestore, 'forum-posts');
    return addDoc(postsCollection, newPost);
  }

  async addReply(postId: string, content: string): Promise<void> {
    const user = this.authService.userSubject.getValue();
    if (!user) throw new Error('User not logged in');

    const newReply: ForumReply = {
      postId,
      content,
      authorId: user.uid,
      authorEmail: user.email || 'Anónimo',
      createdAt: Timestamp.now()
    };
    
    const repliesCollection = collection(this.firestore, `forum-posts/${postId}/replies`);
    const postRef = doc(this.firestore, `forum-posts/${postId}`);
    const postSnap = await getDoc(postRef);
    const currentReplyCount = postSnap.data()?.['replyCount'] || 0;

    const batch = writeBatch(this.firestore);
    batch.set(doc(repliesCollection), newReply);
    batch.update(postRef, { replyCount: currentReplyCount + 1 });

    return batch.commit();
  }
}