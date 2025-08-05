import { createApi } from '@reduxjs/toolkit/query/react';
import { transformSucessResponse, transformErrorResponse } from '../lib/responseMiddleware';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformRequest } from '../lib/requestMiddleware';

const authapi = createApi({
    baseQuery: defaultBaseQuery, // Replace with your API endpoint
    tagTypes: ['Authentication'],
    endpoints: (builder) => ({
        userLogin: builder.mutation({
            query: (credentials) => ({
                url: '/Authentication/UserLogin', // Replace with your authentication endpoint
                method: 'POST',
                body: transformRequest(credentials)
            }),
            invalidatesTags: ['Authentication'],
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        forgotPassword: builder.mutation({
            query: (userDetails) => ({
                url: '/Authentication/ForgotPassword',
                method: 'POST',
                body: transformRequest(userDetails)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/Authentication/UpdatePassword',
                method: 'POST',
                body: transformRequest(data),
            }),
            invalidatesTags: ['Authentication'],
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        updateUserPassword: builder.mutation({
            query: (userDetails) => ({
                url: '/Authentication/UpdateUserPassword',
                method: 'POST',
                body: transformRequest(userDetails)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
    }),
});

export const { useUserLoginMutation, useForgotPasswordMutation, useUpdatePasswordMutation, useUpdateUserPasswordMutation } = authapi;
export default authapi;
