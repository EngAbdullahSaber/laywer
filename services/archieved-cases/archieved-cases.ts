import { api } from "../axios";

export async function getArchievedCases(lang: any) {
  let res = await api.get(`user/archived-lawsuits?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFile(lang: any) {
  let res = await api.get(`user/archived-lawsuits/export/export_xls`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedArchievedCases(lang: any, id: any) {
  let res = await api.get(`user/archived-lawsuits/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterArchievedCases(data: any, lang: any) {
  let res = await api.get(`user/archived-lawsuits?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateArchievedCases(data: any, lang: any) {
  let res = await api.post(`user/archived-lawsuits`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteArchievedCases(id: any, lang: any) {
  let res = await api.delete(`user/archived-lawsuits/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function getArchievedCasesPanigation(page: any, lang: any) {
  let res = await api.get(`user/archived-lawsuits?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateArchievedCases(data: any, id: any, lang: any) {
  let res = await api.put(`user/archived-lawsuits/${id}`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchArchievedCases(id: any, lang: any) {
  let res = await api.get(`user/archived-lawsuits?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
