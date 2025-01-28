"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "./image";
import { getMenus } from "@/configs/menus";
import { Button } from "antd";
import { HomeIcon } from "lucide-react";

const isActive = (pathname: string, item: string) => {
  if (item === "/human-resource" && pathname === "/human-resource") {
    return true;
  }

  if (item !== "/human-resource" && pathname.startsWith(item)) {
    return true;
  }

  return false;
};

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Sidebar className="bg-red-300">
      <SidebarContent>
        <SidebarHeader className="flex justify-center items-center my-10">
          <div className="w-[180px] flex justify-center mt-4">
            <Image alt="logo" src="/images/sarana-logo.png" />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenus(pathname).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      `py-5 flex gap-2 transition-all duration-300 hover:bg-primary/75 hover:text-white`,
                      isActive(pathname, item.url) &&
                        "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 space-y-4 flex items-center flex-col">
          <Button
            onClick={() => router.push("/")}
            icon={<HomeIcon className="w-4 h-4" />}
          >
            Kembali ke Home
          </Button>
          <p className="text-xs text-center">
            Copyright © {new Date().getFullYear()} Sarana Technology. All Rights
            Reserved
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
