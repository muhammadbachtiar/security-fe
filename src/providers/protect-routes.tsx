"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authStore } from "@/store/auth.store";
import { Spin } from "antd";

function ProtectRoutes({ children }: { children: React.ReactNode }) {
  const { coreToken, hrdToken, whToken, hasHydrated } = authStore();
  const pathname = usePathname();
  const router = useRouter();

  const [redirecting, setRedirecting] = useState(false);

  const shouldRedirect = useMemo(() => {
    if (!hasHydrated) return false;

    if (pathname === "/human-resource/login" && hrdToken)
      return "/human-resource";
    if (pathname === "/warehouse/login" && whToken) return "/warehouse";
    if (pathname === "/core/login" && coreToken) return "/core";

    if (
      pathname?.startsWith("/human-resource") &&
      !hrdToken &&
      pathname !== "/human-resource/login"
    )
      return "/human-resource/login";

    if (
      pathname?.startsWith("/warehouse") &&
      !whToken &&
      pathname !== "/warehouse/login"
    )
      return "/warehouse/login";

    if (
      pathname?.startsWith("/core") &&
      !coreToken &&
      pathname !== "/core/login"
    )
      return "/core/login";

    return false;
  }, [pathname, coreToken, hrdToken, whToken, hasHydrated]);

  useEffect(() => {
    if (shouldRedirect) {
      setRedirecting(true);
      router.replace(shouldRedirect);
    } else {
      setRedirecting(false);
    }
  }, [shouldRedirect, router]);

  if (!hasHydrated || redirecting) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectRoutes;
