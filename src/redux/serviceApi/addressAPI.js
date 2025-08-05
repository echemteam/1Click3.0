import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';


const addressAPI = createApi({
    reducerPath: 'addressAPI',
    baseQuery: defaultBaseQuery, 
    endpoints: (builder) => ({
        addEditAddress: builder.mutation({
            query: (data) => ({
                url: '/Address/AddEditAddress',
                method: 'POST',
                body: transformRequest(data)
            }),

            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        getAddressListByUserId: builder.query({
            query: ({userId}) => ({
                url: (`/Address/GetAddressListByUserId?UserId=${userId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        getAddressDetailsByAddressId: builder.query({
            query: (data) => ({
                url: (`/Address/GetAddressDetailsByAddressId?addressId=${data.addressId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        deleteAddress: builder.mutation({
            query: (data) => ({
                url: '/Address/DeleteAddress',
                method: 'POST',
                body: transformRequest(data)
            }),

            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        getUserAddressById: builder.query({
            query: (data) => ({
                url: `/Address/GetUserAddressById?AddressTypeId=${data.AddressTypeId}`,
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        uSPSAddressValidation: builder.mutation({
            query: (data) => ({
                url: '/Address/USPSAddressValidation',
                method: 'POST',
                body: transformRequest(data)
            }),

            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
    }),
});

export const { useAddEditAddressMutation ,useLazyGetAddressListByUserIdQuery,useDeleteAddressMutation,useLazyGetAddressDetailsByAddressIdQuery,useLazyGetUserAddressByIdQuery,useUSPSAddressValidationMutation} = addressAPI;
export default addressAPI;
