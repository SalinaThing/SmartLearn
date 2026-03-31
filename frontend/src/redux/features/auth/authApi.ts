
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  success: boolean;
  message: string;
  token: string;
};

type RegistrationData = {
  name: string;
  email: string;
  password: string;
};

type ActivationResponse = {
  message: string;
};

type ActivationData = {
  activation_token: string;
  activation_code: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register
    registerUser: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            userRegistration({
              token: result.data.token,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Activation
    activation: builder.mutation<ActivationResponse, ActivationData>({
      query: ({ activation_token, activation_code }) => ({
        url: "activeUser",
        method: "POST",
        body: { activation_token, activation_code },
        credentials: "include" as const,
      }),
    }),

    //Login
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    //SocialAuth
    socialAuth: builder.mutation({
      query: ({ name, avatar, email }) => ({
        url: "social-auth",
        method: "POST",
        body: { name, avatar, email },
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    //LogOut
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            userLoggedOut()
          );
          dispatch(apiSlice.util.resetApiState());
        } catch (error: any) {
          console.log(error);
        }
      },
    })
  }),
});

export const {
  useRegisterUserMutation,
  useActivationMutation,
  useLoginUserMutation,
  useSocialAuthMutation,
  useLogoutUserMutation
} = authApi as any;
