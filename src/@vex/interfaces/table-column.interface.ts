export interface TableColumn<T> {
    label: string;
    property: string;
    type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'labels';
    visible?: boolean;
    cssClasses?: string[];
}
