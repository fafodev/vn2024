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
    return isDevMode() ? 'http://localhost:8080' : '';
}

export const projectName = 'vijp';

export type Language = 'EN' | 'JP' | 'VI';

export const pageSizeOptions = [20, 50, 100];
export const pageSize = 20;

export const MODE_UPD = 'update';
export const MODE_INS = 'create';

export const Language_JP: Language = 'JP';
export const Language_EN: Language = 'EN';
export const Language_VI: Language = 'VI';