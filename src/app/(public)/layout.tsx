import AppNavbar from "@/components/common/app-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SidebarProvider>
        <div className="flex w-full">
          {/* <AppSidebar /> */}
          <div className="grow min-w-0 bg-primary/5">
            <AppNavbar />
            <section>{children}</section>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
