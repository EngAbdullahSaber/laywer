import Cookies from "js-cookie";

const initialState = {
  lang: "en",
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  userName: Cookies.get("userName") || null,
  accessToken: Cookies.get("accessToken") || null, // Access token
  phoneToken: Cookies.get("phoneToken") || null, // Refresh token
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_DATA":
      Cookies.set("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case "SET_USER_NAME":
      Cookies.set("userName", JSON.stringify(action.payload));
      return {
        ...state,
        userName: action.payload,
      };
    case "SET_TOKENS": // Action to store access and refresh tokens
      Cookies.set("accessToken", action.payload.accessToken);
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
    case "SET_PHONE_TOKENS": // Action to store access and refresh tokens
      Cookies.set("phoneToken", action.payload.phoneToken);
      return {
        ...state,
        phoneToken: action.payload.phoneToken,
      };
    case "REMOVE_TOKENS": // Action to remove tokens
      Cookies.remove("accessToken");
      Cookies.remove("phoneToken");
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
}
