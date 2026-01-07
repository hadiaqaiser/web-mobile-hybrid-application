import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

import { PostsService } from '../services/posts.service';
import { MediaType, Post } from '../models/post.model';

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy {
  @ViewChild('galleryInput', { static: false }) galleryInput?: ElementRef<HTMLInputElement>;
  @ViewChild('cameraInput', { static: false }) cameraInput?: ElementRef<HTMLInputElement>;

  editingId: number | null = null;

  title = '';
  description = '';
  author = 'GlowGirl';

  mediaType: MediaType = 'none';
  mediaSrc = '';
  photoPreview = '';

  private sub?: Subscription;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ionViewWillEnter() {
    this.sub?.unsubscribe();
    this.sub = this.route.queryParamMap.subscribe((qp) => {
      const raw = qp.get('editId');
      const editId = raw ? Number(raw) : NaN;

      if (!Number.isNaN(editId) && editId > 0) {
        const p = this.postsService.getPostById(editId);
        if (p) {
          this.loadPost(p);
          return;
        }
      }

      this.resetForm();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private loadPost(p: Post) {
    this.editingId = p.id;
    this.title = p.title;
    this.description = p.description;
    this.author = p.author;

    this.mediaType = p.mediaType ?? 'none';
    this.mediaSrc = p.mediaSrc ?? '';
    this.photoPreview = this.mediaType === 'image' ? (this.mediaSrc || '') : '';
  }

  // -------------------------
  // IMAGE: Gallery button
  // -------------------------
  async pickFromGallery() {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      try {
        const img: Photo = await Camera.getPhoto({
          quality: 70,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos,
        });

        const src = img.webPath || '';
        this.setImage(src);
        return;
      } catch (e) {
        console.log('Native gallery failed, falling back to web picker', e);
      }
    }

    // WEB fallback: normal file picker
    this.galleryInput?.nativeElement.click();
  }

  // -------------------------
  // IMAGE: Camera button
  // -------------------------
  async takePhoto() {
    const isNative = Capacitor.isNativePlatform();

    // ✅ WEB: ALWAYS trigger camera input (if browser supports it)
    if (!isNative) {
      this.cameraInput?.nativeElement.click();
      return;
    }

    // ✅ NATIVE: force Camera
    try {
      const img: Photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      const src = img.webPath || (img.path ? Capacitor.convertFileSrc(img.path) : '');
      this.setImage(src);
    } catch (e) {
      // iOS simulator has no camera -> fallback to Photos
      console.log('Native camera failed (simulator), falling back to Photos', e);
      await this.pickFromGallery();
    }
  }

  // -------------------------
  // WEB file input handler
  // -------------------------
  async onWebFilePicked(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const dataUrl = await this.fileToDataUrl(file);
    this.setImage(dataUrl);

    // allow selecting same file again
    input.value = '';
  }

  private setImage(src: string) {
    this.mediaType = 'image';
    this.mediaSrc = src;
    this.photoPreview = src;
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  clearMedia() {
    this.mediaType = 'none';
    this.mediaSrc = '';
    this.photoPreview = '';
  }

  save() {
    if (!this.title.trim() || !this.description.trim() || !this.author.trim()) return;

    const payload = {
      title: this.title.trim(),
      description: this.description.trim(),
      author: this.author.trim(),
      mediaType: this.mediaType,
      mediaSrc:
        this.mediaType === 'none' ? undefined : (this.mediaSrc || '').trim() || undefined,
    };

    if (this.editingId) this.postsService.updatePost(this.editingId, payload);
    else this.postsService.addPost(payload);

    this.resetForm();
    this.navCtrl.navigateRoot('/tabs/tab1');
  }

  async deletePost() {
    if (!this.editingId) return;

    const alert = await this.alertCtrl.create({
      header: 'Delete post?',
      message: 'This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.postsService.deletePost(this.editingId!);
            this.resetForm();
            this.navCtrl.navigateRoot('/tabs/tab1');
          },
        },
      ],
    });

    await alert.present();
  }

  private resetForm() {
    this.editingId = null;
    this.title = '';
    this.description = '';
    this.author = 'GlowGirl';
    this.clearMedia();
  }
}