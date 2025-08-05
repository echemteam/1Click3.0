import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';

const recentViewAPI = createApi({
    reducerPath: 'recentViewAPI',
    baseQuery: defaultBaseQuery,
    endpoints: (builder) => ({
   
        getRecentViews: builder.query({
                query: (data) => ({
                    url: (`/RecentViewManagement/GetRecentViews?FilterByDate=${data.FilterByDate}`),
                    method: "GET",
                }),
               
                transformResponse: transformSucessResponse,
                transformErrorResponse: transformErrorResponse
            }),
    })
})

export const { useLazyGetRecentViewsQuery } = recentViewAPI;
export default recentViewAPI;