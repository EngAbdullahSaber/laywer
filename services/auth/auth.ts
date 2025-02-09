import {api}  from "../axios";



export async function LogIn(data :any) {
    let res = await api.post(`user/auth/login`, data);
    if (res) return res.data;
    else return false;
}


export const VerifyLogin = async (
    data: { username: string; code: string },
    config: { headers: { Authorization: string } }
  ) => {
    try {
      const response = await api.post(
        "user/auth/verify_user", // Replace with your actual API endpoint
        data, // Send the username and OTP code as data
        config // Send headers containing the token
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw error to be handled in the component
    }
  };