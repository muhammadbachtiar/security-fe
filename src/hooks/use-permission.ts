import { AppPermission } from "@/configs/permissions";
import { authStore } from "@/store/auth.store";

function usePermission() {
  const { whRole, coreRole, hrdRole, user } = authStore();

  const checkPermission = (permission: AppPermission[]) => {
    if (user?.id === 1) {
      return true;
    }
    const allRoles = [...hrdRole, ...coreRole, ...whRole];
    return allRoles.some((perm) =>
      permission.includes(perm.function as AppPermission)
    );
  };

  return { checkPermission, userPermissions: [] };
}

export default usePermission;
