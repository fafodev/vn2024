import { Injectable } from '@angular/core';
import { AccessInfoService } from './access-info.service';
import { IObjectString } from '../app.interface';
import { NavigationLoaderService } from '../core/navigation/navigation-loader.service';
import { WebServiceService } from './web-service.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppFunctionService {

    constructor(
        private accessInfo: AccessInfoService,
        private navigationLoaderService: NavigationLoaderService,
        private readonly webService: WebServiceService,
    ) {
    }

    reloadListFunction(): void {
        this.getListFunction().subscribe(items => {
            this.navigationLoaderService.items = [{
                type: 'link',
                label: 'TOP',
                route: '/dashboards/top',
                icon: 'mat:insights',
                routerLinkActiveOptions: { exact: true }
            }, ...items];
        });
    }

    getListFunction(): Observable<any[]> {
        let request = {
            accessInfo: this.accessInfo.getAll()
        };

        return this.webService.callWs('getListFunction', request).pipe(
            map(response => response.navigationItems),
            catchError(() => of([]))
        );
    }
}
