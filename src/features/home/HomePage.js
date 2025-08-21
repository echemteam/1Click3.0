"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./HomePage.scss";
import { DropdownWrapper } from "@components/ui/dropdownWrapper/DropdownWrapper";
import Iconify from "@components/ui/iconify/Iconify";
import Button from "@components/ui/button/Button";
import Tabs from "@components/ui/tabs/Tabs";
import SwiperSlider from "@components/ui/swiperSlider/SwiperSlider";
import ProductDetailCard from "@components/ui/productDetailCard/ProductDetailCard";
import { useRouter } from "next/navigation";
import SwalAlert from "src/services/swal/SwalService";
import { useDispatch } from "react-redux";
import { setSearchText } from "src/redux/slice/productSearchSlice";

const HomePage = () => {
  const [searchSelected, setSearchSelected] = useState("Basic");
  const { toast } = SwalAlert();
  const router = useRouter();
  const [searchText, setLocalSearchText] = useState("");
  const dispatch = useDispatch();

  const openSearchModal = (type) => {
    setSearchSelected(type);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) {
      toast("error", "Please enter a search term.");
      return;
    }

    dispatch(setSearchText(searchText));
    router.push("/products");
  };

  // Search options
  const searchOptions = [
    { label: "Basic", handler: () => openSearchModal("Basic") },
    { label: "Structure", handler: () => openSearchModal("Structure") },
  ];

  const tabs = [
    {
      label: "Best Sellers",
      value: "Best Sellers",
      content: (
        <div
          className="d-flex align-items-center justify-center py-8 text-gray-500"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "5px",
            marginTop: "10px",
          }}
        >
          <Iconify icon="mdi:alert-circle-outline" className="w-6 h-6 mr-2" />
          <span>
            No best-selling products are available at the moment. Please check
            back later!
          </span>
        </div>
      ),
    },
    {
      label: "Newly Added",
      value: "Newly Added",
      content: (
        <div
          className="d-flex align-items-center justify-center py-8 text-gray-500"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "5px",
            marginTop: "10px",
          }}
        >
          <Iconify icon="mdi:alert-circle-outline" className="w-6 h-6 mr-2" />
          <span>
            No newly added products found. New items will be available soon!
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="home-page-section">
      <div className="home-page-section__hero">
        <div className="home-page-section__hero__image">
          <Image
            src="/images/hero_section_image.svg"
            alt="hero-section-image"
            width={0}
            height={0}
          />
        </div>
        <div className="home-page-section__hero__content">
          <div className="home-page-section__hero__content__logo">
            <Image
              src="/images/logo_light.svg"
              alt="hero-section-logo"
              width={120}
              height={40}
            />
          </div>
          <div className="home-page-section__hero__content__title">
            Advancing Science with Every Click
          </div>
          <div className="home-page-section__hero__content__subtitle">
            1ClickChemistry offers over 10,000 high-quality building blocks,
            ready to ship worldwide, empowering researchers to drive
            breakthroughs in medicine and healthcare.
          </div>
          <div className="home-page-section__hero__content__input-search-container">
            <form onSubmit={handleSearch} className="home-page-section__hero__content__input-search-container__input-container">
              <input
                type="text"
                placeholder="Chemical name / CAS Number / MDL Number / Catalog..."
                value={searchText}
                onChange={(e) => setLocalSearchText(e.target.value)}
                onKeyDown={(e) => {if (e.key === "Enter") {handleSearch()}}}
              />
              <DropdownWrapper
                gap={10}
                direction="left"
                toggleElement={
                  <div className="home-page-section__hero__content__input-search-container__input-container__dropdown">
                    <div className="home-page-section__hero__content__input-search-container__input-container__dropdown-label">
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
                <div className="home-page-section__hero__content__input-search-container__input-container__dropdown-content">
                  {searchOptions.map(({ label, handler }) => (
                    <button
                      type="button"
                      key={label}
                      className="home-page-section__hero__content__input-search-container__input-container__dropdown-content-btn"
                      onClick={handler}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </DropdownWrapper>
              <button
                type="submit"
                className="home-page-section__hero__content__input-search-container__search-button"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="home-page-section__main">
        <div className="home-page-section__main__contact-us-section">
          <div className="home-page-section__main__contact-us-section__left">
            <div className="title">Providing Chemical Solutions</div>
            <div className="subtitle">
              1Click Chemistry is a leading supplier at the forefront of
              pharmaceutical and research innovation, offering over 180,000
              building blocks (ready to ship worldwide) vital for research and
              development. Our vast and diverse portfolio is crafted to meet the
              exacting standards of modern science, paving the way for
              innovations that shape the future of medicine and healthcare. We
              are committed to fuelling progress by ensuring researchers have
              access to premium quality materials, enabling them to transform
              their ground-breaking ideas into reality.
            </div>
            <Button
              variant="contained"
              endIcon="fluent:contact-card-28-regular"
            >
              Contact Us
            </Button>
          </div>
          <div className="home-page-section__main__contact-us-section__right">
            <Image
              src="/images/1c_main_section_logo.svg"
              alt="hero-section-image"
              width={0}
              height={0}
            />
          </div>
        </div>
        <div className="home-page-section__main__tabs">
          <Tabs tabs={tabs} />
          <div className="home-page-section__main__tabs__button">
            <Button variant="text" endIcon="iconamoon:arrow-right-2-duotone">
              View All
            </Button>
          </div>
        </div>
        <div className="home-page-section__main__about-us-section">
          <div className="home-page-section__main__about-us-section__left">
            <div className="title">Providing Chemical Solutions</div>
            <div className="subtitle">
              1Click Chemistry is a leading supplier at the forefront of
              pharmaceutical and research innovation, offering over 180,000
              building blocks (ready to ship worldwide) vital for research and
              development. Our vast and diverse portfolio is crafted to meet the
              exacting standards of modern science, paving the way for
              innovations that shape the future of medicine and healthcare. We
              are committed to fuelling progress by ensuring researchers have
              access to premium quality materials, enabling them to transform
              their ground-breaking ideas into reality.
            </div>
            <Button
              variant="contained"
              endIcon="fluent:contact-card-28-regular"
            >
              Contact Us
            </Button>
          </div>
          <div className="home-page-section__main__about-us-section__right">
            <div className="home-page-section__main__about-us-section__right__image">
              <Image
                src="/images/1c_about_us_main_section.svg"
                alt="hero-section-image"
                width={0}
                height={0}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="home-page-section__offer-section_bg">
        <div className="home-page-section__offer-section_bg__offer-section">
          <div className="home-page-section__offer-section_bg__offer-section__title">
            What we Offer
          </div>
          <div className="home-page-section__offer-section_bg__offer-section__content">
            <div className="home-page-section__offer-section_bg__offer-section__content__card">
              <div className="home-page-section__offer-section_bg__offer-section__content__card__header">
                <div className="home-page-section__offer-section_bg__offer-section__content__card__header__image">
                  <Image
                    src="/images/building_block_image.svg"
                    alt="building-block-image"
                    width={0}
                    height={0}
                  />
                </div>
                <div className="home-page-section__offer-section_bg__offer-section__content__card__header__title">
                  Building Blocks
                </div>
              </div>
              <div className="home-page-section__offer-section_bg__offer-section__content__card__content">
                Novel collection of scaffolds and unique building blocks that
                can diversify your drug discovery process.
              </div>
            </div>
            <div className="home-page-section__offer-section_bg__offer-section__content__card">
              <div className="home-page-section__offer-section_bg__offer-section__content__card__header">
                <div className="home-page-section__offer-section_bg__offer-section__content__card__header__image">
                  <Image
                    src="/images/biopolymers_image.svg"
                    alt="biopolymers-image"
                    width={0}
                    height={0}
                  />
                </div>
                <div className="home-page-section__offer-section_bg__offer-section__content__card__header__title">
                  Biopolymers
                </div>
              </div>
              <div className="home-page-section__offer-section_bg__offer-section__content__card__content">
                Unique collection of PEGylation reagents & polymers,
                polysaccharides, fluorescent and biotinylated polymers.
              </div>
            </div>
            <div className="home-page-section__offer-section_bg__offer-section__content__card">
              <div className="home-page-section__offer-section_bg__offer-section__content__card__header">
                <div className="home-page-section__offer-section_bg__offer-section__content__card__header__image">
                  <Image
                    src="/images/compounds_image.svg"
                    alt="compounds-image"
                    width={0}
                    height={0}
                  />
                </div>
                <div className="home-page-section__offer-section_bg__offer-section__content__card__header__title">
                  APIs & Ref. Compounds
                </div>
              </div>
              <div className="home-page-section__offer-section_bg__offer-section__content__card__content">
                Offering novel life-science reagents, anticancer agents, kinase
                inhibitors and life science aimed R&D products.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-page-section__help-center">
        <div className="home-page-section__help-center__title">Help Center</div>
        <div className="home-page-section__help-center__subtitle">
          Online Suport 24/7
        </div>
        <div className="home-page-section__help-center__content">
          <div className="home-page-section__help-center__content__card">
            <div className="home-page-section__help-center__content__card__left">
              <div className="home-page-section__help-center__content__card__left__icon">
                <Iconify icon="proicons:call" width={40} height={40} />
              </div>
            </div>
            <div className="home-page-section__help-center__content__card__right">
              <div className="home-page-section__help-center__content__card__right__title">
                Call Us
              </div>
              <div className="home-page-section__help-center__content__card__right__content">
                Call now 888-600-0442
              </div>
            </div>
          </div>
          <div className="home-page-section__help-center__content__card">
            <div className="home-page-section__help-center__content__card__left">
              <div className="home-page-section__help-center__content__card__left__icon">
                <Iconify icon="mage:message-dots" width={40} height={40} />
              </div>
            </div>
            <div className="home-page-section__help-center__content__card__right">
              <div className="home-page-section__help-center__content__card__right__title">
                Chat with Us
              </div>
              <div className="home-page-section__help-center__content__card__right__content">
                Chat with us 24/7
              </div>
            </div>
          </div>
          <div className="home-page-section__help-center__content__card">
            <div className="home-page-section__help-center__content__card__left">
              <div className="home-page-section__help-center__content__card__left__icon">
                <Iconify icon="hugeicons:mail-02" width={40} height={40} />
              </div>
            </div>
            <div className="home-page-section__help-center__content__card__right">
              <div className="home-page-section__help-center__content__card__right__title">
                Email Us
              </div>
              <div className="home-page-section__help-center__content__card__right__content">
                Email us at support@1clickchemistry.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
