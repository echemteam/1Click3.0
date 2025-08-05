import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';

const recentViewManagementAPI = createApi({
    reducerPath: 'recentViewManagementAPI',
    baseQuery: defaultBaseQuery,
    endpoints: (builder) => ({
        createRecentView: builder.mutation({
            query: (data) => ({
                url: '/RecentViewManagement',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
    })
})

export const { useCreateRecentViewMutation } = recentViewManagementAPI;
export default recentViewManagementAPI;