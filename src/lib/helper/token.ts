import Cookies from "js-cookie";

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  const options = { path: "/", sameSite: "Lax" as const };
  Cookies.set("access_token", accessToken, options);
  Cookies.set("refresh_token", refreshToken, options);
};

export const removeAuthCookies = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};
