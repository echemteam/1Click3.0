import { createApi } from '@reduxjs/toolkit/query/react';
import { chemIndexBaseQuery } from '../lib/defaultBaseQuery';
import { transformErrorResponse, transformSucessResponse } from '../lib/responseMiddleware';

const imageAPI = createApi({
    reducerPath: 'imageAPI',
    baseQuery: chemIndexBaseQuery, 
    endpoints: (builder) => ({
        getRenderImagebychemProductIdAndInchikey: builder.query({
            query: ({ chemProductID, inChIKey }) => {
              const queryParams = new URLSearchParams();
          
              if (typeof chemProductID === "number") {
                queryParams.append("chemProductID", chemProductID);
              }
          
              if (inChIKey) {
                queryParams.append("inChIKey", inChIKey);
              }
          
              return {
                url: `/Regulation/GetRenderImagebychemProductIdAndInchikey?${queryParams.toString()}`,
                method: 'GET',
                responseHandler: (response) => response.blob()
              };
            },
            transformResponse: transformSucessResponse,
            transformErrorResponse: transformErrorResponse,
          }),
              
    }),
});

export const {useLazyGetRenderImagebychemProductIdAndInchikeyQuery} = imageAPI;
export default imageAPI;