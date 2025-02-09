import  {api}  from "../axios";

export async function getContactList(lang:any) {
    let res = await api.get(`client/contact_lists?per_page=10`, {
        headers: {
            'Accept-Language': lang  
        }
    });
    if (res) return res.data;
    else return false;
}
// export async function getSpecifiedLawyer(lang:any,id:any) {
//     let res = await api.get(`client/contact_lists?per_page=10/${id}`, {
//         headers: {
//             'Accept-Language': lang  
//         }
//     });
//     if (res) return res.data;
//     else return false;
// }
export async function getFilterContactList(data:any ,lang:any) {
    let res = await api.get(`client/contact_lists?per_page=10${data}`, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}
export async function CreateContactList(data:any,lang:any) {
    let res = await api.post(`client/contact_lists/store` ,data, {
        headers: {
            'Accept-Language': lang
        }
    });;
    if (res) return res.data;
    else return false;
}
// export async function blockLawyer(id:any,lang:any) {
//     let res = await api.put(`client/contact_lists?per_page=10/ban_lawyer/${id}`, {
//         headers: {
//             'Accept-Language': lang
//         }
//     });
//     if (res) return res.data;
//     else return false;
// }
// export async function DeleteLawyer(id:any,lang:any) {
//     let res = await api.delete(`client/contact_lists?per_page=10/${id}`, {
//         headers: {
//             'Accept-Language': lang
//         }
//     });
//     if (res) return res.data;
//     else return false;
// }
export async function getContactListPanigation(page:any ,lang:any) {
    let res = await api.get(`client/contact_lists?per_page=10?page=${page}`, {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}

// export async function UpdateLawyer(data:any ,id:any,lang:any ) {
//     let res = await api.post(`client/contact_lists?per_page=10/update_lawyer/${id}` ,data, {
//         headers: {
//             'Accept-Language': lang
//         }
//     });
//     if (res) return res.data;
//     else return false;
// }

export async function SearchContactList(id:any ,lang:any) {
    let res = await api.get(`client/contact_lists?per_page=10?category_filter=${id}` , {
        headers: {
            'Accept-Language': lang
        }
    });
    if (res) return res.data;
    else return false;
}