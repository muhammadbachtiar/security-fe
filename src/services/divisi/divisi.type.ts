export type TDivision = {
  id: number;
  division_id: number;
  name: string;
  is_shift: boolean;
  deskripsi: null | string;
  sub: TDivision[];
  main: TDivision;
  created_at: string;
  updated_at: string;
};

export type RequestBodyDivision = {
  name: string;
  division?: RequestBodyDivision[];
};
