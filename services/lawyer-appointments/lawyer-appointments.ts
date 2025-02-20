import { api } from "../axios";

export async function getLawyerAppointements(lang: any) {
  let res = await api.get(`lawyer/appointments`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
// export async function getSpecifiedClient(lang: any, id: any) {
//   let res = await api.get(`user/LawyerAppointements/${id}`, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
export async function getFilterLawyerAppointements(data: any, lang: any) {
  let res = await api.get(`lawyer/appointments?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

// export async function DeleteLawyerAppointements(id: any, lang: any) {
//   let res = await api.delete(`user/LawyerAppointements/${id}`, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
export async function getLawyerAppointementsPanigation(page: any, lang: any) {
  let res = await api.get(`lawyer/appointments?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

// export async function UpdateLawyerAppointements(
//   lang: any,
//   id: any,
//   queryParams: any
// ) {
//   let res = await api.put(`user/LawyerAppointements/${id}?${queryParams}`, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }

export async function SearchLawyerAppointements(id: any, lang: any) {
  let res = await api.get(`lawyer/appointments?search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
