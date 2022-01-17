import { BLUEBOARD_URL } from "@env";

export const Endpoints = {
  base: BLUEBOARD_URL + "/api",
  login: "/login",
  register: "/register",
  logout: "/logout",
  control: "/control",
  loloBase: "/lolo",
  kreta: {
    base: "/kreta",
    grades: "/kreta/grades",
  },
  permissions: {
    groups: "/permissions/groups",
    list: "/permissions/list",
  },
  users: "/users",
  qrcodes: "/qrcodes",
};
