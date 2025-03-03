import { Component, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Language } from 'src/app/app.const';
import { AccessInfoService } from 'src/app/services/access-info.service';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';

const backToHomeLabel = {
    'EN': {
        backToHome: 'Back To Home',
        systemError: 'An unexpected system error occurred. Please contact the administrator for support.'
    },
    'JP': {
        backToHome: 'ホームに戻る',
        systemError: 'システムの予期しないエラーが発生しました。サポートが必要な場合は、管理者に連絡してください。'
    },
    'VI': {
        backToHome: 'Trở về trang chủ',
        systemError: 'Phát sinh lỗi ngoại lệ ngoài giả định của hệ thống, vui lòng liên hệ quản trị viên để được hỗ trợ.'
    }
};
@Component({
    selector: 'vex-error-500',
    templateUrl: './error-500.component.html',
    styleUrls: ['./error-500.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatButtonModule]
})
export class Error500Component implements OnInit {
    errorMessage: string | undefined;
    backToHomeLabel: string = 'Back To Home';
    currentLanguage$: Observable<string>;
    currentLanguage: Language = 'EN';

    constructor(
        private store: Store,
        private router: Router,
        private accessInfo: AccessInfoService
    ) {
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);
    }
    ngOnInit(): void {
        // Lấy thông tin từ state của ActivatedRoute
        const state = history.state;
        if (state && state.message) {
            this.errorMessage = state.message;
        } else {
            this.errorMessage = backToHomeLabel[this.currentLanguage].systemError;
        }

        // Cập nhật nhãn nút dựa trên ngôn ngữ hiện tại
        this.currentLanguage$.subscribe(language => {
            this.currentLanguage = language as Language;
            this.backToHomeLabel = backToHomeLabel[this.currentLanguage].backToHome;
        });
    }
    lnkToLogin() {
        this.accessInfo.clear();
        this.router.navigate(['/login']);
    }
}
