export type THoliday = {
  id: number;
  name: string;
  date: string;
  description: null | string;
  created_at: string;
  updated_at: string;
};

export type RequestBodyHoliday = {
  name: string;
};
