import { api } from "../axios";

export async function getOrdersFromClients(lang: any) {
  let res = await api.get(`court/services`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function AskAboutOrdersFromClients(lang: any, data: any) {
  let res = await api.post(`court/services/ask-service`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterOrdersFromClients(data: any, lang: any) {
  let res = await api.get(`court/services?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getOrdersFromClientsPanigation(page: any, lang: any) {
  let res = await api.get(`court/services?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchOrdersFromClients(id: any, lang: any) {
  let res = await api.get(`court/services?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteOrdersFromClients(id: any, lang: any) {
  let res = await api.delete(`court/services/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateOrdersFromClients(data: any, lang: any) {
  let res = await api.post(`court/services`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
