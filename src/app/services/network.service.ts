import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
    private online$ = new BehaviorSubject<boolean>(true);

    // call this once when app starts
    async init() {
        const status = await Network.getStatus();
        this.online$.next(status.connected);

        Network.addListener('networkStatusChange', (s) => {
            this.online$.next(s.connected);
        });
    }

    // components can subscribe to this
    isOnline$() {
        return this.online$.asObservable();
    }

    // quick current value (for button disable)
    isOnlineNow() {
        return this.online$.value;
    }
}