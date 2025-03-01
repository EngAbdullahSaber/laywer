import { api } from "../axios";

export async function getServices(lang: any) {
  let res = await api.get(`court/services?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function AskAboutServices(lang: any, data: any) {
  let res = await api.post(`court/services/ask-service`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterServices(data: any, lang: any) {
  let res = await api.get(`court/services?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getServicesPanigation(page: any, lang: any) {
  let res = await api.get(`court/services?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchServices(id: any, lang: any) {
  let res = await api.get(`court/services?search=${id}?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteServices(id: any, lang: any) {
  let res = await api.delete(`court/services/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateServices(data: any, lang: any) {
  let res = await api.post(`court/services`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
