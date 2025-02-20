import { api } from "../axios";

export async function getCategory(category: any, lang: any) {
  let res = await api.get(`court/categories?category_type=${category}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getFilterCategory(data: any, category: any, lang: any) {
  let res = await api.get(`court/categories?category_type=${category}${data}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function CreateCategory(data: any, lang: any) {
  let res = await api.post(`court/categories/store`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
// export async function blockUsers(id:any,data:any,lang:any ,lang:any) {
//     let res = await api.patch(`api/v1/block-account/${id}?lang=${lang}`,data, {
//         headers: {
//             'Accept-Language': lang
//         }
//     });
//     if (res) return res.data;
//     else return false;
// }
export async function DeleteCategory(id: any, lang: any) {
  let res = await api.delete(`court/categories/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getCategoryPanigation(
  page: any,
  category: any,
  lang: any
) {
  let res = await api.get(
    `court/categories?page=${page}&category_type=${category}`,
    {
      headers: {
        "Accept-Language": lang,
      },
    }
  );
  if (res) return res.data;
  else return false;
}

export async function UpdateCategory(
  data: any,
  id: any,
  lang: any,
  queryParams: any
) {
  let res = await api.put(`court/categories/${id}?${queryParams}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function SearchCategory(id: any, category: any, lang: any) {
  let res = await api.get(
    `court/categories?category_type=${category}&search=${id}`,
    {
      headers: {
        "Accept-Language": lang,
      },
    }
  );
  if (res) return res.data;
  else return false;
}
