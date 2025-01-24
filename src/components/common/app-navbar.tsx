import { SidebarTrigger } from "../ui/sidebar";

function AppNavbar() {
  return (
    <nav className="h-12 px-4 w-full border-b flex justify-between items-center bg-white">
      <SidebarTrigger />
    </nav>
  );
}

export default AppNavbar;
