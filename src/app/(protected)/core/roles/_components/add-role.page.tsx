/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import errorResponse from "@/lib/error";
import CoreServices from "@/services/core/core.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Skeleton, Switch } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const tabOptions = [
  { label: "Core", value: "core" },
  { label: "HRD", value: "hrd" },
  { label: "Warehouse", value: "warehouse" },
];

function AddRolePage() {
  const [form] = Form.useForm();
  const roleName = Form.useWatch("name", form);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"core" | "hrd" | "warehouse">(
    "core"
  );
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["PERMISSIONS", activeTab],
    queryFn: async () => {
      const response = await CoreServices.getAllPermissions({
        page: 1,
        page_size: 9999,
        apps: activeTab,
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await CoreServices.createRole({
        ...val,
        permissions: selectedPermissions,
      });
      queryClient.invalidateQueries({
        queryKey: ["ROLES"],
      });
      toast.success("Role berhasil dibuat");
      form.resetFields();
      router.push("/core/roles");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Roles",
              url: "/core/roles",
            },
            {
              title: "Tambah Role",
              url: "#",
            },
          ]}
        />
      </div>
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div className="border-b pb-3">
          <p className="text-xl font-medium">Tambah Role</p>
        </div>

        <Form
          form={form}
          requiredMark
          layout="vertical"
          className="bg-white !p-3 rounded"
          onFinish={onSubmit}
        >
          <Form.Item
            label="Nama"
            name="name"
            className="w-full !mb-5"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input placeholder="Nama" maxLength={255} />
          </Form.Item>

          <div className="mb-4">
            <Tabs value={activeTab} className="w-[400px]">
              <TabsList>
                {tabOptions.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={() => setActiveTab(tab.value as typeof activeTab)}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <Skeleton />
          ) : (
            <div className="grid grid-cols-2 gap-y-3">
              {permissions?.data.map((perm) => (
                <div
                  className="flex gap-3 items-center capitalize"
                  key={perm.id}
                >
                  <Switch
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => {
                      if (selectedPermissions.includes(perm.id)) {
                        setSelectedPermissions((prev) =>
                          prev.filter((p) => p !== perm.id)
                        );
                        return;
                      }
                      setSelectedPermissions((prev) => [...prev, perm.id]);
                    }}
                  />
                  <p>{perm.function.split("-").join(" ")}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-5">
            <Button
              disabled={!selectedPermissions.length || !roleName}
              loading={loading}
              htmlType="submit"
              type="primary"
            >
              Tambah
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddRolePage;
