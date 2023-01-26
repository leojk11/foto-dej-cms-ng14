import { GetSelectedImagesResponse } from "./getSelectedImagesResponse.model";

export interface SelectImagesResponse {
  message: string;
  actual_message: string;
  selected_images: GetSelectedImagesResponse;
};
