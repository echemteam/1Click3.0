import { transformErrorResponse, transformSucessResponse } from "../lib/responseMiddleware";
import { defaultBaseQuery } from "../lib/defaultBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

const commonAPI = createApi({
    reducerPath: 'commonAPI',
    baseQuery: defaultBaseQuery, 
    endpoints: (builder) => ({
        getAllCountries: builder.query({
            query: () => ({
                url: 'Common/GetAllCountries',
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        getAllStates: builder.query({
            query: (data) => ({
                url: `/Common/GetAllStates?CountryId=${data.CountryId}`,
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        getAllCities: builder.query({
            query: (data) => ({
                url: `/Common/GetAllCities?StateId=${data.StateId}`,
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
        getTotalCountByUseId: builder.query({
            query: () => ({
                url: `/Common/GetTotalCountByUseId`,
                method: 'GET',
            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
        }),
    }),
});

export const { useLazyGetAllCountriesQuery,useLazyGetAllStatesQuery,useLazyGetAllCitiesQuery, useLazyGetTotalCountByUseIdQuery} = commonAPI;
export default commonAPI;