import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AccessInfoService } from './services/access-info.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const accessInfo = inject(AccessInfoService);
    const token = accessInfo.token;

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};