
export interface Session {
    name: string;
}

export type SessionAction = 'start' | 'stop' | 'notify';
export type SessionStatus = 'notStarted' | 'started' | 'stopped';

export interface SessionInfo {
    id: string;
    name: string;
    status: SessionStatus;
    configuration?: any;
    expirationTime: Date;
}

export interface SessionHostInfo extends SessionInfo {
    controlId: string;
}