import  {api}  from "../axios";

export async function getLawyer(lang:any) {
    let res = await api.get(`user/lawyers`, {
        headers: {
            'Accept-Language': lang  
        }
    });
    if (res) return res.data;
    else return false;
}
export async function getSpecifiedLawyer(lang:any,id:any) {
    let res = await api.get(`user/lawyers/${id}`, {
        headers: {
            'Accept-Language': lang  
        }
    });
    if (res) return res.data;
    else return false;
}
export async function getFilterLawyer(data:any ,lang:any) {
    let res = await api.get(`user/lawyers${data}`, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}
export async function CreateLawyer(data:any,lang:any) {
    let res = await api.post(`user/lawyers` ,data, {
        headers: {
            'Accept-Language': lang
        }
    });;
    if (res) return res.data;
    else return false;
}
export async function blockLawyer(id:any,lang:any) {
    let res = await api.put(`user/lawyers/ban_lawyer/${id}`, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}
export async function DeleteLawyer(id:any,lang:any) {
    let res = await api.delete(`user/lawyers/${id}`, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}
export async function getLawyerPanigation(page:any ,lang:any) {
    let res = await api.get(`user/lawyers?page=${page}`, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}

export async function UpdateLawyer(data:any ,id:any,lang:any ) {
    let res = await api.post(`user/lawyers/update_lawyer/${id}` ,data, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}

export async function SearchLawyer(id:any ,lang:any) {
    let res = await api.get(`user/lawyers?category_filter=${id}` , {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}