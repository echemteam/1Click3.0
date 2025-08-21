'use client';
import React, { useState, useEffect, useRef } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetTotalCountByUseIdQuery } from 'src/redux/serviceApi/commonAPI';
import { getAuthProps, isAuthorized } from 'src/lib/authenticationLibrary';
import { useLazyGetAllProductStructureSearchQuery } from 'src/redux/serviceApi/structureSearchAPI';
import { setSearchText } from 'src/redux/slice/productSearchSlice';
import SwalAlert from 'src/services/swal/SwalService';


const Header = () => {
  const dispatch = useDispatch();
  const { toast } = SwalAlert();
  const router = useRouter();
  const isAuthenticated = useSelector(state => state.auth.isLogedin);
  const [getTotalCountByUseId, { isFetching: isgetTotalCountByUseIdFetching, isSuccess: isgetTotalCountByUseIdSuccess, data: getTotalCountByUseIdData }] = useLazyGetTotalCountByUseIdQuery();
  const [isMounted, setIsMounted] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [searchText, setLocalSearchText] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      getTotalCountByUseId();
    }
  }, [isAuthenticated])

  const handleSearch = () => {
    if (!searchText.trim()) {
      toast("error", "Please enter a search term.");
      return;
    }

    dispatch(setSearchText(searchText));
    router.push("/products");
  };

  useEffect(() => {
    if (!isgetTotalCountByUseIdFetching && isgetTotalCountByUseIdSuccess && getTotalCountByUseIdData) {
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
        { label: 'R&D Services', href: '/r&d-service' },
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
  const iframeRef = useRef();
  // const [searchType, setSearchType] = useState('Sub-Search');
  // const [similarity, setSimilarity] = useState('0.95');

  const [structureSearch, setStructureSearch] = useState(
    {
      similaritySearch: false,
      subStructure: true,
      exactMatch: false,
      similarity: '0.95',
      searchValue: '',
    }
  )


  const onValueChange = (type, value) => {

    const newObj = { ...structureSearch };
    if (type === 'subStructure') {
      newObj[type] = true;
      newObj['exactMatch'] = false;
      newObj['similaritySearch'] = false;
    } else if (type === 'exactMatch') {
      newObj[type] = true;
      newObj['subStructure'] = false;
      newObj['similaritySearch'] = false;
    } else if (type === 'similaritySearch') {
      newObj[type] = true;
      newObj['exactMatch'] = false;
      newObj['subStructure'] = false;
    }
    else {
      newObj[type] = value;
    }
    setStructureSearch(newObj);
  }


  return (
    <>
      <div className={`header-top-bar ${isSticky ? "sticky" : ""}`}>
        <div className="utility-bar-container">
          <div className="utility-bar">
            <div className="utility-bar__left">
              <Link href="/">{welcomeText}</Link>
            </div>
            <div className="utility-bar__right">
              {isMounted &&
                utilityLinks.map((link, index) => (
                  <React.Fragment key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                    {showDividers && index < utilityLinks.length - 1 && (
                      <Iconify
                        icon="pepicons-pop:line-y"
                        width={15}
                        height={15}
                      />
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
        <header className="header-container">
          <div className="header-container-left">
            <div className="header-logo">
              <button className="burger-menu" onClick={() => setMenuOpen(true)}>
                <Iconify icon="mdi:menu" width={30} height={30} />
              </button>
              <Image
                src={AppIcons.LogoDark}
                alt="header-logo"
                width={0}
                height={0}
              />
            </div>
            <nav className="header-nav">
              <ul>
                {navLinks.map((link, index) => (
                  <li
                    key={index}
                    className={link.children ? "navmenu-dropdown" : ""}
                  >
                    <Link href={link.href}>{link.label}</Link>
                    {link.children && (
                      <>
                        <Iconify
                          icon="iconamoon:arrow-down-2-light"
                          width={16}
                          height={16}
                          className="dropdown-icon"
                        />
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
          <div className="header-container-right">
            <div className="header-search-container">
              <div className="header-input-container">
                <input
                  type="text"
                  placeholder="Search over 10,000 products"
                  value={searchText}
                  onChange={(e) => setLocalSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <DropdownWrapper
                  gap={10}
                  direction="left"
                  toggleElement={
                    <div className="header-search-dropdown">
                      <div className="header-search-dropdown-label">
                        {searchSelected}
                      </div>
                      <Iconify
                        icon="iconamoon:arrow-down-2-light"
                        width={20}
                        height={20}
                      />
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
              <button className="header-search-button" onClick={handleSearch}>
                <Iconify icon="mdi:search" width={20} height={20} />
              </button>
            </div>
            {isMounted && isAuthenticated ? (
              <div className="header-action-container">
                <button
                  className="header-action-button"
                  onClick={() => router.push("/wishlist")}
                >
                  <Badge badgeContent={totalCount?.wishListCounts || 0}>
                    <Iconify icon="proicons:heart" width={22} height={22} />
                  </Badge>
                </button>
                <button
                  className="header-action-button"
                  onClick={openShoppingCartModal}
                >
                  <Badge
                    badgeContent={totalCount?.shoppingCartProductsCounts || 0}
                  >
                    <Iconify
                      icon="famicons:cart-outline"
                      width={22}
                      height={22}
                    />
                  </Badge>
                </button>

                <DropdownWrapper
                  gap={10}
                  direction="left"
                  toggleElement={
                    <div className="header-action-button">
                      <Iconify
                        icon="carbon:user-avatar"
                        width={22}
                        height={22}
                      />
                    </div>
                  }
                >
                  <HeaderAccountDropdown />
                </DropdownWrapper>
              </div>
            ) : null}
          </div>
        </header>
        <HeaderInfoSlider />
      </div>
      <div className={`sliding-navbar ${menuOpen ? "active" : ""}`}>
        <div className="sliding-navbar__header">
          <div className="sliding-navbar__header-logo">
            <Image
              src={AppIcons.LogoLight}
              alt="sliding-navbar-logo"
              width={0}
              height={0}
            />
          </div>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            <Iconify icon="iconamoon:close" width={35} height={35} />
          </button>
        </div>
        <div className="sliding-navbar__search">
          <div className="sliding-navbar__search-input-container">
            <input type="text" placeholder="Search over 10,000 products" />
            <button className="sliding-navbar__search-dropdown">
              <div className="sliding-navbar__search-dropdown-label">Basic</div>
              <Iconify
                icon="iconamoon:arrow-down-2-light"
                width={20}
                height={20}
              />
            </button>
          </div>
          <button className="sliding-navbar__search-button">
            <Iconify icon="mdi:search" width={20} height={20} />
          </button>
        </div>
        <ul className="sliding-menu-list">
          {navLinks.map((link, index) => (
            <li key={index}>
              <button
                className={`sliding-menu-item ${expanded === index ? "active" : ""
                  }`}
                onClick={() => link.children && toggleExpand(index)}
              >
                <span>{link.label}</span>
                {link.children && (
                  <span className={`arrow ${expanded === index ? "open" : ""}`}>
                    <Iconify
                      icon="iconamoon:arrow-down-2-light"
                      width={20}
                      height={20}
                    />
                  </span>
                )}
              </button>
              {link.children && (
                <ul
                  className={`sliding-submenu ${expanded === index ? "show" : ""
                    }`}
                >
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
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            LOG IN
          </Link>
        </button>
      </div>
      <CenterModal
        isOpen={activeSearchModal === "list"}
        onClose={closeSearchModal}
        modalTitle="List Search"
      >
        <p>This is a simple centered modal for list search.</p>
      </CenterModal>

      <CenterModal
        isOpen={activeSearchModal === "structure"}
        onClose={closeSearchModal}
        modalTitle="Structure Search"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <iframe
            // ref={iframeRef}
            id="ketcher-iframe"
            src={`${process.env.NEXT_PUBLIC_KETCHER_URL}/index.html`}
            width="100%"
            height="400px"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              marginBottom: "20px",
            }}
            allowFullScreen
            title="Ketcher"
          // onChange={(e) => onValueChange('SerchText', e)}
          ></iframe>
          <div style={{ marginTop: "20px", width: "100%" }}>
            <div>
              <input
                type="radio"
                id="subStructure"
                name="searchType"
                //   value="Sub-Search"
                // checked={searchType === 'Sub-Search'}
                // onChange={(e) => setSearchType(e.target.value)}
                checked={structureSearch.subStructure}
                onChange={(e) =>
                  onValueChange("subStructure", structureSearch.subStructure)
                }
              />
              <label htmlFor="subStructure" style={{ marginLeft: "8px" }}>
                Sub Structure Search
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="exactMatch"
                name="searchType"
                // value="Exact-Search"
                // checked={searchType === 'Exact-Search'}
                // onChange={(e) => setSearchType(e.target.value)}
                checked={structureSearch.exactMatch}
                onChange={(e) =>
                  onValueChange("exactMatch", structureSearch.exactMatch)
                }
              />
              <label htmlFor="exactMatch" style={{ marginLeft: "8px" }}>
                Exact Match
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="similaritySearch"
                name="searchType"
                //  value="Similarity-Search"
                // checked={searchType === 'Similarity-Search'}
                // onChange={(e) => setSearchType(e.target.value)}
                checked={structureSearch.similaritySearch}
                onChange={(e) =>
                  onValueChange(
                    "similaritySearch",
                    structureSearch.similaritySearch
                  )
                }
              />
              <label htmlFor="similaritySearch" style={{ marginLeft: "8px" }}>
                Similarity Search
              </label>
            </div>
            {structureSearch.similaritySearch === true && (
              <div style={{ marginTop: "10px" }}>
                <label htmlFor="similarity">Similarity Threshold:</label>
                <select
                  id="similarity"
                  value={similarity}
                  onChange={(e) => onValueChange("similarity", e.value)}
                  style={{ marginLeft: "10px", padding: "5px", width: "100%" }}
                >
                  <option value="0.95">0.95</option>
                  <option value="0.90">0.90</option>
                  <option value="0.85">0.85</option>
                  <option value="0.80">0.80</option>
                  <option value="0.75">0.75</option>
                  <option value="0.65">0.65</option>
                  <option value="0.50">0.50</option>
                </select>
              </div>
            )}
          </div>
          <button
            className="button button--contained button--primary"
            style={{ width: "100%", marginTop: "20px" }}
            onClick={() => {
              const iframe = document.getElementById("ketcher-iframe");
              const ketcherUrl = process.env.NEXT_PUBLIC_KETCHER_URL;
              console.log("Ketcher loaded from", ketcherUrl);
              if (iframe) {
                const handleMessage = (event) => {
                  console.log("Event", event.origin);
                  if (event.data.smiles) {
                    console.log("Ketcher function called successfully.");
                    console.log("Generated SMILES:", event.data.smiles);

                    let request = {
                      userId: isAuthorized() ? getAuthProps()?.userId : 0,
                      isSimilar: structureSearch.similaritySearch,
                      isSubStructure: structureSearch.subStructure,
                      isExactMatch: structureSearch.exactMatch,
                      similarity: structureSearch.similarity,
                      searchText: event.data.smiles,
                    };

                    router.push({
                      pathname: "/products",
                      query: {
                        structureRequest: JSON.stringify(request),
                        isStructure: "true",
                      },
                    });
                  } else {
                    console.warn("No SMILES data received.");
                  }
                };
                setTimeout(() => {
                  window.removeEventListener("message", handleMessage);
                }, 5000);
              } else {
                console.error("Ketcher iframe not found");
              }
            }}
          >
            Get SMILES
          </button>
        </div>
      </CenterModal>

      <SidebarModal
        isOpen={shoppingCartModal}
        onClose={closeShoppingCartModal}
        modalTitle="Shopping Cart"
        modalSize="w-40"
      >
        <Cart closemodal={closeShoppingCartModal} />
      </SidebarModal>
    </>
  );
};

export default Header;
