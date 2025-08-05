import { createSlice } from "@reduxjs/toolkit";
import { getAuthProps, setAuthProps, signOut } from "src/lib/authenticationLibrary";

const authData = getAuthProps();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: authData != null,
    userId: authData?.userId, //Set user data from cookie.
    token: authData?.token, //Set token data from cookie.
    authData,
    isLogedin:!!authData,
    isPasswordResetRequired : false,
    email: authData?.emailAddress
  },
  reducers: {
    authentication: (state, action) => {
      //Use to create cookie.
      const { ...newAuthProps } = action.payload;
      setAuthProps(newAuthProps);
      const { isAuthenticated, message, token, userId, sessionTimeout, emailAddress,fullname, ...permissionList } = action.payload;
      state.userId = userId;
      state.email = emailAddress
      state.userPermissions = permissionList;
      state.isLogedin = true;
      state.isPasswordResetRequired = action.payload.isResetPassword ? action.payload.isResetPassword : false
    },
    logout: (state) => {
      state.isLogedin = false;
      signOut();
    },
  },
});

export const { authentication, logout } = authSlice.actions;
export default authSlice.reducer;
