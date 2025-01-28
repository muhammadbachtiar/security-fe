export type UserType = {
  id: number;
  username: string;
  is_changed: boolean;
  is_staff: boolean;
  deleted_at: null | Date;
  created_at: null | Date;
  updated_at: null | Date;
};

export type LoginResponseDto = {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: null;
    deleted_at: null | Date;
    created_at: null | Date;
    updated_at: null | Date;
  };
  token: string;
};
