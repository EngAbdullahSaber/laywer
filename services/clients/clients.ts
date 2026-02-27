import { api } from "../axios";

export async function getClients(lang: any) {
  let res = await api.get(`user/clients?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedClient(lang: any, id: any) {
  let res = await api.get(`user/clients/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getClientFile(lang: any) {
  let res = await api.get(`user/clients/export/export_xls`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterClients(data: any, lang: any) {
  let res = await api.get(`user/clients?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateClients(data: any, lang: any) {
  let res = await api.post(`user/clients`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function DeleteClients(id: any, lang: any) {
  let res = await api.delete(`user/clients/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getClientsPanigation(page: any, lang: any, search: string = "") {
  try {
    let res;
    
    if (search) {
      res = await api.get(`user/clients?page=${page}&per_page=10&search=${search}`, {
        headers: {
          "Accept-Language": lang,
        },
      });
    } else {
      res = await api.get(`user/clients?page=${page}&per_page=10`, {
        headers: {
          "Accept-Language": lang,
        },
      });
    }
    
    if (res && res.data) return res.data;
    return false;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return false;
  }
}

export async function UpdateClients(lang: any, id: any, queryParams: any) {
  let res = await api.put(`user/clients/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchClients(id: any, lang: any) {
  let res = await api.get(`user/clients?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
