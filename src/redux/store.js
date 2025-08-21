// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import authapi from './serviceApi/authAPI';
import { setupListeners } from '@reduxjs/toolkit/query';
import productAPI from './serviceApi/productAPI';
import contactUsAPI from './serviceApi/contactUsAPI';
import userAPI from './serviceApi/userAPI';
import shoppingCartAPI from './serviceApi/shoppingCartAPI';
import rfqAPI from './serviceApi/rfqAPI';
import productSearchReducer from './slice/productSearchSlice';
import recentViewManagementAPI from './serviceApi/recentViewManagementAPI';
import wishLisAPI from './serviceApi/wishListAPI';
import addressAPI from './serviceApi/addressAPI';
import commonAPI from './serviceApi/commonAPI';
import recentViewAPI from './serviceApi/recentViewAPI';
import ShippingAPI from './serviceApi/ShippingAPI';
import OrderAPI from './serviceApi/OrderAPI';
import paymentAPI from './serviceApi/paymentAPI';
import imageAPI from './serviceApi/ImageAPI';
import structureSearchAPI from './serviceApi/structureSearchAPI';
import slugAPI from './serviceApi/slugAPI';

export const store = configureStore({
  reducer: {
    // add more slices here
    auth: authReducer,
    productSearch: productSearchReducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [contactUsAPI.reducerPath]: contactUsAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [authapi.reducerPath]: authapi.reducer,
    [shoppingCartAPI.reducerPath]: shoppingCartAPI.reducer,
    [rfqAPI.reducerPath]: rfqAPI.reducer,
    [recentViewManagementAPI.reducerPath]: recentViewManagementAPI.reducer,
    [wishLisAPI.reducerPath]: wishLisAPI.reducer,

    [addressAPI.reducerPath]: addressAPI.reducer,
    [commonAPI.reducerPath]: commonAPI.reducer,
    [recentViewAPI.reducerPath]: recentViewAPI.reducer,
    [ShippingAPI.reducerPath]: ShippingAPI.reducer,
    [OrderAPI.reducerPath]: OrderAPI.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
    [imageAPI.reducerPath]: imageAPI.reducer,
    [structureSearchAPI.reducerPath]: structureSearchAPI.reducer,
    [slugAPI.reducerPath]: slugAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        'imageAPI/executeQuery/fulfilled',
        'imageAPI/executeMutation/fulfilled',
      ],
      ignoredPaths: ['imageAPI.queries'],
    },
  }).concat(
    authapi.middleware,
    productAPI.middleware,
    contactUsAPI.middleware,
    userAPI.middleware,
    shoppingCartAPI.middleware,
    rfqAPI.middleware,
    recentViewManagementAPI.middleware,
    wishLisAPI.middleware,


    addressAPI.middleware,
    commonAPI.middleware,
    recentViewAPI.middleware,
    ShippingAPI.middleware,
    OrderAPI.middleware,

    imageAPI.middleware,
    paymentAPI.middleware,
    structureSearchAPI.middleware,
    slugAPI.middleware,
  ),
});
setupListeners(store.dispatch);