export type UserType = {
  id: number;
  username: string;
  is_changed: boolean;
  is_staff: boolean;
  roles?: RoleType[];
  deleted_at: null | Date;
  created_at: null | Date;
  updated_at: null | Date;
};

export type RoleType = {
  name: string;
  created_at: string;
  updated_at: string;
  permission: PermissionType[];
};

export type PermissionType = {
  id: number;
  name: string;
  app: string;
  function: string;
  created_at: string;
  updated_at: string;
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
