/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import errorResponse from "@/lib/error";
import { loginCore } from "@/lib/session";
import AuthService from "@/services/auth/auth.service";
import { authStore } from "@/store/auth.store";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function LoginPage() {
  const [form] = Form.useForm();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setRole, setToken, setUser } = authStore();

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const response = await AuthService.loginCore(values);
      const auth = await AuthService.me({
        with: "roles.permission",
        token: response.data.token,
      });

      const userPermissionsCore = Array.from(
        new Set(
          auth.data?.roles?.flatMap((role) =>
            role.permission.filter((p) => p.app === "core")
          )
        )
      );

      const { roles, ...userData } = auth.data;

      setToken("coreToken", response.data.token);
      setRole("coreRole", userPermissionsCore);
      setUser(userData);

      localStorage.setItem("permissions", JSON.stringify(userPermissionsCore));
      localStorage.setItem("user_data", JSON.stringify(userData));

      if (response.success) {
        loginCore(response.data.token);

        toast.success("Login Berhasil");
        router.replace("/");
      }
    } catch (error: any) {
      errorResponse(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full md:max-w-[50vw] xl:max-w-[30vw] max-xl:max-w-[500px] border rounded-md p-3">
        <div className="flex justify-center mb-5 border-b pb-3">
          <span className="text-primary font-bold text-xl">Login</span>
        </div>
        <Form
          form={form}
          requiredMark={undefined}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            className="!mb-2"
            rules={[{ required: true, message: "username harus diisi" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            className="!mb-2"
            rules={[
              { required: true, message: "password harus diisi" },
              { min: 6, message: "password minimal 6 karakter" },
            ]}
          >
            <Input.Password placeholder="Password" type="password" />
          </Form.Item>

          <Button
            loading={loading}
            className="!mt-4 w-full"
            htmlType="submit"
            type="primary"
          >
            Login
          </Button>
        </Form>
        <div className="flex justify-center pt-6">
          <Image
            alt="Sarana Logo"
            src="/images/sarana-logo.png"
            width={500}
            height={500}
            className="w-[100px]"
            priority
            sizes="500px"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
