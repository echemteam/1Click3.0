import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';


const contactUsAPI = createApi({
    reducerPath: 'contactUsAPI',
    baseQuery: defaultBaseQuery, 
    endpoints: (builder) => ({
        addContactUs: builder.mutation({
            query: (data) => ({
                url: '/ContactUs',
                method: 'POST',
                body: transformRequest(data)
            }),

            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
    }),
});

export const { useAddContactUsMutation } = contactUsAPI;
export default contactUsAPI;
