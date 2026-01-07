import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Post, MediaType } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly POSTS_KEY = 'glowgirl_posts';
  private readonly FAV_KEY = 'glowgirl_favourites'; // legacy

  private posts: Post[] = [
    {
      id: 1,
      title: 'Self Care 💗',
      description: 'Glow from inside.',
      author: 'GlowGirl',
      isFavourite: false,
      mediaType: 'none',
    },
    {
      id: 2,
      title: 'Confidence ✨',
      description: 'You are enough.',
      author: 'GlowGirl',
      isFavourite: false,
      mediaType: 'none',
    },
  ];

  // ✅ important: keep a single promise so pages can await load
  private loadPromise: Promise<void>;

  constructor() {
    this.loadPromise = this.loadPosts();
  }

  // ✅ pages call this before reading posts
  async ready(): Promise<void> {
    await this.loadPromise;
  }

  // -------- reads --------
  getAllPosts(): Post[] {
    // return a new array so UI updates reliably
    return [...this.posts];
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }

  getFavouritePosts(): Post[] {
    return this.posts.filter((p) => !!p.isFavourite);
  }

  isFavourite(id: number): boolean {
    return !!this.getPostById(id)?.isFavourite;
  }

  // -------- actions --------
  addPost(data: {
    title: string;
    description: string;
    author: string;
    mediaType?: MediaType;
    mediaSrc?: string;
  }): void {
    const nextId = this.posts.length ? Math.max(...this.posts.map((p) => p.id)) + 1 : 1;

    this.posts.unshift({
      id: nextId,
      title: data.title,
      description: data.description,
      author: data.author,
      mediaType: data.mediaType ?? 'none',
      mediaSrc: data.mediaSrc,
      isFavourite: false,
    });

    void this.savePosts();
  }

  updatePost(
    id: number,
    data: {
      title: string;
      description: string;
      author: string;
      mediaType?: MediaType;
      mediaSrc?: string;
    }
  ): void {
    const p = this.getPostById(id);
    if (!p) return;

    p.title = data.title;
    p.description = data.description;
    p.author = data.author;
    p.mediaType = data.mediaType ?? 'none';
    p.mediaSrc = data.mediaSrc;

    void this.savePosts();
  }

  deletePost(id: number): void {
    this.posts = this.posts.filter((p) => p.id !== id);
    void this.savePosts();
  }

  toggleFavourite(id: number): void {
    const p = this.getPostById(id);
    if (!p) return;

    p.isFavourite = !p.isFavourite;
    void this.savePosts();
  }

  // -------- storage --------
  private async loadPosts(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.POSTS_KEY });

      if (value) {
        const saved: Post[] = JSON.parse(value);
        this.posts = (saved || []).map((p) => ({
          ...p,
          mediaType: p.mediaType ?? 'none',
          isFavourite: !!p.isFavourite,
        }));
        return;
      }

      // legacy favourites migration (optional)
      const legacy = await Preferences.get({ key: this.FAV_KEY });
      if (legacy.value) {
        const ids: number[] = JSON.parse(legacy.value) || [];
        this.posts = this.posts.map((p) => ({ ...p, isFavourite: ids.includes(p.id) }));
        await this.savePosts();
      }
    } catch {
      // ignore
    }
  }

  private async savePosts(): Promise<void> {
    try {
      await Preferences.set({
        key: this.POSTS_KEY,
        value: JSON.stringify(this.posts),
      });
    } catch {
      // ignore
    }
  }
}