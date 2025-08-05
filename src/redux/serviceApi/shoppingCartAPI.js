import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';

const shoppingCartAPI = createApi({
    reducerPath: 'shopingCartAPI',
    baseQuery: defaultBaseQuery,
    endpoints: (builder) => ({
        addProductInShoppingCart: builder.mutation({
            query: (data) => ({
                url: '/ShoppingCart/AddProductInShoppingCart',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        getShoppingCartById: builder.query({
            query: () => ({
                url: ('/ShoppingCart'),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        UpdateShoppingCartById: builder.mutation({
            query: (data) => ({
                url: 'ShoppingCart/UpdateShoppingCartById',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        updateQuantity: builder.mutation({
            query: (data) => ({
                url: 'ShoppingCart/UpdateQuantity',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
    }),

})

export const { useAddProductInShoppingCartMutation, useLazyGetShoppingCartByIdQuery, useUpdateShoppingCartByIdMutation,
    useUpdateQuantityMutation } = shoppingCartAPI;
export default shoppingCartAPI;