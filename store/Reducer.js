const initialState = {
  lang: "en",
  user: "",
  userName: "",
  accessToken: null, // Access token
  refreshToken: null, // Refresh token
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        user: action.payload,
      };
      case "SET_USER_NAME":
        return {
          ...state,
          userName: action.payload,
        };
    case "SET_TOKENS": // Action to store access and refresh tokens
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
      case "SET_PHONE_TOKENS": // Action to store access and refresh tokens
      return {
        ...state,
        phoneToken: action.payload.phoneToken,
      };
    case "REMOVE_TOKENS": // Action to remove tokens
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
}