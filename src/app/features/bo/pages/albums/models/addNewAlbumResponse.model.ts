import { Album } from "./album.model";

export interface AddNewAlbumResponse {
    message: string;
    album: Album;
}