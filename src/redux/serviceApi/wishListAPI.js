import { createApi } from '@reduxjs/toolkit/query/react';
import { transformSucessResponse, transformErrorResponse } from '../lib/responseMiddleware';
 import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformRequest } from '../lib/requestMiddleware';

const wishLisAPI = createApi({

    reducerPath: 'wishlistAPI',
    baseQuery: defaultBaseQuery, // Replace with your API endpoint
    tagTypes: ['Wishlist'],
    endpoints: (builder) => ({

        addEditWishList: builder.mutation({
            query: (data) => ({
                url: '/Wishlist/AddEditWishList',
                method: 'POST',
                body: transformRequest(data)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getWishlist: builder.query({
            query: (data) => ({
                url: (`/Wishlist/GetWishlist?paging.PageIndex=${data.pageIndex}&paging.PageSize=${data.pageSize}&OrderBy=${data.orderby}`),
                method: 'GET',

            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

    }),
});

export const { useAddEditWishListMutation, useLazyGetWishlistQuery} = wishLisAPI;
export default wishLisAPI;