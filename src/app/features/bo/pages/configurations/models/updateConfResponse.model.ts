import { Configuration } from "./configuration.model";

export interface UpdateConfResponse {
    configuration: Configuration;
    message: string;
}