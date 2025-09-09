import { useQuery } from "@tanstack/react-query";
import SecurityService from "@/services/security/security.service";

function useOneSecurity( tenant: string, id :string, params: Record<string, string | number>  = {}) {
  return useQuery({
    queryKey: ["SECURITY", tenant, id, params],
    queryFn: async () => {
      const response = await SecurityService.getOne(tenant, id, params);
      return response;
    }
  });
}

export default useOneSecurity;