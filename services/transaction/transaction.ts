import { api } from "../axios";

export async function getTransaction(lang: any) {
  let res = await api.get(`client/transactions?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getRoles(lang: any) {
  let res = await api.get(`user/roles`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterTransaction(data: any, lang: any) {
  let res = await api.get(`client/transactions?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateTransaction(data: any, lang: any) {
  let res = await api.post(`client/transactions`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
// export async function blockTransaction(id: any, lang: any) {
//   let res = await api.put(`user/lawyers/ban_lawyer/${id}`, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
export async function DeleteTransaction(id: any, lang: any) {
  let res = await api.delete(`client/transactions/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getTransactionPanigation(page: any, lang: any) {
  let res = await api.get(`client/transactions?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateTransaction(queryParams: any, id: any, lang: any) {
  let res = await api.put(`client/transactions/${id}`, queryParams, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchTransaction(id: any, lang: any) {
  let res = await api.get(`client/transactions?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
