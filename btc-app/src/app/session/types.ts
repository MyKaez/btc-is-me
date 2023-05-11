export interface Session {
    id: string;
    name: string;
    status: 'notStarted' | 'started' | 'stopped';
    configuration?: any;
    expirationTime: Date;
}

export interface ControlSession extends Session {
    controlId: string;
}