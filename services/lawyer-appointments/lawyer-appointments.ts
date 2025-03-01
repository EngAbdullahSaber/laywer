import { api } from "../axios";

export async function getLawyerAppointements(lang: any) {
  let res = await api.get(`lawyer/appointments?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getFilterLawyerAppointements(data: any, lang: any) {
  let res = await api.get(`lawyer/appointments?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getLawyerAppointementsPanigation(page: any, lang: any) {
  let res = await api.get(`lawyer/appointments?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchLawyerAppointements(id: any, lang: any) {
  let res = await api.get(`lawyer/appointments?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
