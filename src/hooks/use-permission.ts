import { AppPermission } from "@/configs/permissions";
import AuthService from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function usePermission() {
  const [permissions, setPermissions] = useState<string[]>([]);

  const { data: user } = useQuery({
    // improve with local storage
    queryKey: ["ME"],
    queryFn: async () => {
      const response = await AuthService.me();
      return response;
    },
  });

  const checkPermission = (permission: AppPermission[]) => {
    if (user?.data.id === 1) {
      return true;
    }
    return permission.some((perm) => permissions.includes(perm));
  };
  useEffect(() => {
    const permissionsLocal = localStorage.getItem("permissions") as string;
    const dataPermissions = JSON.parse(permissionsLocal);

    setPermissions(dataPermissions);
  }, []);

  return { checkPermission, userPermissions: permissions };
}

export default usePermission;
