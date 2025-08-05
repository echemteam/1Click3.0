import { createApi } from '@reduxjs/toolkit/query/react';
import { transformSucessResponse, transformErrorResponse } from '../lib/responseMiddleware';
 import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformRequest } from '../lib/requestMiddleware';
 
const ShippingAPI = createApi({
    reducerPath: 'ShippingAPI',
    baseQuery: defaultBaseQuery, // Replace with your API endpoint
    endpoints: (builder) => ({
        getShippingMethodsById: builder.query({
            query: (CountryId) => ({
                url: (`/Shipping/${CountryId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
    }),
});
 
export const { useLazyGetShippingMethodsByIdQuery } = ShippingAPI;
export default ShippingAPI;