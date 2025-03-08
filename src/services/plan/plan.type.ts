export type PlanType = {
  id: number;
  app_id: number;
  name: string;
  duration_finance: number;
  description: string;
  harga: number;
  duration: number;
  app: {
    id: number;
    kode: string;
    deskripsi: string;
    name: string;
    jenis: string;
  };
  created_at: string;
  updated_at: string;
};

export type SubsType = {
  id: number;
  plan_id: number;
  client_id: number;
  expired_finance: string;
  status: string;
  start_date: string;
  end_date: string;
  plan: PlanType;
  created_at: string;
  updated_at: string;
};
