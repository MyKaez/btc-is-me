import { HubConnection } from "@microsoft/signalr";
import { SessionInfo } from "./session";

export class ViewModel {
    constructor(public session: SessionInfo, public connection: HubConnection) { }

    get isSessionHost(): boolean {
        return 'controlId' in this.session;
    }
}