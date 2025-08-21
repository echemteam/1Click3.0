import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';

const slugAPI = createApi({
    reducerPath: 'slugAPI',
    baseQuery: defaultBaseQuery,
    endpoints: (builder) => ({
        getStaticPageBySlug: builder.query({
            query: (slug) => ({
                url: `/StaticPage/GetStaticPageBySlug?slug=${slug}`,
                method: "GET",
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),

    })
})

export const { useLazyGetStaticPageBySlugQuery } = slugAPI;
export default slugAPI;