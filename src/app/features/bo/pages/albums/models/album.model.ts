import { CleanUser } from "src/app/shared/models/cleanUser.model";

export interface Album {
    id: string;
    title: string;
    date: string;

    images: string[];
    images_count: number;
    selected_images: string[];
    selected_images_count: number;

    assigned_date: string;
    assigned_to_id: string;
    assigned_to: CleanUser;
    assigned_by_id: string;
    assigned_by: CleanUser;

    created_date: string;
    created_by_id: string;
    created_by: CleanUser;

    modified_date: string;
    modified_by_id: string;
    modified_by: CleanUser;

    active: boolean;
    deleted_by_id: string;
    deleted_by: CleanUser;
}
