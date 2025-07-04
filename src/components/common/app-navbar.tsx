"use client";
import { usePathname } from "next/navigation";
import { Avatar, Dropdown } from "antd";
import { ChevronDownIcon, PowerIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import AuthService from "@/services/auth/auth.service";
import { cn } from "@/lib/utils";
import { authStore } from "@/store/auth.store";

function AppNavbar() {
  const pathname = usePathname();
  const store = authStore();

  const handleLogout = () => {
    Cookies.remove("session_core");
    Cookies.remove("session_wms");
    Cookies.remove("session_hrd");
    store.logout();
    window.location.href = "/login";
  };

  const { data: user } = useQuery({
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  if (pathname === "/warehouse/login" || pathname === "/human-resource/login") {
    return null;
  }

  return (
    <nav
      className={cn(
        "h-14 px-4 w-full border-b flex items-center bg-white justify-end"
      )}
    >
      <Dropdown
        placement="bottomRight"
        trigger={["click"]}
        overlayClassName="!min-w-[120px] !max-w-[120px]"
        menu={{
          style: {
            borderRadius: "12px",
            padding: "0px",
            overflow: "hidden",
          },
          items: [
            {
              key: "1",
              style: {
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: 0,
              },
              label: (
                <Link type="next-link" href="/profile" passHref>
                  <div className="flex items-center gap-3">
                    <UserIcon />
                    Profile
                  </div>
                </Link>
              ),
            },
            {
              key: "2",
              style: {
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: 0,
              },
              label: (
                <div
                  className="flex items-center gap-3"
                  data-test="logout-button"
                >
                  <PowerIcon />
                  Log out
                </div>
              ),
              danger: true,
              onClick: handleLogout,
            },
          ],
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <p>{user?.data.username}</p>
          <div className="flex items-center gap-1">
            <Avatar className="!bg-blue-300" icon={<UserIcon />} />

            <ChevronDownIcon />
          </div>
        </div>
      </Dropdown>
    </nav>
  );
}

export default AppNavbar;
