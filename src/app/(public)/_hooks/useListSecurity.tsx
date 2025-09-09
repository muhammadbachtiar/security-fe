import { useQuery } from "@tanstack/react-query";
import SecurityService from "@/services/security/security.service";

function useListSecurity(tenant: string, params: Record<string, string | number>  = {}) {
  return useQuery({
    queryKey: ["SECURITY", tenant, params],
    queryFn: async () => {
      const response = await SecurityService.getAll(tenant, params);
      return response;
    }
  });
}

export default useListSecurity;