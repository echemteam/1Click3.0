"use client";
import { createContext, useState } from "react";
import PropTypes from "prop-types";

const OrderContext = createContext();

export default OrderContext;

export const OrderContextProvider = ({ children }) => {

    const [orderId, setOrderId] = useState(null);
    const [shoppingCartListData, setShoppingCartListData] = useState([]);
    const [orderGrandTotal, setOrderGrandTotal] = useState(null);


    return (
        <OrderContext.Provider value={{
            setOrderId, orderId, setShoppingCartListData, shoppingCartListData, orderGrandTotal, setOrderGrandTotal
        }}>
            {children}
        </OrderContext.Provider>
    );
};

OrderContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};