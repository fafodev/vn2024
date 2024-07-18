import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { BusinessSelectionComponent } from './pages/business/business-selection/business-selection.component';

export const appRoutes: VexRoutes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/auth/login/login.component').then(
                (m) => m.LoginComponent
            )
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./pages/auth/register/register.component').then(
                (m) => m.RegisterComponent
            )
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import(
                './pages/auth/forgot-password/forgot-password.component'
            ).then((m) => m.ForgotPasswordComponent)
    },
    {
        path: 'business-selection',
        loadComponent: () =>
            import(
                './pages/business/business-selection/business-selection.component'
            ).then((m) => m.BusinessSelectionComponent)
    },
    //
    {
        path: 'dashboards',
        component: LayoutComponent,
        children: [
            {
                path: 'top',
                loadComponent: () =>
                    import(
                        './pages/business/top/top.component'
                    ).then((m) => m.TopComponent)
            },
            {
                path: 'user-master',
                loadComponent: () =>
                    import(
                        './pages/master/user-master/user-master.component'
                    ).then((m) => m.UserMasterComponent)
            },
            {
                path: 'school-master',
                loadComponent: () =>
                    import(
                        './pages/master/school-master/school-master.component'
                    ).then((m) => m.SchoolMasterComponent)
            }
        ]
    },
    {
        path: 'error/error-500',
        loadComponent: () =>
            import('./pages/errors/error-500/error-500.component').then(
                (m) => m.Error500Component
            )
    },
    {
        path: '**',
        loadComponent: () =>
            import('./pages/errors/error-404/error-404.component').then(
                (m) => m.Error404Component
            )
    }
];
