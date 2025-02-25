import { api } from "../axios";

export async function getNotReplyedMessages(lang: any) {
  let res = await api.get(`client/client-inquiries?replied=0`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
export async function getReplyedMessages(lang: any) {
  let res = await api.get(`client/client-inquiries?replied=1`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}

export async function ReplyOnMessages(data: any, id: any, lang: any) {
  let res = await api.put(`client/client-inquiries/reply/${id}`, data, {
    headers: {
      "Content-Type": "application/json",

      "Accept-Language": lang,
    },
  });
  if (res) return res.data;
  else return false;
}
