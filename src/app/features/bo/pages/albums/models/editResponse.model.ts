import { Album } from "./album.model";

export interface EditResponse {
  message: string;
  actual_message: string;
  album: Album;
};
