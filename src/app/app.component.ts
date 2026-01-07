import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule], // ✅ needed for ion-app + ion-router-outlet
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent { }