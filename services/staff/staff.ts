import { api } from "../axios";

export async function getStaff(lang: any) {
  let res = await api.get(`user/lawyers`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedStaff(lang: any, id: any) {
  let res = await api.get(`user/lawyers/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterStaff(data: any, lang: any) {
  let res = await api.get(`user/lawyers${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateStaff(data: any, lang: any) {
  let res = await api.post(`user/lawyers`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function blockStaff(id: any, lang: any) {
  let res = await api.put(`user/lawyers/ban_lawyer/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteStaff(id: any, lang: any) {
  let res = await api.delete(`user/lawyers/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getStaffPanigation(page: any, lang: any) {
  let res = await api.get(`user/lawyers?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateStaff(queryParams: any, id: any, lang: any) {
  let res = await api.put(`user/lawyers/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchStaff(id: any, lang: any) {
  let res = await api.get(`user/lawyers?category_filter=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
