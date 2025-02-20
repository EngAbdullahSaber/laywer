import { api } from "../axios";

export async function getCourts(lang: any) {
  let res = await api.get(`court/courts`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getCities(id: any, lang: any) {
  let res = await api.get(`court/regions/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getRegions(lang: any) {
  let res = await api.get(`court/regions`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedCourts(lang: any, id: any) {
  let res = await api.get(`court/courts/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterCourts(data: any, lang: any) {
  let res = await api.get(`court/courts${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateCourts(data: any, lang: any) {
  let res = await api.post(`court/courts`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteCourts(id: any, lang: any) {
  let res = await api.delete(`court/courts/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getCourtsPanigation(page: any, lang: any) {
  let res = await api.get(`court/courts?page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateCourts(queryParams: any, id: any, lang: any) {
  let res = await api.put(`court/courts/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchCourts(id: any, lang: any) {
  let res = await api.get(`court/courts?category_filter=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
