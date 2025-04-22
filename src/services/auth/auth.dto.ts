export type UserType = {
  id: number;
  username: string;
  is_changed: boolean;
  is_staff: boolean;
  roles: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    permission: {
      id: number;
      name: string;
      function: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
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
