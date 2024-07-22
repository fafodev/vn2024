import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import * as Const from '../app.const'
import { AccessInfoService } from './access-info.service';
import { IObjectString } from '../app.interface';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';

@Injectable({
    providedIn: 'root'
})
export class WebServiceService {
    private readonly SCREEN_MODE_PLUS = 'PLUS';
    private readonly SCREEN_MODE_MINUS = 'MINUS';
    private readonly FILE_TYPE_CSV = 'CSV';
    private readonly FILE_TYPE_PDF = 'PDF';
    private readonly FILE_TYPE_ZIP = 'ZIP';

    private webServiceCnt = 0;
    private isWaiting = false;

    private loadingBarState: LoadingBarState;

    constructor(
        private router: Router,
        private http: HttpClient,
        private accessInfo: AccessInfoService,
        private loader: LoadingBarService,

    ) {
        this.loadingBarState = this.loader.useRef('router'); // Create a new LoadingBarState reference
    }

    private fnGetDisplayText(lang: string): string {
        switch (lang) {
            case "JP":
                return "読み込み中。。。";
            case "VI":
                return "Loading。。。";
            case "EN":
                return "Loading。。。";
            default:
                return "読み込み中。。。";
        }
    }

    private fnWaitScreen(mode: string): void {
        switch (mode) {
            case this.SCREEN_MODE_PLUS:
                if (!this.isWaiting) {
                    this.webServiceCnt += 1;
                    this.isWaiting = true;
                    this.loadingBarState.start(); // Start loading bar
                }
                break;
            case this.SCREEN_MODE_MINUS:
                this.webServiceCnt -= 1;
                if (this.webServiceCnt === 0) {
                    this.isWaiting = false;
                    this.loadingBarState.complete(); // Complete loading bar
                }
                break;
        }
    }

    private handleError(error: any): Observable<never> {
        const errorMsg = error.message || 'An unknown error occurred!';
        this.dispError('Error', errorMsg);
        return throwError(() => new Error(errorMsg));
    }

    private handleResponse(response: any, fncSuccess?: (data: any) => void): any {
        if (this.fnCheckCommonError(response)) {
            if (fncSuccess) {
                fncSuccess(response);
            }
            return response;  // Trả về dữ liệu thực tế
        }
        return null;  // Nếu có lỗi, trả về null hoặc một đối tượng lỗi cụ thể
    }

    callWs(serviceName: string, data: any, fncSuccess?: (data: any) => void, fncError?: () => void): Observable<any> {
        this.fnWaitScreen(this.SCREEN_MODE_PLUS);

        const url = `${Const.serverHost()}/${Const.projectName}/${Const.service}${serviceName}`;
        return this.http.post<any>(url, data, {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            })
        }).pipe(
            map(response => this.handleResponse(response, fncSuccess)),  // Trả về dữ liệu thực tế
            catchError(error => {
                if (fncError) {
                    fncError();
                } else {
                    this.handleError(error);
                }
                return of(null);  // Trả về null nếu có lỗi
            }),
            finalize(() => this.fnWaitScreen(this.SCREEN_MODE_MINUS))
        );
    }

    callSilentWs(serviceName: string, data: any, fncSuccess?: (data: any) => void, fncError?: () => void): Observable<any> {
        const url = `${Const.serverHost()}/${Const.projectName}/${Const.service}${serviceName}`;
        return this.http.post<any>(url, data, {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            })
        }).pipe(
            map(response => this.handleResponse(response, fncSuccess)),
            catchError(error => {
                if (fncError) {
                    fncError();
                } else {
                    this.handleError(error);
                }
                return of(false);
            })
        );
    }

    callWebServiceForFileDownload(param: string, webServiceNm: string, fileType: string): void {
        this.fnWaitScreen(this.SCREEN_MODE_PLUS);

        const url = `${Const.service}${webServiceNm}${param}`;
        switch (fileType) {
            case this.FILE_TYPE_CSV:
            case this.FILE_TYPE_ZIP:
                window.location.href = url;
                break;
            case this.FILE_TYPE_PDF:
                window.open(url);
                break;
        }

        this.fnWaitScreen(this.SCREEN_MODE_MINUS);
    }

    callWebServiceForFileUpload(serviceName: string, data: any, fncSuccess: (data: any) => void, fncError: () => void): Observable<any> {
        this.fnWaitScreen(this.SCREEN_MODE_PLUS);

        const url = `${Const.serverHost()}/${Const.projectName}/${serviceName}`;
        return this.http.post<any>(url, data, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map((event: any) => {
                if (event.type === HttpEventType.Response) {
                    const response = event.body;
                    return this.handleResponse(response, fncSuccess);
                }
                return of(false);
            }),
            catchError(error => {
                if (fncError) {
                    fncError();
                } else {
                    this.handleError(error);
                }
                return of(false);
            }),
            finalize(() => this.fnWaitScreen(this.SCREEN_MODE_MINUS))
        );
    }

    private fnCheckCommonError(response: any): boolean {
        if (response.fatalError.length > 0) {
            const errors = response.fatalError;
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].errId === 'MC000001' ||
                    errors[i].errId === 'MC000002' ||
                    errors[i].errId === 'MC000003') {

                    if (isDevMode()) {
                        // Logic for dev mode error handling
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private dispError(code: string, msg: string): void {
        let errorStr = '';
        errorStr += 'エラーが発生しました。\n\n';
        errorStr += 'エラーコード:' + code + '\n';
        errorStr += 'メッセージ:' + msg + '\n';

        window.alert(errorStr);
    }
}
