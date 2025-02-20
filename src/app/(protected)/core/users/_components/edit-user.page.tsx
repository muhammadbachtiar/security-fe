/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import errorResponse from "@/lib/error";
import CoreServices from "@/services/core/core.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Skeleton, Switch } from "antd";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditUserPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId } = useParams();

  const { data: roles, isLoading } = useQuery({
    queryKey: ["ROLES_DATA"],
    queryFn: async () => {
      const response = await CoreServices.getAllRoles({
        page: 1,
        page_size: 9999,
      });
      return response;
    },
  });

  const { data: user, isLoading: loadingRole } = useQuery({
    queryKey: ["ROLE", userId],
    queryFn: async () => {
      const response = await CoreServices.getOneUser(+userId, {
        with: "roles",
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await CoreServices.updateUser(+userId, {
        ...val,
        roles: selectedRoles,
      });
      queryClient.invalidateQueries({
        queryKey: ["USERS"],
      });
      queryClient.invalidateQueries({
        queryKey: ["USER", userId],
      });
      toast.success("User berhasil diperbarui");
      form.resetFields();
      router.push("/core/users");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      form.setFieldValue("username", user.data.username);
      setSelectedRoles(user.data.roles?.map((r) => r.id));
    }
  }, [user]);

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
              title: "Users",
              url: "/core/users",
            },
            {
              title: "Edit User",
              url: "#",
            },
          ]}
        />
      </div>
      {loadingRole ? (
        <Skeleton />
      ) : (
        <div className="bg-white p-4 rounded-lg space-y-4">
          <div className="border-b pb-3">
            <p className="text-xl font-medium">Edit User</p>
          </div>

          <Form
            form={form}
            requiredMark
            layout="vertical"
            className="bg-white !p-3 rounded"
            onFinish={onSubmit}
          >
            <div className="flex gap-3 mb-5">
              <Form.Item
                label="Username"
                name="username"
                className="w-full"
                rules={[{ required: true, message: "Username harus diisi" }]}
              >
                <Input placeholder="Username" maxLength={255} />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                className="w-full"
                rules={[{ required: true, message: "Password harus diisi" }]}
              >
                <Input.Password placeholder="Password" maxLength={255} />
              </Form.Item>
            </div>

            {isLoading ? (
              <Skeleton />
            ) : (
              <div className="grid grid-cols-2 gap-y-3">
                {roles?.data.map((role) => (
                  <div
                    className="flex gap-3 items-center capitalize"
                    key={role.id}
                  >
                    <Switch
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => {
                        if (selectedRoles.includes(role.id)) {
                          setSelectedRoles((prev) =>
                            prev.filter((p) => p !== role.id)
                          );
                          return;
                        }
                        setSelectedRoles((prev) => [...prev, role.id]);
                      }}
                    />
                    <p>{role.name}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-5">
              <Button
                disabled={!selectedRoles.length}
                loading={loading}
                htmlType="submit"
                type="primary"
              >
                Simpan
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export default EditUserPage;
