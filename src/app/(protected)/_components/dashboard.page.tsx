import AppBreadcrumbs from "@/components/common/app-breadcrums";

function DashboardPage() {
  return (
    <div className="p-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Dashboard",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Dashboard</p>
      </div>
    </div>
  );
}

export default DashboardPage;
