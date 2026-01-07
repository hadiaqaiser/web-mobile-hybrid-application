import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy {
  post?: Post;
  isFav = false;
  private sub?: Subscription;

  constructor(private route: ActivatedRoute, private postsService: PostsService) {
    this.sub = this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.post = this.postsService.getPostById(id);
      this.isFav = this.post ? this.postsService.isFavourite(this.post.id) : false;
    });
  }

  toggleFav() {
    if (!this.post) return;
    this.postsService.toggleFavourite(this.post.id);
    this.isFav = this.postsService.isFavourite(this.post.id);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
