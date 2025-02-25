import { api } from "../axios";

export async function getServicesOrders(lang: any) {
  let res = await api.get(`court/service-orders`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
// export async function AskAboutServices(lang: any, data: any) {
//   let res = await api.post(`court/services/ask-service`, data, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
export async function getFilterServicesOrders(data: any, lang: any) {
  let res = await api.get(`court/service-orders?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getServicesPanigationOrders(page: any, lang: any) {
  let res = await api.get(`court/service-orders?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchServicesOrders(id: any, lang: any) {
  let res = await api.get(`court/service-orders?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
// export async function DeleteServicesOrders(id: any, lang: any) {
//   let res = await api.delete(`court/services/${id}`, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
// export async function CreateServicesOrders(data: any, lang: any) {
//   let res = await api.post(`court/services`, data, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
