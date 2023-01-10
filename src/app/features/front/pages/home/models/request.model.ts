export interface Request {
  firstname: string;
  lastname: string;
  phone_number: string;
  email?: string;
}

export interface RequestResponse {
  message: string;
  actual_message: string;
}