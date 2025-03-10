import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AccessInfoService } from './services/access-info.service';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'vex-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
    constructor(
        private router: Router,
        private accessInfo: AccessInfoService,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) { }

    fontIconLoaded = false;

    ngOnInit(): void {
        // Kiểm tra trạng thái đăng nhập
        if (!this.accessInfo.token) {
            this.accessInfo.clear();
            // Điều hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
            this.router.navigate(['/login']);
        }

        if (!this.fontIconLoaded) {
            this.loadFont();
        }
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
