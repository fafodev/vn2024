import { isDevMode } from "@angular/core";

/** ルーティングのベース */
export const rootingbase = '';

/**Webサービス情報パス */
export const service = 'webapi/vijp/';

/**
 * 開発、検証本番環境用
 * ビルド過程で稼働環境用のサーバー名に置き換え
 */
export function serverHost(): string {
    return isDevMode() ? 'http://localhost:8181' : '';
}

export const projectName = 'vijp';

export type Language = 'EN' | 'JP' | 'VI';