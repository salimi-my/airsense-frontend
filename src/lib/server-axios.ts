import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Returns a request-scoped Axios instance pre-configured with the caller's
 * session cookies and XSRF token. Wrapped in React's cache() so that multiple
 * server functions calling createServerAxios() within the same render share
 * one instance instead of each reading cookies and allocating a new object.
 */
export const createServerAxios = cache(async (): Promise<AxiosInstance> => {
  const cookieStore = await cookies();
  const xsrfCookie = cookieStore.get("XSRF-TOKEN");

  // Forward all cookies to maintain session state (excluding XSRF-TOKEN as it's handled separately)
  const allCookies = cookieStore.getAll();
  const cookieString = allCookies
    .filter((cookie) => cookie.name !== "XSRF-TOKEN")
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Referer: process.env.NEXT_PUBLIC_FRONTEND_URL,
      ...(cookieString && {
        Cookie: cookieString,
      }),
      ...(xsrfCookie && {
        "X-XSRF-TOKEN": decodeURIComponent(xsrfCookie.value),
      }),
    },
  });
});
