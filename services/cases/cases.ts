import { api } from "../axios";

export async function getCases(lang: any) {
  let res = await api.get(`court/cases`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedClient(lang: any, id: any) {
  let res = await api.get(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterCases(data: any, lang: any) {
  let res = await api.get(`court/cases?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateCases(data: any, lang: any) {
  let res = await api.post(`court/cases`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function AskClient(data: any, lang: any) {
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
export async function DeleteCases(id: any, lang: any) {
  let res = await api.delete(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getCasesPanigation(page: any, lang: any) {
  let res = await api.get(`court/cases?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateCases(lang: any, id: any, queryParams: any) {
  let res = await api.put(`court/cases/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchCases(id: any, lang: any) {
  let res = await api.get(`court/cases?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
