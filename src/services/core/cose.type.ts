export type TUser = {
  id: number;
  username: string;
  is_changed: boolean;
  is_staff: boolean;
  deleted_at: null | string;
  created_at: string;
  updated_at: string;
  roles: TRole[];
};

export type TRole = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  permission: TPermission[];
};

export type TPermission = {
  id: number;
  app: string;
  function: string;
  created_at: string;
  updated_at: string;
};
