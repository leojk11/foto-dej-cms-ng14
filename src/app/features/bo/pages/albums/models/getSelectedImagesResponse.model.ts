import { Image } from "./image.model";

export interface GetSelectedImagesResponse {
  id: string;
  album_id: string;
  images: Image[];
};
