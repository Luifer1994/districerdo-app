export interface DocumentType {
    id:   number;
    name: string;
    code: string;
}
export interface DocumentTypeResponse {
    status:  string;
    message: string;
    data:    DocumentType[];
}