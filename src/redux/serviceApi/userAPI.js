import { createApi } from '@reduxjs/toolkit/query/react';

import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformRequest } from '../lib/requestMiddleware';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';


const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: defaultBaseQuery, // Replace with your API endpoint
    tagTypes: ['User'],
    endpoints: (builder) => ({
    

         // Add User 
         addUser: builder.mutation({
            query: (userDetails) => ({
                url: '/User/create',
                method: 'POST',
                body: transformRequest(userDetails)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

       
          getUserById: builder.query({
            query: (Id) => ({
                url: (`/User/${Id}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        updateUser: builder.mutation({
            query: (userDetails) => ({
                url: '/User/update',
                method: 'POST',
                body: transformRequest(userDetails)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getUserProfilePercentage: builder.query({
            query: () => ({
                url: '/User/GetUserProfilePercentage',
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
    }), 
});

export const { useAddUserMutation ,useUpdateUserMutation,useLazyGetUserByIdQuery,useLazyGetUserProfilePercentageQuery} = userAPI;
export default userAPI;
