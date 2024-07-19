import { Injectable } from '@angular/core';
import { AccessInfoService } from './access-info.service';
import { IObjectString } from '../app.interface';
import { NavigationLoaderService } from '../core/navigation/navigation-loader.service';

@Injectable({
    providedIn: 'root'
})
export class AppFunctionService {

    constructor(
        private accessInfo: AccessInfoService,
        private navigationLoaderService: NavigationLoaderService

    ) {
    }

    reloadListFunction(): void {
        console.log("reloadListFunction");
        this.navigationLoaderService.items = [{
            type: 'link',
            label: 'TOP',
            route: '/dashboards/top',
            icon: 'mat:insights',
            routerLinkActiveOptions: { exact: true }
        }, ...this.getListFunction()];
    }

    getListFunction(): any[] {
        var list: IObjectString = {
            'VI': [
                {
                    "type": "dropdown",
                    "label": "Nhập cảnh",
                    "icon": "mat:flight",
                    "children": [
                        {
                            "type": "link",
                            "label": "Danh sách lịch nhập cảnh",
                            "icon": "mat:list",
                            "route": "/dashboards/entry-schedule-list"
                        },
                        {
                            "type": "link",
                            "label": "Đăng ký lịch nhập cảnh",
                            "icon": "mat:add",
                            "route": "/dashboards/entry-schedule-register"
                        },
                        {
                            "type": "link",
                            "label": "Chỉnh sửa lịch nhập cảnh",
                            "icon": "mat:edit",
                            "route": "/dashboards/entry-schedule-edit"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "QL Học sinh",
                    "icon": "mat:school",
                    "children": [
                        {
                            "type": "link",
                            "label": "Danh sách thông tin sinh viên",
                            "icon": "mat:list",
                            "route": "/dashboards/student-info-list"
                        },
                        {
                            "type": "link",
                            "label": "Đăng ký thông tin sinh viên",
                            "icon": "mat:add",
                            "route": "/dashboards/student-info-register"
                        },
                        {
                            "type": "link",
                            "label": "Cập nhật thông tin sinh viên",
                            "icon": "mat:edit",
                            "route": "/dashboards/student-info-update"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "QL Thực tập sinh",
                    "icon": "mat:work",
                    "children": [
                        {
                            "type": "link",
                            "label": "Danh sách thực tập sinh",
                            "icon": "mat:list",
                            "route": "/dashboards/trainee-list"
                        },
                        {
                            "type": "link",
                            "label": "Đăng ký thực tập sinh",
                            "icon": "mat:add",
                            "route": "/dashboards/trainee-register"
                        },
                        {
                            "type": "link",
                            "label": "Đánh giá thực tập sinh",
                            "icon": "mat:assessment",
                            "route": "/dashboards/trainee-evaluation"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "QL Kỹ năng đặc định",
                    "icon": "mat:build",
                    "children": [
                        {
                            "type": "link",
                            "label": "Đăng ký kỹ năng",
                            "icon": "mat:add",
                            "route": "/dashboards/skill-register"
                        },
                        {
                            "type": "link",
                            "label": "Đánh giá kỹ năng",
                            "icon": "mat:assessment",
                            "route": "/dashboards/skill-evaluation"
                        },
                        {
                            "type": "link",
                            "label": "Cập nhật kỹ năng",
                            "icon": "mat:edit",
                            "route": "/dashboards/skill-update"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Hỗ trợ",
                    "icon": "mat:help",
                    "children": [
                        {
                            "type": "link",
                            "label": "Kiểm tra trạng thái hỗ trợ",
                            "icon": "mat:visibility",
                            "route": "/dashboards/support-status-check"
                        },
                        {
                            "type": "link",
                            "label": "Yêu cầu hỗ trợ",
                            "icon": "mat:assignment",
                            "route": "/dashboards/support-request"
                        },
                        {
                            "type": "link",
                            "label": "Hoàn thành hỗ trợ",
                            "icon": "mat:check_circle",
                            "route": "/dashboards/support-completion"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Thanh toán",
                    "icon": "mat:receipt",
                    "children": [
                        {
                            "type": "link",
                            "label": "Danh sách hóa đơn",
                            "icon": "mat:list",
                            "route": "/dashboards/invoice-list"
                        },
                        {
                            "type": "link",
                            "label": "Phát hành hóa đơn",
                            "icon": "mat:add",
                            "route": "/dashboards/invoice-issue"
                        },
                        {
                            "type": "link",
                            "label": "Chỉnh sửa hóa đơn",
                            "icon": "mat:edit",
                            "route": "/dashboards/invoice-edit"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "QL Công việc",
                    "icon": "mat:assignment",
                    "children": [
                        {
                            "type": "link",
                            "label": "Danh sách công việc",
                            "icon": "mat:list",
                            "route": "/dashboards/task-list"
                        },
                        {
                            "type": "link",
                            "label": "Đăng ký công việc",
                            "icon": "mat:add",
                            "route": "/dashboards/task-register"
                        },
                        {
                            "type": "link",
                            "label": "Tiến độ công việc",
                            "icon": "mat:track_changes",
                            "route": "/dashboards/task-progress"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Hệ thống",
                    "icon": "mat:settings",
                    "children": [
                        {
                            "type": "link",
                            "label": "Quản lý người dùng",
                            "icon": "mat:people",
                            "route": "/dashboards/user-master"
                        },
                        {
                            "type": "link",
                            "label": "Cài đặt hệ thống",
                            "icon": "mat:settings",
                            "route": "/dashboards/system-settings"
                        },
                        {
                            "type": "link",
                            "label": "Nhật ký truy cập",
                            "icon": "mat:history",
                            "route": "/dashboards/access-logs"
                        }
                    ]
                }
            ],
            'JP': [
                {
                    "type": "dropdown",
                    "label": "入国管理",
                    "icon": "mat:flight",
                    "children": [
                        {
                            "type": "link",
                            "label": "入国予定一覧",
                            "icon": "mat:list",
                            "route": "/dashboards/entry-schedule-list"
                        },
                        {
                            "type": "link",
                            "label": "入国予定登録",
                            "icon": "mat:add",
                            "route": "/dashboards/entry-schedule-register"
                        },
                        {
                            "type": "link",
                            "label": "入国予定変更",
                            "icon": "mat:edit",
                            "route": "/dashboards/entry-schedule-edit"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "学生管理",
                    "icon": "mat:school",
                    "children": [
                        {
                            "type": "link",
                            "label": "学生情報一覧",
                            "icon": "mat:list",
                            "route": "/dashboards/student-info-list"
                        },
                        {
                            "type": "link",
                            "label": "学生情報登録",
                            "icon": "mat:add",
                            "route": "/dashboards/student-info-register"
                        },
                        {
                            "type": "link",
                            "label": "学生情報更新",
                            "icon": "mat:edit",
                            "route": "/dashboards/student-info-update"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "実習生管理",
                    "icon": "mat:work",
                    "children": [
                        {
                            "type": "link",
                            "label": "実習生一覧",
                            "icon": "mat:list",
                            "route": "/dashboards/trainee-list"
                        },
                        {
                            "type": "link",
                            "label": "実習生登録",
                            "icon": "mat:add",
                            "route": "/dashboards/trainee-register"
                        },
                        {
                            "type": "link",
                            "label": "実習生評価",
                            "icon": "mat:assessment",
                            "route": "/dashboards/trainee-evaluation"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "特定技能管理",
                    "icon": "mat:build",
                    "children": [
                        {
                            "type": "link",
                            "label": "技能登録",
                            "icon": "mat:add",
                            "route": "/dashboards/skill-register"
                        },
                        {
                            "type": "link",
                            "label": "技能評価",
                            "icon": "mat:assessment",
                            "route": "/dashboards/skill-evaluation"
                        },
                        {
                            "type": "link",
                            "label": "技能更新",
                            "icon": "mat:edit",
                            "route": "/dashboards/skill-update"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "サポート状況",
                    "icon": "mat:help",
                    "children": [
                        {
                            "type": "link",
                            "label": "サポート状況確認",
                            "icon": "mat:visibility",
                            "route": "/dashboards/support-status-check"
                        },
                        {
                            "type": "link",
                            "label": "サポート依頼",
                            "icon": "mat:assignment",
                            "route": "/dashboards/support-request"
                        },
                        {
                            "type": "link",
                            "label": "サポート完了",
                            "icon": "mat:check_circle",
                            "route": "/dashboards/support-completion"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "請求状況",
                    "icon": "mat:receipt",
                    "children": [
                        {
                            "type": "link",
                            "label": "請求書一覧",
                            "icon": "mat:list",
                            "route": "/dashboards/invoice-list"
                        },
                        {
                            "type": "link",
                            "label": "請求書発行",
                            "icon": "mat:add",
                            "route": "/dashboards/invoice-issue"
                        },
                        {
                            "type": "link",
                            "label": "請求書変更",
                            "icon": "mat:edit",
                            "route": "/dashboards/invoice-edit"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "業務管理",
                    "icon": "mat:assignment",
                    "children": [
                        {
                            "type": "link",
                            "label": "業務一覧",
                            "icon": "mat:list",
                            "route": "/dashboards/task-list"
                        },
                        {
                            "type": "link",
                            "label": "業務登録",
                            "icon": "mat:add",
                            "route": "/dashboards/task-register"
                        },
                        {
                            "type": "link",
                            "label": "業務進捗",
                            "icon": "mat:track_changes",
                            "route": "/dashboards/task-progress"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "管理画面",
                    "icon": "mat:settings",
                    "children": [
                        {
                            "type": "link",
                            "label": "ユーザー管理",
                            "icon": "mat:people",
                            "route": "/dashboards/user-master"
                        },
                        {
                            "type": "link",
                            "label": "システム設定",
                            "icon": "mat:settings",
                            "route": "/dashboards/system-settings"
                        },
                        {
                            "type": "link",
                            "label": "アクセスログ",
                            "icon": "mat:history",
                            "route": "/dashboards/access-logs"
                        }
                    ]
                }],
            'EN': [
                {
                    "type": "dropdown",
                    "label": "Immigration",
                    "icon": "mat:flight",
                    "children": [
                        {
                            "type": "link",
                            "label": "Entry Schedule List",
                            "icon": "mat:list",
                            "route": "/dashboards/entry-schedule-list"
                        },
                        {
                            "type": "link",
                            "label": "Entry Schedule Register",
                            "icon": "mat:add",
                            "route": "/dashboards/entry-schedule-register"
                        },
                        {
                            "type": "link",
                            "label": "Entry Schedule Edit",
                            "icon": "mat:edit",
                            "route": "/dashboards/entry-schedule-edit"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Student",
                    "icon": "mat:school",
                    "children": [
                        {
                            "type": "link",
                            "label": "Student Info List",
                            "icon": "mat:list",
                            "route": "/dashboards/student-info-list"
                        },
                        {
                            "type": "link",
                            "label": "Student Info Register",
                            "icon": "mat:add",
                            "route": "/dashboards/student-info-register"
                        },
                        {
                            "type": "link",
                            "label": "Student Info Update",
                            "icon": "mat:edit",
                            "route": "/dashboards/student-info-update"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Trainee",
                    "icon": "mat:work",
                    "children": [
                        {
                            "type": "link",
                            "label": "Trainee List",
                            "icon": "mat:list",
                            "route": "/dashboards/trainee-list"
                        },
                        {
                            "type": "link",
                            "label": "Trainee Register",
                            "icon": "mat:add",
                            "route": "/dashboards/trainee-register"
                        },
                        {
                            "type": "link",
                            "label": "Trainee Evaluation",
                            "icon": "mat:assessment",
                            "route": "/dashboards/trainee-evaluation"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Specific Skill",
                    "icon": "mat:build",
                    "children": [
                        {
                            "type": "link",
                            "label": "Skill Register",
                            "icon": "mat:add",
                            "route": "/dashboards/skill-register"
                        },
                        {
                            "type": "link",
                            "label": "Skill Evaluation",
                            "icon": "mat:assessment",
                            "route": "/dashboards/skill-evaluation"
                        },
                        {
                            "type": "link",
                            "label": "Skill Update",
                            "icon": "mat:edit",
                            "route": "/dashboards/skill-update"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Support Status",
                    "icon": "mat:help",
                    "children": [
                        {
                            "type": "link",
                            "label": "Support Status Check",
                            "icon": "mat:visibility",
                            "route": "/dashboards/support-status-check"
                        },
                        {
                            "type": "link",
                            "label": "Support Request",
                            "icon": "mat:assignment",
                            "route": "/dashboards/support-request"
                        },
                        {
                            "type": "link",
                            "label": "Support Completion",
                            "icon": "mat:check_circle",
                            "route": "/dashboards/support-completion"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Billing Status",
                    "icon": "mat:receipt",
                    "children": [
                        {
                            "type": "link",
                            "label": "Invoice List",
                            "icon": "mat:list",
                            "route": "/dashboards/invoice-list"
                        },
                        {
                            "type": "link",
                            "label": "Invoice Issue",
                            "icon": "mat:add",
                            "route": "/dashboards/invoice-issue"
                        },
                        {
                            "type": "link",
                            "label": "Invoice Edit",
                            "icon": "mat:edit",
                            "route": "/dashboards/invoice-edit"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Task Management",
                    "icon": "mat:assignment",
                    "children": [
                        {
                            "type": "link",
                            "label": "Task List",
                            "icon": "mat:list",
                            "route": "/dashboards/task-list"
                        },
                        {
                            "type": "link",
                            "label": "Task Register",
                            "icon": "mat:add",
                            "route": "/dashboards/task-register"
                        },
                        {
                            "type": "link",
                            "label": "Task Progress",
                            "icon": "mat:track_changes",
                            "route": "/dashboards/task-progress"
                        }
                    ]
                },
                {
                    "type": "dropdown",
                    "label": "Admin Panel",
                    "icon": "mat:settings",
                    "children": [
                        {
                            "type": "link",
                            "label": "User Management",
                            "icon": "mat:people",
                            "route": "/dashboards/user-master"
                        },
                        {
                            "type": "link",
                            "label": "System Settings",
                            "icon": "mat:settings",
                            "route": "/dashboards/system-settings"
                        },
                        {
                            "type": "link",
                            "label": "Access Logs",
                            "icon": "mat:history",
                            "route": "/dashboards/access-logs"
                        }
                    ]
                }
            ]
        }
        return list[this.accessInfo.language];
    }
}
