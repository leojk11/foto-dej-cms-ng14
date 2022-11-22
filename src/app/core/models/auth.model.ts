import { Admin } from "./admin.model";

export interface Auth {
    authToken: any;
    user: Admin | any;
}