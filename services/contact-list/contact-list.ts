import { api } from "../axios";

export async function getContactList(lang: any) {
  let res = await api.get(`client/contact_lists?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactListFile(lang: any) {
  let res = await api.get(`client/contact_lists/export/export_xls`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterContactList(data: any, lang: any) {
  let res = await api.get(`client/contact_lists?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateContactList(data: any, lang: any) {
  let res = await api.post(`client/contact_lists/store`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteContactList(id: any, lang: any) {
  let res = await api.delete(`client/contact_lists/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getContactListPanigation(page: any, lang: any) {
  let res = await api.get(`client/contact_lists?per_page=10&page=${page}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateContactList(queryParams: any, id: any, lang: any) {
  let res = await api.put(`/client/contact_lists/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchContactList(id: any, lang: any) {
  let res = await api.get(`client/contact_lists?per_page=10&search=${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
