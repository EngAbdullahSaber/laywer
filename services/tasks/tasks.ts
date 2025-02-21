import { api } from "../axios";

export async function getTasks(lang: any) {
  let res = await api.get(`court/cases`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedTasks(lang: any, id: any) {
  let res = await api.get(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterTasks(data: any, lang: any) {
  let res = await api.get(`court/cases?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateTasks(data: any, lang: any) {
  let res = await api.post(`court/cases`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function ChangeStatus(data: any, lang: any) {
  let res = await api.post(`court/cases/ask-client`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateNewDate(data: any, lang: any) {
  let res = await api.post(`court/cases/new-appointment`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteTasks(id: any, lang: any) {
  let res = await api.delete(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getTasksPanigation(page: any, lang: any) {
  let res = await api.get(`court/cases?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateTasks(lang: any, id: any, queryParams: any) {
  let res = await api.put(`court/cases/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchTasks(id: any, lang: any) {
  let res = await api.get(`court/cases?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
