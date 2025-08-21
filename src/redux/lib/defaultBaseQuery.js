// src/services/api/defaultBaseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { getAuthProps } from 'src/lib/authenticationLibrary'


const mutex = new Mutex()

export const IsTestMode = true

export const getAPIUrl = () => {
  if (IsTestMode) return process.env.NEXT_PUBLIC_TEST_URL;
  return process.env.NEXT_PUBLIC_LOCAL_SITE_URL;
};

export const API_URL = getAPIUrl();

// underlying fetchBaseQuery
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',            // if you rely on cookies
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

// our wrapper to inject auth token + 401 redirect
export const customFetchBase = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  // pull token from wherever you’ve stored it (localStorage, cookie, etc.)
  const authData = getAuthProps?.()
  const token = authData?.token?.token

  if (token) {
    args.headers = {
      ...(args.headers || {}),
      Authorization: `Bearer ${token}`,
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && typeof window !== 'undefined') {
    // client-side only!
    window.location.assign('/login')
  }
  return result
}

export const defaultBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {

    headers.set("Content-Type", "application/json");
    let authData = getAuthProps();
    if (authData) {
      const token = authData.token.token;
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

}); // Replace '/api' with your API base URL


export const fileUploadQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {

    const boundary = `---------------------------${Math.floor(Math.random() * 1000000000000000)}`;

    headers.set("Content-Type", `multipart/form-data; boundary=${boundary}`);
    let authData = getAuthProps();
    let token = null;
    if (authData) {
      token = authData.token.token;
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }
})

export const getChemIndexAPIUrl = () => {
  // if (IsProdMode) return process.env.NEXT_PUBLIC_PROD_SITE_URL;
  if (IsTestMode) return process.env.NEXT_PUBLIC_TEST_URL;
  return process.env.NEXT_PUBLIC_LOCAL_SITE_URL;
};

export const CHEMINDEX_API_URL = getChemIndexAPIUrl();


export const chemIndexBaseQuery = fetchBaseQuery({
  baseUrl: CHEMINDEX_API_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    const authData = getAuthProps();
    if (authData) {
      const token = authData.token.token;
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
