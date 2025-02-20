import Cookies from "js-cookie";

export function getSession() {
  const session = Cookies.get("session");
  if (!session) return null;
  return session;
}

export function getSessionWms() {
  const session = Cookies.get("session_wms");
  if (!session) return null;
  return session;
}

export function getSessionCore() {
  const session = Cookies.get("session_core");
  if (!session) return null;
  return session;
}

export async function login(data: string) {
  Cookies.set("session", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}

export async function loginWms(data: string) {
  Cookies.set("session_wms", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}

export async function loginCore(data: string) {
  Cookies.set("session_core", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}

export async function logout() {
  Cookies.remove("session");
  Cookies.remove("session_wms");
  Cookies.remove("session_core");
}
