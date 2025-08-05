import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';


const OrderAPI = createApi({
    reducerPath: 'OrderAPI',
    baseQuery: defaultBaseQuery, 
    endpoints: (builder) => ({
        getOrderHistory: builder.query({
            query:(data) =>({
                url: (`/Order/GetOrderHistory?paging.PageIndex=${data.pageIndex}&paging.PageSize=${data.pageSize}&OrderBy=${data.OrderBy}&SearchText=${data.SearchText}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

        addEditOrderAddress: builder.mutation({
            query:(data) =>({
                url: ('Order/AddEditOrderAddress'),
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getCheckoutTabDataByOrderId: builder.query({
            query:(orderId) =>({
                url: (`/Order/GetCheckoutTabDataByOrderId/${orderId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        checkPoNumber: builder.query({
            query: ({poNumber}) => ({
                url: (`/Order/CheckPoNumber?PoNumber=${poNumber}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        placeOrder: builder.mutation({
            query:(data) =>({
                url: '/Order/PlaceOrder',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getItemByOrderId: builder.query({
            query:(orderId) =>({
                url: `/Order/GetItemByOrderId?orderId=${orderId}`,
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        addEditOrderItem: builder.mutation({
            query:(data) =>({
                url: '/Order/AddEditOrderItem',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        getOrderDetailsbyOrderId: builder.query({
            query:(orderId) =>({
                url: (`/Order/GetOrderDetailsbyOrderId/${orderId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        GetPaymentOptionbyOrderId: builder.query({
            query:(orderId) =>({
                url: (`/Order/${orderId}`),
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),
        addEditOrderDetail: builder.mutation({
            query:(data) =>({
                url: '/Order/AddEditOrderDetail',
                method: 'POST',
                body: transformRequest(data),
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

    }),
});

export const {useLazyGetOrderHistoryQuery, useAddEditOrderAddressMutation,useLazyGetCheckoutTabDataByOrderIdQuery,useLazyCheckPoNumberQuery,
    usePlaceOrderMutation,useLazyGetItemByOrderIdQuery,useAddEditOrderItemMutation,useLazyGetOrderDetailsbyOrderIdQuery,useLazyGetPaymentOptionbyOrderIdQuery,useAddEditOrderDetailMutation} = OrderAPI;
export default OrderAPI;