import { api } from "../axios";

export async function getCases(lang: any) {
  let res = await api.get(`court/cases?per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFile(lang: any) {
  let res = await api.get(`court/cases/export/export_xls`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getSpecifiedCases(lang: any, id: any) {
  let res = await api.get(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterCases(data: any, lang: any) {
  let res = await api.get(`court/cases?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateCases(data: any, lang: any) {
  let res = await api.post(`court/cases`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function AskClient(data: any, lang: any) {
  let res = await api.post(`court/cases/ask-client`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateNewDate(data: any, lang: any) {
  let res = await api.post(`court/cases/new-appointment`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function DeleteCases(id: any, lang: any) {
  let res = await api.delete(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function ChangeStatus(data: any, id: any, lang: any) {
  let res = await api.put(`court/cases/update-status/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getCasesPanigation(page: any, lang: any) {
  let res = await api.get(`court/cases?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateCases(data: any, id: any, lang: any) {
  let res = await api.put(`court/cases/${id}`, data, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchCases(id: any, lang: any) {
  let res = await api.get(`court/cases?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
/*   archived Cases  */
export async function getArchivedCases(lang: any) {
  let res = await api.get(`court/cases?per_page=10&status_filter=completed`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function SearchArchivedCases(id: any, lang: any) {
  let res = await api.get(
    `court/cases?per_page=10&status_filter=completed&search=${id}&per_page=10`,
    {
      headers: {
        "Accept-Language": lang,
      },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function getArchivedCasesPanigation(page: any, lang: any) {
  let res = await api.get(
    `court/cases?per_page=10&status_filter=completed&page=${page}&per_page=10`,
    {
      headers: {
        "Accept-Language": lang,
      },
    }
  );
  if (res) return res.data;
  else return false;
}
export async function DeleteArchivedCases(id: any, lang: any) {
  let res = await api.delete(`court/cases/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
