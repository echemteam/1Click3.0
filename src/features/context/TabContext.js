"use client";

import { tabData } from "@features/shoppingCart/ShoppingCartPage";
import { useRouter } from "next/router";
import React, { createContext, useState } from "react";

export const TabContext = createContext();

export const TabProvider = ({ children }) => {

  // const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState(tabData); // Manage tabData in state

  const markTabAsCompleted = (index) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab, i) =>
        i === index ? { ...tab, completed: true } : tab
      )
    );
  };

  // const handleRedirectToCart = (index) => {
  //   router.push('/cart')
  //   setActiveTab(index);
  // }

  return (
    <TabContext.Provider
      value={{ activeTab, setActiveTab, markTabAsCompleted, tabs }}
    >
      {children}
    </TabContext.Provider>
  );
};