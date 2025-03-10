import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { isDevMode } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import * as Const from '../app.const'
import { AccessInfoService } from './access-info.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class WebServiceService {
    private readonly SCREEN_MODE_PLUS = 'PLUS';
    private readonly SCREEN_MODE_MINUS = 'MINUS';
    private readonly FILE_TYPE_CSV = 'CSV';
    private readonly FILE_TYPE_PDF = 'PDF';
    private readonly FILE_TYPE_ZIP = 'ZIP';
    private readonly FILE_TYPE_EXCEL = 'EXCEL';

    private webServiceCnt = 0;
    private isWaiting = false;

    private loadingBarState: LoadingBarState;

    constructor(
        private router: Router,
        private http: HttpClient,
        private accessInfo: AccessInfoService,
        private loader: LoadingBarService,
        private snackbar: MatSnackBar,

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
                if (this.webServiceCnt <= 0) {
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

    callWs(serviceName: string, data: any, fncSuccess?: (data: any) => void, fncError?: (error: any) => void): Observable<any> {
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
                    fncError(error);
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
            }),
            finalize(() => this.fnWaitScreen(this.SCREEN_MODE_MINUS))
        );
    }

    callWebServiceForFileDownload(param: string, webServiceNm: string, fileType: string): void {
        this.fnWaitScreen(this.SCREEN_MODE_PLUS);

        const url = `${Const.service}${webServiceNm}${param}`;

        switch (fileType) {
            case this.FILE_TYPE_CSV:
            case this.FILE_TYPE_ZIP:
            case this.FILE_TYPE_EXCEL:
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = fileType === this.FILE_TYPE_CSV ? 'download.csv' :
                            fileType === this.FILE_TYPE_ZIP ? 'download.zip' : 'download.xlsx';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch(error => console.error('Error downloading file:', error));
                break;
            case this.FILE_TYPE_PDF:
                window.open(url);
                break;
        }

        this.fnWaitScreen(this.SCREEN_MODE_MINUS);
    }

    callWebServiceForFileUpload(serviceName: string, data: any, fncSuccess: (data: any) => void, fncError: (error: any) => void): Observable<any> {
        this.fnWaitScreen(this.SCREEN_MODE_PLUS);

        const url = `${Const.serverHost()}/${Const.projectName}/${Const.service}${serviceName}`;
        return this.http.post<any>(url, data, {
            reportProgress: true,
            observe: 'events'  // Theo dõi tiến trình upload
        }).pipe(
            map((event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                    console.log(`Upload Progress: ${Math.round((100 * event.loaded) / event.total)}%`);
                } else if (event.type === HttpEventType.Response) {
                    return this.handleResponse(event.body, fncSuccess);
                }
                return of(false);
            }),
            catchError(error => {
                if (fncError) {
                    fncError(error);
                } else {
                    this.handleError(error);
                }
                return of(false);
            }),
            finalize(() => this.fnWaitScreen(this.SCREEN_MODE_MINUS))
        );
    }

    callDownloadWs(serviceName: string, data: any, fncSuccess?: (data: any) => void, fncError?: (error: any) => void): Observable<any> {
        this.fnWaitScreen(this.SCREEN_MODE_PLUS);

        const url = `${Const.serverHost()}/${Const.projectName}/${Const.service}${serviceName}`;
        return this.http.post(url, data, {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            }),
            responseType: 'blob', // 🟢 Nhận dữ liệu dạng binary (file)
            observe: 'response'   // 🟢 Lấy cả response header
        }).pipe(
            map(response => {
                const contentDisposition = response.headers.get('Content-Disposition');
                let fileName = this.extractFileName(contentDisposition) || 'download.xlsx'; // Lấy tên file từ header
                if (!fileName.endsWith('.xlsx')) {
                    fileName += '.xlsx';
                }
                this.downloadFile(response.body as Blob, fileName);
                if (fncSuccess) fncSuccess(response.body);
                return response.body;
            }),
            catchError(error => {
                if (fncError) {
                    fncError(error);
                } else {
                    this.handleError(error);
                }
                return of(null);
            }),
            finalize(() => this.fnWaitScreen(this.SCREEN_MODE_MINUS))
        );
    }

    private extractFileName(contentDisposition: string | null): string | null {
        if (!contentDisposition) return null;

        // 🟢 Kiểm tra "filename*=" (UTF-8 format)
        let matches = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/);
        if (!matches) {
            // 🟢 Nếu không có "filename*=", kiểm tra "filename="
            matches = contentDisposition.match(/filename="([^"]+)"/);
        }

        if (matches && matches[1]) {
            return decodeURIComponent(matches[1].trim()); // 🟢 Giải mã tên file (nếu có ký tự đặc biệt)
        }

        return null;
    }

    private downloadFile(blob: Blob, fileName: string): void {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    private fnCheckCommonError(response: any): boolean {
        if (response.fatalError.length > 0) {
            const errors = response.fatalError;
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].errId === 'SYS_ERR_001' ||
                    errors[i].errId === 'SYS_ERR_002' ||
                    errors[i].errId === 'SYS_ERR_003') {


                    const navigationExtras: NavigationExtras = {
                        state: {
                            message: errors[i].errMsg
                        }
                    };
                    this.router.navigate(['/error/error-500'], navigationExtras);
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
