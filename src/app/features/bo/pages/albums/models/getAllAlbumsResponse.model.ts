import { Album } from "./album.model";

export interface GetAllAlbumsResponse {
    list: Album[];
    page: number;
    total: number;
};
