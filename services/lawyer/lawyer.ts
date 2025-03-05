import { api } from "../axios";

export async function getLawyer(lang: any) {
  let res = await api.get(`user/lawyers?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedLawyer(lang: any, id: any) {
  let res = await api.get(`user/lawyers/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getLawyerFile(lang: any) {
  let res = await api.get(`user/lawyers/export/export_xls`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterLawyer(data: any, lang: any) {
  let res = await api.get(`user/lawyers?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateLawyer(data: any, lang: any) {
  let res = await api.post(`user/lawyers`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function blockLawyer(id: any, lang: any) {
  let res = await api.put(`user/lawyers/ban_lawyer/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteLawyer(id: any, lang: any) {
  let res = await api.delete(`user/lawyers/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getLawyerPanigation(page: any, lang: any) {
  let res = await api.get(`user/lawyers?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateLawyer(queryParams: any, id: any, lang: any) {
  let res = await api.put(`user/lawyers/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchLawyer(id: any, lang: any) {
  let res = await api.get(`user/lawyers?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
