import { api } from "../axios";

export async function getClientRequests(lang: any) {
  let res = await api.get(`client/client_orders`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function ReplyOnLawyer(lang: any, id: any, data: any) {
  let res = await api.post(`client/reply_order/${id}`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterClientRequests(data: any, lang: any) {
  let res = await api.get(`client/client_orders?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getClientRequestsPanigation(page: any, lang: any) {
  let res = await api.get(`client/client_orders?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchClientRequests(id: any, lang: any) {
  let res = await api.get(`client/client_orders?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
