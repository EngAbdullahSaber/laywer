import { api } from "../axios";

export async function getAllpermissions(lang: any) {
  let res = await api.get(`user/permissions`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getAllRoles(lang: any) {
  let res = await api.get(`user/roles?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedRole(lang: any, id: any) {
  let res = await api.get(`user/roles/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterAllRoles(data: any, lang: any) {
  let res = await api.get(`user/roles?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getAllRolesPanigation(page: any, lang: any) {
  let res = await api.get(`user/roles?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchAllRoles(id: any, lang: any) {
  let res = await api.get(`user/roles?search=${id}?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteRole(id: any, lang: any) {
  let res = await api.delete(`user/roles/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateRole(data: any, lang: any) {
  let res = await api.post(`user/roles`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function UpdateRole(data: any, roleId: any, lang: any) {
  let res = await api.put(`user/roles/${roleId}`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}
