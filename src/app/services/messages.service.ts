import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from './language-service';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private messages: { [language: string]: { [msgCode: string]: string } } = {};
    private currentLanguage: string = 'EN'; // Mặc định là tiếng Anh
    private messagesSubject = new BehaviorSubject<{ [language: string]: { [msgCode: string]: string } }>({});

    constructor(@Inject(LanguageService) private languageService: LanguageService) {
        // Theo dõi ngôn ngữ thay đổi
        this.languageService.currentLanguage$.subscribe(lang => {
            this.currentLanguage = lang;
        });
    }

    /**
     * Load messages từ một đối tượng JSON
     * @param messagesData Dữ liệu messages theo từng ngôn ngữ
     */
    loadMessages(messagesData: { [language: string]: { [msgCode: string]: string } }) {
        this.messages = messagesData;
        this.messagesSubject.next(this.messages);
    }

    /**
     * Lấy message theo mã lỗi, tự động sử dụng ngôn ngữ hiện tại
     * @param msgCode Mã lỗi cần lấy
     * @returns Message tương ứng với ngôn ngữ hiện tại
     */
    getMessage(msgCode: string): string {
        return this.messages[this.currentLanguage]?.[msgCode] || `Unknown message: ${msgCode}`;
    }

    /**
     * Lấy danh sách tất cả messages theo ngôn ngữ hiện tại
     */
    getMessagesByLanguage(language: string): { [msgCode: string]: string } {
        return this.messages[language] || {};
    }

    /**
     * Lấy toàn bộ dữ liệu messages
     */
    getAllMessages(): { [language: string]: { [msgCode: string]: string } } {
        return this.messages;
    }
}
