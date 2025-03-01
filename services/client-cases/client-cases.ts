import { api } from "../axios";

export async function getClientCases(lang: any) {
  let res = await api.get(`court/cases?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getFilterClientCases(data: any, lang: any) {
  let res = await api.get(`court/cases?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getClientCasesPanigation(page: any, lang: any) {
  let res = await api.get(`court/cases?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchClientCases(id: any, lang: any) {
  let res = await api.get(`court/cases?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
