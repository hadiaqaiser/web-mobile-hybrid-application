import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { PostsService } from '../services/posts.service';
import { Post } from '../models/post.model';
import { NetworkService } from '../services/network.service';
import { PostCardComponent } from '../components/post-card/post-card.component';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, PostCardComponent],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  posts: Post[] = [];
  isOnline$ = this.networkService.isOnline$();

  constructor(
    private postsService: PostsService,
    private networkService: NetworkService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  async ionViewWillEnter() {
    await this.postsService.ready();
    this.posts = this.postsService.getAllPosts();
  }

  toggleFavourite(id: number) {
    this.postsService.toggleFavourite(id);
    this.posts = this.postsService.getAllPosts();
  }

  goEdit(id: number) {
    this.router.navigate(['/tabs/tab2'], { queryParams: { editId: id } });
  }

  async confirmDelete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete post?',
      message: 'This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.postsService.deletePost(id);
            this.posts = this.postsService.getAllPosts();
          },
        },
      ],
    });

    await alert.present();
  }
}