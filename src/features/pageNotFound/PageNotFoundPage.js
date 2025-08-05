import React from 'react'
import Image from 'next/image'
import { AppIcons } from '@utils/AppIcons/AppIcons'
import Link from 'next/link'
import Iconify from '@components/ui/iconify/Iconify'
import "./PageNotFoundPage.scss"

const PageNotFoundPage = () => {
    return (
        <div className="page-not-found-container">
            <div className='page-not-found-bg'>
                <Image src={AppIcons.PageNotFoundBG} alt="page-not-found-bg" />
            </div>
            <div className="page-not-found">
                <div className="head-text">
                    <h1>Page Not Found</h1>
                </div>
                <div className="error-num">
                    <span className="error-code"> 404 </span>
                </div>
                <div className="img-box">
                    <Image src={AppIcons.PageNotFoundVector} alt="page-not-found-vector" />
                </div>
            </div>
            <div className="btn-box">
                <Link href="/">
                    <div className='back-btn'>
                        <Iconify icon="famicons:arrow-back" width={24} height={24} />
                    </div>
                    <div className='back-text'>
                        Go Back to Home
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default PageNotFoundPage