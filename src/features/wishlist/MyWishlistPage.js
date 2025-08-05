'use client'
import React from 'react'
import MyWishlist from '@features/myAccount/components/myWishlist/MyWishlist';
import "./MyWishlistPage.scss";


const MyWishlistPage = () => {
  return (
    <div className='mywishlist-page-section'>
      <h3>My Wishlist</h3>
      <MyWishlist />
    </div>
  )
}

export default MyWishlistPage