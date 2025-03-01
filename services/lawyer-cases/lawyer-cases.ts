import { api } from "../axios";

export async function getLawyerCases(lang: any) {
  let res = await api.get(`court/cases?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedCases(lang: any, id: any) {
  let res = await api.get(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterLawyerCases(data: any, lang: any) {
  let res = await api.get(`court/cases?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function ChangeStatus(data: any, lang: any) {
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
export async function getLawyerCasesPanigation(page: any, lang: any) {
  let res = await api.get(`court/cases?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateCases(data: any, id: any, lang: any) {
  let res = await api.put(`court/cases/${id}`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchLawyerCases(id: any, lang: any) {
  let res = await api.get(`court/cases?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
