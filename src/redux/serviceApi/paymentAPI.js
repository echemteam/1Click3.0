import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';

const paymentAPI = createApi({
    reducerPath: 'paymentAPI',
    baseQuery: defaultBaseQuery, 
    endpoints: (builder) => ({
        saveCard: builder.mutation({
            query: (data) => ({
                url: '/Payments/SaveCard',
                method: 'POST',
                body: transformRequest(data)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        GetPaymentMethods : builder.query({
            query: ({ customerId }) => ({
                url: (`/Payments/GetPaymentMethods?customerId=${String(customerId)}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        deleteCard: builder.mutation({
            query: (stripeCardId) => ({
                url: `/Payments/DeletePaymentMethod?stripeCardId=${stripeCardId}`,
                method: 'DELETE',
                body: transformRequest(stripeCardId)
            }),

            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        createPaymentIntent: builder.mutation({
            query: (data) => ({
                url: '/Payments/CreatePaymentIntent',
                method: 'POST',
                body: transformRequest(data)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getStripeCardDetails : builder.query({
            query: () => ({
                url: `/Payments/GetStripeCardDetails`,
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        addEditPaymentOption: builder.mutation({
            query: (data) => ({
                url: '/Payments/AddEditPaymentOption',
                method: 'POST',
                body: transformRequest(data)
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
    }),
});

export const { useSaveCardMutation ,useLazyGetPaymentMethodsQuery,useDeleteCardMutation,useCreatePaymentIntentMutation,useLazyGetStripeCardDetailsQuery,useAddEditPaymentOptionMutation} = paymentAPI;
export default paymentAPI;
