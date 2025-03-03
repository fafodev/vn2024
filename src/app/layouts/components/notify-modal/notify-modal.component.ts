import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Language } from 'src/app/app.const';
import { IObjectString } from 'src/app/app.interface';
import { selectCurrentLanguage } from 'src/app/state/language/language.selectors';

export const HeaderNotify: IObjectString = {
    'EN': {
        info: "Successfully",
        error: "Error",
        warning: "Warning",
        confirm: "Confirm",
        ok: "OK",
        cancel: "Cancel"
    },
    'JP': {
        info: "情報",
        error: "エラー",
        warning: "警告",
        confirm: "確認",
        ok: "確認",
        cancel: "キャンセル"
    },
    'VI': {
        info: "Thành công",
        error: "Lỗi",
        warning: "Cảnh báo",
        confirm: "Xác nhận",
        ok: "Đồng ý",
        cancel: "Hủy bỏ"
    }
}

@Component({
    selector: 'vex-notify-modal',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './notify-modal.component.html',
    styleUrl: './notify-modal.component.scss'
})
export class NotifyModalComponent {
    currentLanguage$: Observable<string>;
    currentLanguage: Language = 'EN';
    fontIconLoaded: boolean = false;

    constructor(
        private store: Store,
        private dialogRef: MatDialogRef<NotifyModalComponent>,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(MAT_DIALOG_DATA) public data: { message: string, type: string }
    ) {
        this.currentLanguage$ = this.store.select(selectCurrentLanguage);
        this.currentLanguage$.subscribe(language => {
            this.currentLanguage = language as Language;
            this.title = HeaderNotify[this.currentLanguage][this.data.type];
            this.okLabel = HeaderNotify[this.currentLanguage].ok;
            this.cancelLabel = HeaderNotify[this.currentLanguage].cancel;
        });

        if (!this.fontIconLoaded) {
            this.loadFont();
        }
    }

    type: string = this.data.type;
    message: string = this.data.message;
    title: string = "";
    okLabel: string = "";
    cancelLabel: string = "";

    close() {
        this.dialogRef.close('cancel');
    }

    okFunction() {
        this.dialogRef.close('ok');
    }

    loadFont() {
        this.fontIconLoaded = true;
        const scriptElem = this.renderer.createElement('script');
        this.renderer.setAttribute(scriptElem, 'crossorigin', 'anonymous');
        this.renderer.setAttribute(
            scriptElem,
            'src',
            'https://kit.fontawesome.com/24a46da608.js'
        );
        this.renderer.appendChild(this.document?.head, scriptElem);
    }
}
