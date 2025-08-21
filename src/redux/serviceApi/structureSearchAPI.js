import { createApi } from '@reduxjs/toolkit/query/react';
import { transformSucessResponse, transformErrorResponse } from '../lib/responseMiddleware';
 import { defaultBaseQuery } from '../lib/defaultBaseQuery';


const structureSearchAPI = createApi({

    reducerPath: 'structureSearchAPI',
    baseQuery: defaultBaseQuery, 
     tagTypes: ['StructureSearch'],
    endpoints: (builder) => ({

        getAllProductStructureSearch: builder.query({
            query: (data) => ({
                url: (`/StructureSearch/GetAllProductStructureSearch?UserId=${data.userId}&IsSimilar=${data.isSimilar}&IsSubStructure=${data.isSubStructure}&IsExactMatch=${data.isExactMatch}&similarity=${data.similarity}&SearchText=${data.searchText}`),
                method: 'GET',

            }),
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse
        }),

    }),
});

export const {  useLazyGetAllProductStructureSearchQuery} = structureSearchAPI;
export default structureSearchAPI;