import { TDivision } from "../divisi/divisi.type";

export type TStaff = {
  id: 3;
  division_id: number;
  nip: string;
  nama: string;
  notelp: string;
  status: string;
  jabatan: string;
  alamat: string;
  ktp: string;
  tanggal_lahir: string;
  tanggal_masuk: string;
  status_pernikahan: string;
  email: string;
  gender: string;
  npwp: string;
  salary: number;
  overtime_count?: number;
  absences_count?: number;
  permit_count?: number;
  divisi: TDivision;
  overtime_sum_hours?: string | null;
  absences_sum_hours?: string | null;
  updated_at: string;
  created_at: string;
};

export type RequestBodyStaff = {
  division_id: number;
  nip: string;
  nama: string;
  notelp: string;
  status: string; //magang, kontrak, freelance, tetap
  jabatan: string;
  alamat: string;
  ktp: string;
  tanggal_lahir: string;
  tanggal_masuk: string;
  status_pernikahan: string;
  email: string;
  gender: string;
  npwp: string;
};
