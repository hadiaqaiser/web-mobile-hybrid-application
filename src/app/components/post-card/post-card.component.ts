import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { PinkGlowDirective } from '../../directives/pink-glow.directive';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, PinkGlowDirective],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() post!: Post;

  // ✅ favourite (heart)
  @Output() fav = new EventEmitter<number>();

  // ✅ edit (pencil)
  @Output() edit = new EventEmitter<number>();

  // ✅ delete (trash)
  @Output() del = new EventEmitter<number>();

  // ✅ this fixes directive boolean binding usage in HTML like: [appPinkGlow]="true"
  glowOn = true;
}