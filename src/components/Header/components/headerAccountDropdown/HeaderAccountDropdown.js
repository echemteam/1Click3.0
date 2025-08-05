import React, { useEffect, useState } from 'react'
import Avatar from '@components/ui/avatar/Avatar'
import Iconify from '@components/ui/iconify/Iconify'
import Progressbar from '@components/ui/progressbar/Progressbar'
import { useRouter } from 'next/navigation'
import "./HeaderAccountDropdown.scss"
import { getAuthProps, signOut } from 'src/lib/authenticationLibrary'

const HeaderAccountDropdown = () => {
    const router = useRouter();
    const authData = getAuthProps();
    
   

    return (
        <div className='header-account-dropdown'>
            <div className="header-account-dropdown-header">
                <div className='header-account-dropdown-header-avatar'>
                    <Avatar
                        alt={`${authData.firstName} ${authData.lastName}`}
                        size="medium"
                        shape="circle"
                    />
                </div>
                <div className='header-account-dropdown-header-name'>
                    <div className='header-account-dropdown-header-name-text'>{authData.firstName} {authData.lastName}</div>
                    <div className='header-account-dropdown-header-name-subtext'>{authData.emailAddress}</div>
                </div>
                <button className='header-account-dropdown-header-action' onClick={() => router.push('/my-account')}>
                <Iconify icon="ic:sharp-edit" width={20} height={20} />
                </button>
            </div>
            <div className="header-account-dropdown-content">
                <div className='header-account-dropdown-content-profile-bar'>
                    <div className='header-account-dropdown-content-profile-bar-label'>Edit Profile</div>
                    <Progressbar variant="linear" value={true} />
                </div>
                <button className='header-account-dropdown-content-dashboard' onClick={() => router.push('/my-account')}>
                    <Iconify icon="material-symbols:dashboard-rounded" />
                    <div className='header-account-dropdown-content-dashboard-label'>Dashboard</div>
                </button>
                <button className='header-account-dropdown-content-history' onClick={() => router.push('/order-history')}>
                    <Iconify icon="flowbite:clock-arrow-outline" />
                    <div className='header-account-dropdown-content-history-label'>History</div>
                </button>
            </div>
            <div className="header-account-dropdown-footer">
                <button className='header-account-dropdown-footer-signout' onClick={()=> signOut()}>
                    <Iconify icon="ic:outline-logout" />
                    <div className='header-account-dropdown-footer-signout-label'>Sign Out</div>
                </button>

            </div>
        </div>
    )
}

export default HeaderAccountDropdown