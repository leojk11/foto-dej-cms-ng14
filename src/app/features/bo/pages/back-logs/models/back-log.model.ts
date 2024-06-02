export interface BackLog {
  id: string;
  
  url: string;
  method: string;

  log_type: string;
  log_status: string;

  message: string;
  error: string;

  user: any;

  date: string;
  time: string;
};