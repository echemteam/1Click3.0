import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';

const productAPI = createApi({
    reducerPath: 'productAPI',
    baseQuery: defaultBaseQuery, // Replace with your API endpoint
    endpoints: (builder) => ({
        getAllApplicationList: builder.query({
            query: () => ({
                url: '/api/application/getAllApplicationList/',
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        getUsers: builder.query({
            query: (data) => ({
                url: (`/User?paging.PageIndex=${data.pageNumber}&paging.PageSize=${data.pageSize}&OrderBy=${data.orderby}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: (`/User/${userId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getAllProductTextSearch: builder.mutation({
            query: (data) => ({
                url: '/Product/GetAllProductTextSearch',
                method: 'POST',
                body: transformRequest(data)
            }),

            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getProductByProductId : builder.query({
            query: ({ Id }) => ({
                url: (`/Product/${Id}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getPricesByCatalogId: builder.query({
            query: ({ CatalogId }) => ({
              url: `/ProductPrice/${CatalogId}`,
              method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
          }),
          getStockAvailability : builder.query({
            query: (data) => ({
                url: (`/Product/GetStockAvailability?catalogId=${data.catalogId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
          getProductProperties: builder.query({
            query: ({catalogId}) => ({
              url: `/Product/GetProductProperties?catalogId=${catalogId}`,
              method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
          }),
          getSimilarProductsByCatalogId: builder.query({
            query: ({catalogId}) => ({
              url: `/Product/GetSimilarProductsByCatalogId?catalogId=${catalogId}`,
              method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
          }),
          
    }),
});

export const { useLazyGetAllApplicationListQuery, useLazyGetUsersQuery, useLazyGetUserDetailsQuery, useGetAllProductTextSearchMutation, 
    useLazyGetProductByProductIdQuery, useLazyGetPricesByCatalogIdQuery, useLazyGetStockAvailabilityQuery,useLazyGetProductPropertiesQuery,useLazyGetSimilarProductsByCatalogIdQuery} = productAPI;
export default productAPI;
