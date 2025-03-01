import { api } from "../axios";

export async function getTasks(lang: any) {
  let res = await api.get(`user/tasks?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedTasks(lang: any, id: any) {
  let res = await api.get(`user/tasks/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterTasks(data: any, lang: any) {
  let res = await api.get(`user/tasks?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateTasks(data: any, lang: any) {
  let res = await api.post(`user/tasks`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function ChangeStatus(data: any, id: any, lang: any) {
  let res = await api.put(`user/tasks/update-status/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateNewDate(data: any, lang: any) {
  let res = await api.post(`user/tasks/new-appointment`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteTasks(id: any, lang: any) {
  let res = await api.delete(`user/tasks/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getTasksPanigation(page: any, lang: any) {
  let res = await api.get(`user/tasks?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateTasks(lang: any, id: any, queryParams: any) {
  let res = await api.put(`user/tasks/${id}`, queryParams, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchTasks(id: any, lang: any) {
  let res = await api.get(`user/tasks?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
