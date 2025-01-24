import Cookies from "js-cookie";

export function getSession() {
  const session = Cookies.get("session");
  if (!session) return null;
  return session;
}

export async function login(data: string) {
  Cookies.set("session", data, {
    expires: process.env.NODE_ENV === "development" ? 7 : 1,
  });
}

export async function logout() {
  Cookies.remove("session");
}
