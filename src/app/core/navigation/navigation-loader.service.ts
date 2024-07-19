import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationLoaderService {
    private readonly _items: BehaviorSubject<NavigationItem[]> =
        new BehaviorSubject<NavigationItem[]>([]);

    get items$(): Observable<NavigationItem[]> {
        return this._items.asObservable();
    }

    set items(items: NavigationItem[]) {
        this._items.next(items);
    }

    constructor(private readonly layoutService: VexLayoutService) {
        this.loadNavigation();
    }

    loadNavigation(): void {
        this._items.next([]);
    }
}
