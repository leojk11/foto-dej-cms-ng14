export interface Client {
  id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  phone_number: string;
  profile_image: string;
  account_status: string;
  active: boolean;
  created_date: Date;
  created_time: string;
  number_of_albums: number;
  created_by: CleanUser;
  modified_by: CleanUser;
  modified_date: string;
  modified_by_id: string;
  deleted_by: CleanUser;
  deleted_by_id: string;
}

export interface CleanUser{
  id: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  phone_number: string;
  username: string;
  role: string;
  profile_image: string
}

export interface ClientSearchParams {
  name: string;
  phone_number: string;
}