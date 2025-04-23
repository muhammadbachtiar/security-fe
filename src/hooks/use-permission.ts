import { AppPermission } from "@/configs/permissions";
import { useEffect, useState } from "react";

function usePermission() {
  const [permissions, setPermissions] = useState<string[]>([]);

  const checkPermission = (permission: AppPermission[]) => {
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
