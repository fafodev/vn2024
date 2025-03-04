import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AccessInfoService } from './services/access-info.service';

@Component({
    selector: 'vex-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
    constructor(
        private router: Router,
        private accessInfo: AccessInfoService
    ) { }

    ngOnInit(): void {
        // Kiểm tra trạng thái đăng nhập
        if (!this.accessInfo.token) {
            this.accessInfo.clear();
            // Điều hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
            this.router.navigate(['/login']);
        }
    }
}
