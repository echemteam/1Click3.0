'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Iconify from '@components/ui/iconify/Iconify';
import Image from 'next/image';
import { AppIcons } from '@utils/AppIcons/AppIcons';
import "swiper/css";
import "swiper/css/autoplay";
import { useRouter } from 'next/navigation';
import { DropdownWrapper } from '@components/ui/dropdownWrapper/DropdownWrapper';
import CenterModal from '@components/ui/centerModal/CenterModal';

import './Header.scss';
import Badge from '@components/ui/badge/Badge';
import SidebarModal from '@components/ui/sidebarModal/SidebarModal';
import Cart from './components/headerCart/HeaderCart';
import HeaderAccountDropdown from './components/headerAccountDropdown/HeaderAccountDropdown';
import { HeaderInfoSlider } from './components/headerInfoSlider/HeaderInfoSlider';
import { useSelector } from 'react-redux';
import { useLazyGetTotalCountByUseIdQuery } from 'src/redux/serviceApi/commonAPI';


const Header = () => {

  const router = useRouter();
  const isAuthenticated = useSelector(state => state.auth.isLogedin);
  const [getTotalCountByUseId, {isFetching: isgetTotalCountByUseIdFetching, isSuccess: isgetTotalCountByUseIdSuccess, data: getTotalCountByUseIdData}] = useLazyGetTotalCountByUseIdQuery();
  const [isMounted, setIsMounted] = useState(false);
  const [totalCount, setTotalCount] = useState();

  useEffect(() => {
    if(isAuthenticated){
      getTotalCountByUseId();
    }
  }, [isAuthenticated])

  useEffect(() => {
    if(!isgetTotalCountByUseIdFetching && isgetTotalCountByUseIdSuccess && getTotalCountByUseIdData){
      setTotalCount(getTotalCountByUseIdData);
    }
  }, [isgetTotalCountByUseIdFetching, isgetTotalCountByUseIdSuccess, getTotalCountByUseIdData])

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Shopping cart modal handler to toggle shopping cart modal
  const [shoppingCartModal, setShoppingCartModal] = useState(false);

  // Shopping cart modal handler to toggle shopping cart modal
  const openShoppingCartModal = () => {
    setShoppingCartModal(true);
  };

  // Shopping cart modal handler to toggle shopping cart modal
  const closeShoppingCartModal = () => {
    setShoppingCartModal(false);
  };

  // Scroll handler to toggle sticky header
  const [isSticky, setIsSticky] = useState(false);

  // Search handler to toggle search
  const [searchSelected, setSearchSelected] = useState('Basic');

  // Search options
  const searchOptions = [
    { label: 'Basic', handler: () => openSearchModal('list') },
    { label: 'Structure', handler: () => openSearchModal('structure') }
  ];

  // Search modal handler to toggle search modal
  const [activeSearchModal, setActiveSearchModal] = useState(null); // 'list' | 'structure' | null

  // Search modal handler to toggle search modal
  const openSearchModal = (type) => {
    setSearchSelected(type === 'list' ? 'Basic' : 'Structure');
    setActiveSearchModal(type);
  };

  // Search modal handler to toggle search modal
  const closeSearchModal = () => {
    setActiveSearchModal(null);
  };

  // Scroll handler to toggle sticky header
  const handleScroll = () => {
    if (window.scrollY > 111) { 
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Data for data objects in header
  const welcomeText = "Welcome to 1ClickChemistry !!";
  const utilityLinks = isAuthenticated
    ? [
      { label: 'My Account', href: '/my-account' },
      { label: 'Cart', href: '/cart' },
      // { label: 'Log in', href: '/login' }
    ]
    : [
      { label: 'Log in', href: '/login' }
    ];
  const showDividers = true;

  const navLinks = [
    { label: 'Home', href: '/' },
    {
      label: 'About Us', href: '', children: [
        { label: 'About Us', href: '/about-us' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact Us', href: '/contact-us' },
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
      ]
    },
    {
      label: 'Services', href: '/',
      children: [
        { label: 'Custom Synthesis', href: '/' },
        { label: 'R&D Services', href: '/' },
        { label: 'Package Inventories', href: '/' },
        { label: 'Chemicals Sourcing', href: '/' },
        { label: 'Cheminformatics', href: '/' },
      ]
    },
    {
      label: 'Products', href: '/',
      children: [
        { label: 'On Sale', href: '/' },
        { label: 'Building Blocks', href: '/' },
        { label: 'Click Chemistry Reagents', href: '/' },
        { label: 'PEG products', href: '/' },
        { label: 'Amino acids', href: '/' },
      ]
    },
    {
      label: 'Orders', href: '/', children: [
        { label: 'Chemical search', href: '/' },
        { label: 'RFQ / Inquiry', href: '/' },
        { label: 'Purchase process', href: '/' },
        { label: 'Order Delivery', href: '/' },
        { label: 'Analogs and related products', href: '/' },
      ]
    }
  ];

  // Dropdown handler to toggle dropdown
  const [expanded, setExpanded] = useState(null);
  const toggleExpand = (index) => {
    setExpanded(prev => (prev === index ? null : index));
  };

  // Menu handler to toggle menu
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={`header-top-bar ${isSticky ? 'sticky' : ''}`}>
        <div className='utility-bar-container'>
          <div className='utility-bar'>
            <div className="utility-bar__left">
              <Link href="/">{welcomeText}</Link>
            </div>
            <div className="utility-bar__right">
              {isMounted &&
                utilityLinks.map((link, index) => (
                  <React.Fragment key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                    {showDividers && index < utilityLinks.length - 1 && (
                      <Iconify icon="pepicons-pop:line-y" width={15} height={15} />
                    )}
                  </React.Fragment>
                ))
              }
            </div>
          </div>
        </div>
        <header className='header-container'>
          <div className='header-container-left'>
            <div className='header-logo'>
              <button className='burger-menu' onClick={() => setMenuOpen(true)}>
                <Iconify icon="mdi:menu" width={30} height={30} />
              </button>
              <Image src={AppIcons.LogoDark} alt="header-logo" width={0} height={0} />
            </div>
            <nav className='header-nav'>
              <ul>
                {navLinks.map((link, index) => (
                  <li key={index} className={link.children ? 'navmenu-dropdown' : ''}>
                    <Link href={link.href}>{link.label}</Link>
                    {link.children && (
                      <>
                        <Iconify icon="iconamoon:arrow-down-2-light" width={16} height={16} className="dropdown-icon" />
                        <ul className="dropdown-menu">
                          {link.children.map((child, idx) => (
                            <li key={idx}>
                              <Link href={child.href}>{child.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className='header-container-right'>
            <div className='header-search-container'>
              <div className='header-input-container'>
                <input type="text" placeholder='Search over 10,000 products' />
                <DropdownWrapper
                  gap={10}
                  direction="left"
                  toggleElement={
                    <div className="header-search-dropdown">
                      <div className="header-search-dropdown-label">{searchSelected}</div>
                      <Iconify icon="iconamoon:arrow-down-2-light" width={20} height={20} />
                    </div>
                  }
                >
                  <div className="header-search-dropdown-content">
                    {searchOptions.map(({ label, handler }) => (
                      <button
                        key={label}
                        className="header-search-dropdown-btn"
                        onClick={handler}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </DropdownWrapper>
              </div>
              <button className='header-search-button'>
                <Iconify icon="mdi:search" width={20} height={20} />
              </button>
            </div>
            {isMounted && isAuthenticated ?
              <div className='header-action-container'>
                <button className='header-action-button' onClick={() => router.push('/wishlist')}>
                  <Badge badgeContent={totalCount?.wishListCounts || 0}>
                    <Iconify icon="proicons:heart" width={22} height={22} />
                  </Badge>
                </button>
                <button className='header-action-button' onClick={openShoppingCartModal}>
                  <Badge badgeContent={totalCount?.shoppingCartProductsCounts || 0}>
                    <Iconify icon="famicons:cart-outline" width={22} height={22} />
                  </Badge>
                </button>

                <DropdownWrapper
                  gap={10}
                  direction="left"
                  toggleElement={
                    <div className='header-action-button'>
                      <Iconify icon="carbon:user-avatar" width={22} height={22} />
                    </div>
                  }
                >
                  <HeaderAccountDropdown />
                </DropdownWrapper>
              </div>
              : null}
          </div>
        </header>
        <HeaderInfoSlider />
      </div>
      <div className={`sliding-navbar ${menuOpen ? 'active' : ''}`}>
        <div className='sliding-navbar__header'>
          <div className='sliding-navbar__header-logo'>
            <Image src={AppIcons.LogoLight} alt="sliding-navbar-logo" width={0} height={0} />
          </div>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            <Iconify icon="iconamoon:close" width={35} height={35} />
          </button>
        </div>
        <div className='sliding-navbar__search'>
          <div className='sliding-navbar__search-input-container'>
            <input type="text" placeholder='Search over 10,000 products' />
            <button className='sliding-navbar__search-dropdown'>
              <div className='sliding-navbar__search-dropdown-label'>Basic</div>
              <Iconify icon="iconamoon:arrow-down-2-light" width={20} height={20} />
            </button>
          </div>
          <button className='sliding-navbar__search-button'>
            <Iconify icon="mdi:search" width={20} height={20} />
          </button>
        </div>
        <ul className="sliding-menu-list">
          {navLinks.map((link, index) => (
            <li key={index}>
              <button className={`sliding-menu-item ${expanded === index ? 'active' : ''}`} onClick={() => link.children && toggleExpand(index)}>
                <span>{link.label}</span>
                {link.children && (
                  <span className={`arrow ${expanded === index ? 'open' : ''}`}><Iconify icon="iconamoon:arrow-down-2-light" width={20} height={20} /></span>
                )}
              </button>
              {link.children && (
                <ul className={`sliding-submenu ${expanded === index ? 'show' : ''}`}>
                  {link.children.map((child, i) => (
                    <li key={i}>
                      <Iconify icon="octicon:dot-16" width={20} height={20} />
                      <a href={child.href}>{child.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <button className="login-btn">
          <Link href="/login" onClick={() => setMenuOpen(false)}>LOG IN</Link>
        </button>
      </div>
      <CenterModal
        isOpen={activeSearchModal === 'list'}
        onClose={closeSearchModal}
        modalTitle="List Search"
      >
        <p>This is a simple centered modal for list search.</p>
      </CenterModal>

      <CenterModal
        isOpen={activeSearchModal === 'structure'}
        onClose={closeSearchModal}
        modalTitle="Structure Search"
      >
        <p>This is a simple centered modal for structure search.</p>
      </CenterModal>

      <SidebarModal
        isOpen={shoppingCartModal}
        onClose={closeShoppingCartModal}
        modalTitle="Shopping Cart"
        modalSize="w-40"
      >
        <Cart  closemodal = {closeShoppingCartModal}/>
      </SidebarModal>
    </>
  );
};

export default Header;
