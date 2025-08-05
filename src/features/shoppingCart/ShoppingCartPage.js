"use client";
import React, { useState } from "react";
import "./ShoppingCartPage.scss";
import ShoppingCart from "./components/shoppingCart/ShoppingCart";
import Checkout from "./components/checkout/Checkout";
import Iconify from "@components/ui/iconify/Iconify";
import OrderOverview from "./components/orderOverview/OrderOverview";
import PaymentOption from "./components/paymentOption/PaymentOption";
import Paymentdetails from "./components/paymentDetails/PaymentDetails";
import OrderComplete from "./components/orderComplete/OrderComplete";
import ProtectedRoute from "src/app/protectedRoute";
import { TabContext, TabProvider } from "../context/TabContext";
import CheckoutMain from "./components/checkout/CheckoutMain";

// Dynamic tab data
export const tabData = [
  {
    label: "Shopping Cart",
    content: (
      <>
        <ShoppingCart />
      </>
    ),
    completed: true,
  },
  {
    label: "Checkout",
    content: (
      <>
        {/* <Checkout/> */}
        <CheckoutMain />
      </>
    ),
    completed: false,
  },
  {
    label: "Order Overview",
    content: (
      <>
        <OrderOverview />
      </>
    ),
    completed: false,
  },
  {
    label: "Payment Option",
    content: (
      <>
        <PaymentOption />
      </>
    ),
    completed: false,
  },
  {
    label: "Payment Details",
    content: (
      <>
        <Paymentdetails />
      </>
    ),
    completed: false,
  },
  {
    label: "Order Complete",
    content: (
      <>
        <OrderComplete />
      </>
    ),
    completed: false,
  },
];

const ShoppingCartPage = () => {
  return (
    <TabProvider>
      <TabContext.Consumer>
        {({ activeTab, setActiveTab, tabs }) => (
          <ProtectedRoute>
            <div className="shopping-tabs">
              <div className="tabs">
                <div className="tab-header">
                  {tabs.map((tab, index) => (
                    <div
                      key={index}
                      className={`tab ${activeTab === index ? "active" : ""}`}
                      // onClick={() => setActiveTab(index)}
                    >
                      {tab.label}
                      {tab.completed && (
                        <Iconify icon="lets-icons:check-round-fill" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="tabContent">{tabs[activeTab].content}</div>
            </div>
          </ProtectedRoute>
        )}
      </TabContext.Consumer>
    </TabProvider>
  );
};

export default ShoppingCartPage;
