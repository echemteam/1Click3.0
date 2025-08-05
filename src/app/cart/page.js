
import React from 'react';
import ShoppingCartPage from '@features/shoppingCart/ShoppingCartPage';
import { OrderContextProvider } from '@features/contextAPIs/OrderContext';


export default function Page() {
  return (
    <OrderContextProvider>
      <ShoppingCartPage />
    </OrderContextProvider>
  );
}