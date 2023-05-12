
export interface Session {
    name: string;
}

export interface SessionInfo {
    id: string;
    name: string;
    status: 'notStarted' | 'started' | 'stopped';
    configuration?: any;
    expirationTime: Date;
}

export interface SessionHostInfo extends SessionInfo {
    controlId: string;
}