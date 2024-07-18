import { IObjectString } from "./app.interface";
/**
 * [ログイン]画面
 * */
class DefaultItemName {
    JP: IObjectString;
    EN: IObjectString;
    VI: IObjectString;
    constructor() {
        this.JP = {
            title1: 'ようこそ',
            title2: '以下の資格情報でサインインしてください。',
            customerId: '顧客ID',
            username: 'ユーザー名',
            password: 'パスワード',
            loginbtn: 'ログイン',
            nextbtn: '次へ',
            passwordedit: 'パスワード変更',
            forgotpassword: 'パスワードを忘れた場合',
            end: '終了',
            error: '入力必須です。入力して下さい。',
            return: '戻る',
            logout: 'ログアウト',
            inputType: '目をクリックして表示を切り替える',
            registerTitle1: 'アカウントをお持ちでない場合は',
            registerTitle2: 'こちらをクリックして作成してください',
        };

        this.EN = {
            title1: 'Welcome back',
            title2: 'Sign in with your credentials below.',
            customerId: 'Customer ID',
            username: 'Username',
            password: 'Password',
            loginbtn: 'Sign in',
            nextbtn: 'Next',
            passwordedit: 'Change password',
            forgotpassword: 'Forgot Password?',
            end: 'END',
            error: 'You need to input.',
            return: 'Back',
            logout: 'Logout',
            inputType: 'Click the eye to toggle visibility',
            registerTitle1: 'Don\'t have an account?',
            registerTitle2: 'Click here to create one',
        };

        this.VI = {
            title1: 'Chào mừng trở lại',
            title2: 'Đăng nhập bằng thông tin đăng nhập của quý khách bên dưới.',
            customerId: 'Mã khách hàng',
            username: 'Tên người dùng',
            password: 'Mật khẩu',
            loginbtn: 'ĐĂNG NHẬP',
            nextbtn: 'Next',
            passwordedit: 'Đổi mật khẩu',
            forgotpassword: 'Quên mật khẩu',
            end: 'Kết thúc',
            error: 'Trường bắt buộc, vui lòng nhập.',
            return: 'Trở về',
            logout: 'Thoát',
            inputType: 'Nhấn vào biểu tượng mắt để chuyển đổi hiển thị',
            registerTitle1: 'Chưa có tài khoản?',
            registerTitle2: 'Nhấn vào đây để tạo',
        };
    }
}
/**
 * [ログイン]画面
 * */
export const defaultItemName: IObjectString = new DefaultItemName();

class SystemerrorItemNm {
    JP: IObjectString;
    EN: IObjectString;
    VI: IObjectString;
    constructor() {
        this.JP = {
            title: 'システムエラー',
            btn: 'ログイン'
        };

        this.EN = {
            title: 'SYSTEM ERROR',
            btn: 'LOGIN'
        };

        this.VI = {
            title: 'LỖI HỆ THỐNG',
            btn: 'ĐĂNG NHẬP'
        };
    }
}

/**
 * [システムエラー]画面
 * */
export const systemerrorItemNm: IObjectString = new SystemerrorItemNm();