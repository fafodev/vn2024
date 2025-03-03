import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifyModalComponent } from '../layouts/components/notify-modal/notify-modal.component';

@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    constructor(private dialog: MatDialog
    ) { }

    private openNotifyModal(type: string, message: string, okFunction: any, cancelFunction?: any) {
        const dialogRef = this.dialog.open(NotifyModalComponent, {
            data: {
                message: message,
                type: type
            },
            disableClose: true, // Prevent closing the modal when clicking outside
            width: '550px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'ok' && okFunction) {
                okFunction();
            } else if (result === 'cancel' && cancelFunction) {
                cancelFunction();
            }
        });
    }

    info(message: string, okFunction: any) {
        this.openNotifyModal("info", message, okFunction);
    }

    error(message: string, okFunction: any) {
        this.openNotifyModal("error", message, okFunction);
    }

    warning(message: string, okFunction: any) {
        this.openNotifyModal("warning", message, okFunction);
    }

    confirm(message: string, okFunction: any, cancelFunction: any) {
        this.openNotifyModal("confirm", message, okFunction, cancelFunction);
    }
}
