/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

// -------------------------Check login------------------------------------
export const isLogin = () => {
  const token = Cookies.get("access_token");
  return !!token;
};

// -----------------Get/set/remove item localstorage-----------------------
export const setItemLocalStorage = (key: string, value: any) =>
  typeof localStorage !== "undefined" && key && value
    ? localStorage.setItem(key, JSON.stringify(value))
    : null;

export const getItemLocalStorage = (key: string | null) =>
  typeof localStorage !== "undefined" && key
    ? JSON.parse(localStorage.getItem(key) as string)
    : null;

export const removeItemLocalStorage = (
  key: string | null,
  options?: { removeAll?: boolean }
) => {
  if (typeof localStorage === "undefined") {
    return false;
  }
  const { removeAll } = options || { removeAll: false };

  if (removeAll) {
    // Remove all item in localstorage
    localStorage.clear();
    return true;
  }

  if (!key) {
    return false;
  }

  localStorage.removeItem(key);
  return true;
};

interface optionsType {
  value: number;
  label: string;
}

export const transformOptions = (
  options: any[],
  idKey: string,
  nameKey: string
): optionsType[] => {
  return options.map((option) => ({
    value: option[idKey],
    label: option[nameKey],
  }));
};

export const transformOptionsDB = (options: string[]): optionsType[] => {
  return options.map((option) => ({
    value: Number(option),
    label: option,
  }));
};

export const roundToDecimal = (num: number): number => {
  const factor = Math.pow(10, 2);
  return Math.round(num * factor) / factor;
};
