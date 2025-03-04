import { api } from "../axios";

export async function getOrdersFromClients(lang: any) {
  let res = await api.get(`client/client_orders`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function AskAboutOrdersFromClients(lang: any, data: any) {
  let res = await api.post(`client/client_orders/ask-service`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterOrdersFromClients(data: any, lang: any) {
  let res = await api.get(`client/client_orders?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getOrdersFromClientsPanigation(page: any, lang: any) {
  let res = await api.get(`client/client_orders?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchOrdersFromClients(id: any, lang: any) {
  let res = await api.get(`client/client_orders?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteOrdersFromClients(id: any, lang: any) {
  let res = await api.delete(`client/client_orders/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateOrdersFromClients(data: any, lang: any) {
  let res = await api.post(`client/client_orders`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
