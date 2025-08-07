import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { ForumService } from '../../core/services/forum';
import { ForumPost } from '../../models/forum-post';
import { ForumReply } from '../../models/forum-reply';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './forum-detail.html',
  styleUrl: './forum-detail.scss'
})
export class ForumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);

  public post: ForumPost | null = null;
  public replies$!: Observable<ForumReply[]>;
  public newReplyContent = '';

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.forumService.getPostById(postId).then(post => this.post = post);
      this.replies$ = this.forumService.getRepliesForPost(postId);
    }
  }

  addReply(): void {
    if (this.post?.id && this.newReplyContent) {
      this.forumService.addReply(this.post.id, this.newReplyContent)
        .then(() => this.newReplyContent = '')
        .catch(err => console.error(err));
    }
  }
}