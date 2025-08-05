import React from 'react'
import Image from 'next/image';
import { AppIcons } from '@utils/AppIcons/AppIcons';
import './NoProductFound.scss'

const NoProductFound = ({ subText = ""
}) => {
    return (
        <div className="no-product-found">
            <div className="no-product-found__icon">
                <Image src={AppIcons.NoProductFound} alt="no-product-found-image" width={120} height={40} />
            </div>
            <div className="no-product-found__text">
                No Products Found
            </div>
            <div className="no-product-found__subtext">
                {subText}
            </div>
        </div>
    )
}

export default NoProductFound