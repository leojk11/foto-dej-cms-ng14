// import { User } from "./user.model";

export interface LoginResponse {
    message: string;
    token: string;
    user: any;

    command?: string;
}