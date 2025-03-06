import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();
    // Ghi đè hàm rangeLabel
    customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 / ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `( ${startIndex + 1}  -  ${endIndex} ) / ${length}`; // Thay "of" bằng "trong"
    };

    return customPaginatorIntl;
}