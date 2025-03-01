import { api } from "../axios";

export async function getStaff(lang: any) {
  let res = await api.get(`user/staffs?per_page=10`, {
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
export async function getFilterStaff(data: any, lang: any) {
  let res = await api.get(`user/staffs?per_page=10${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateStaff(data: any, lang: any) {
  let res = await api.post(`user/staffs`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
// export async function blockStaff(id: any, lang: any) {
//   let res = await api.put(`user/lawyers/ban_lawyer/${id}`, {
//     headers: {
//       "Accept-Language": lang,
//     },
//   });
//   if (res) return res.data;
//   else return false;
// }
export async function DeleteStaff(id: any, lang: any) {
  let res = await api.delete(`user/staffs/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getStaffPanigation(page: any, lang: any) {
  let res = await api.get(`user/staffs?page=${page}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function UpdateStaff(queryParams: any, id: any, lang: any) {
  let res = await api.put(`user/staffs/${id}`, queryParams, {
    headers: {
      "Accept-Language": lang,
      "Content-Type": "application/json",
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchStaff(id: any, lang: any) {
  let res = await api.get(`user/staffs?search=${id}&per_page=10`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
