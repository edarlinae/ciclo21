import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { ForumService } from '../../core/services/forum';
import { ForumPost } from '../../models/forum-post';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './forum.html',
  styleUrl: './forum.scss'
})
export class ForumComponent implements OnInit {
  private forumService = inject(ForumService);
  
  public posts$!: Observable<ForumPost[]>;
  public showCreateForm = false;
  public newPost = { title: '', content: '' };

  ngOnInit(): void {
    this.posts$ = this.forumService.getPosts();
  }

  createPost(): void {
    if (this.newPost.title && this.newPost.content) {
      this.forumService.createPost(this.newPost)
        .then(() => {
          this.showCreateForm = false;
          this.newPost = { title: '', content: '' };
        })
        .catch(err => console.error(err));
    }
  }
}