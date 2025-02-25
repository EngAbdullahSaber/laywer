import { api } from "../axios";

export async function getOrders(lang: any) {
  let res = await api.get(`client/client-inquiries`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function AskAboutOrders(lang: any, data: any) {
  let res = await api.post(`client/client-inquiries`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterOrders(data: any, lang: any) {
  let res = await api.get(`court/services?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getOrdersPanigation(page: any, lang: any) {
  let res = await api.get(`court/services?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchOrders(id: any, lang: any) {
  let res = await api.get(`court/services?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteOrders(id: any, lang: any) {
  let res = await api.delete(`court/services/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateOrders(data: any, lang: any) {
  let res = await api.post(`court/services`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
