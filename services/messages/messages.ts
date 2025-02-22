import { api } from "../axios";

export async function getNotReplyedMessages(lang: any) {
  let res = await api.get(`court/services`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getReplyedMessages(lang: any) {
  let res = await api.get(`court/services`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function ReplyOnMessages(data: any, lang: any) {
  let res = await api.post(`court/services`, data, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
