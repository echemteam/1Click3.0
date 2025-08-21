import { createApi } from '@reduxjs/toolkit/query/react';
import { defaultBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';
import { transformRequest } from '../lib/requestMiddleware';

const rfqAPI = createApi({
  reducerPath: "rfqAPI",
  baseQuery: defaultBaseQuery,
  endpoints: (builder) => ({
    addRfq: builder.mutation({
      query: (data) => ({
        url: "/RFQ",
        method: "POST",
        body: transformRequest(data),
      }),
      transformResponse: transformSucessResponse,
      transformErrorResponse: transformErrorResponse,
    }),
    getRFQHistory: builder.query({
      query: (data) => ({
        url: `/RFQ/GetRFQHistory?paging.PageIndex=${data.pageIndex}&paging.PageSize=${data.pageSize}&searchText=${data.searchText}`,
        method: "GET",
      }),

      transformResponse: transformSucessResponse,
      transformErrorResponse: transformErrorResponse,
    }),
    getRfqDetilsByRfqId: builder.query({
      query: (rfqId) => ({
        url: `/RFQ/GetRfqDetilsByRfqId?rfqId=${rfqId}`,
        method: "GET",
      }),

      transformResponse: transformSucessResponse,
      transformErrorResponse: transformErrorResponse,
    }),
  }),
});

export const { useAddRfqMutation, useLazyGetRFQHistoryQuery, useLazyGetRfqDetilsByRfqIdQuery } = rfqAPI;
export default rfqAPI;