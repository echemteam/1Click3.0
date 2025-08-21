"use client"
import React, { useState } from 'react'
import "./MyAccountPage.scss";
import Iconify from '@components/ui/iconify/Iconify';
import MyProfile from './components/myProfile/MyProfile';
import MyWishlist from './components/myWishlist/MyWishlist';
import MyViewedProduct from './components/myViewedProduct/MyViewedProduct';
import Addresses from './components/addresses/Addresses';
import MyCardOptions from './components/myCardOptions/MyCardOptions';
import RecentOrders from './components/recentOrders/RecentOrders';
import ProtectedRoute from 'src/app/protectedRoute';

const tabs = [
  {
    label: <><Iconify icon="iconamoon:profile" />My Profile</>,
    content: <MyProfile />,
  },
  // {
  //   label: <><Iconify icon="mdi:cart-check" />Recent Orders</>,
  //   content: <RecentOrders />,
  // },
  {
    label: <><Iconify icon="mdi:heart-outline" />My Wishlist</>,
    content: <MyWishlist />,
  },
  {
    label: <><Iconify icon="fluent:box-search-20-regular" />My Viewed Product</>,
    content: <MyViewedProduct />,
  },
  {
    label: <><Iconify icon="iconamoon:profile-light" />Addresses</>,
    content: <Addresses />,
  },
  {
    label: <><Iconify icon="solar:card-broken" />My Card Options</>,
    content: <MyCardOptions />,
  },
]

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ProtectedRoute>
    <div className='my-account-page-section'>
      <div className='my-account-page-section__tabs'>
        <h3 className='my-account-page-section__tabs__title'>Dashboard</h3>
        <div className='my-account-page-section__tabs__items'>
          {tabs.map((tab, index) => (
            <button key={index} className={`my-account-page-section__tabs__items__item ${activeTab === index ? "active" : ""}`} onClick={() => setActiveTab(index)}>{tab.label}</button>
          ))}
        </div>
      </div>
      <div className='my-account-page-section__content'>
        {tabs[activeTab].content}
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default MyAccountPage