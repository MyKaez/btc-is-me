export interface User {
    id: string;
    name: string;
}

export interface UserControl extends User {
    controlId: string;
}