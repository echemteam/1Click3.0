"use client"
import React from 'react'
import Tabs from '@components/ui/tabs/Tabs'
import RFQHistory from './rfqHistory/RFQHistory'
import MyOrderHistory from './myOrderHistory/MyOrderHistory'
import "./OrderHistoryPage.scss"

const OrderHistoryPage = () => {
    const tabs = [
        { label: 'RFQ History', content: <RFQHistory /> },
        { label: 'My Order History', content: <MyOrderHistory /> },
    ];
    return (
        <div className='order-history-page-section'>
            <div className='order-history-page-section__header'>
                <Tabs tabs={tabs} />
            </div>
        </div>
    )
}

export default OrderHistoryPage