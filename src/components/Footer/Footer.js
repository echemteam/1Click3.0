"use client";
import React from "react";
import Iconify from "@components/ui/iconify/Iconify";
import Link from "next/link";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";

import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-top-section">
        <div className="footer-email-section">
          <div className="footer-email-section-left">
            <div className="footer-email-section-container">
              <Iconify
                icon="material-symbols:mail-outline"
                width={30}
                height={30}
              />
              <div className="footer-email-section-text">
                Share your email to know more about us!
              </div>
            </div>
            <div className="footer-email-section-input-container">
              <input type="email" placeholder="Enter your email" />
              <button className="footer-email-section-input-container-button">
                Submit
              </button>
            </div>
          </div>
          <div className="footer-email-section-right">
            <div className="footer-email-section-social-media-containers">
              <Link
                href="/"
                className="footer-email-section-social-media-containers-link facebook"
              >
                <Iconify icon="ri:facebook-fill" width={20} height={20} />
              </Link>
              <Link
                href="/"
                className="footer-email-section-social-media-containers-link twitter"
              >
                <Iconify icon="prime:twitter" width={17} height={17} />
              </Link>
              <Link
                href="/"
                className="footer-email-section-social-media-containers-link instagram"
              >
                <Iconify icon="mdi:instagram" width={20} height={20} />
              </Link>
              <Link
                href="/"
                className="footer-email-section-social-media-containers-link linkedin"
              >
                <Iconify icon="ri:linkedin-fill" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-main-section">
        <div className="footer-main-container">
          <div className="footer-main-section-left">
            <div className="footer-main-section-left-top">
              <Link href="/" className="footer-main-section-left__logo__image">
                <Image
                  src={AppIcons.LogoLight}
                  alt="footer-logo"
                  width={0}
                  height={0}
                />
              </Link>
              <div className="footer-main-section-left__text">
                Simplyfing chemistry, one click at a time.
              </div>
            </div>
            <div className="footer-main-section-left-bottom">
              <div className="footer-main-section-left-bottom__text">
                QUESTIONS?
              </div>
              <div className="footer-main-section-left-bottom__link">
                <Link href="/">(+1) 888-600-0442</Link>
              </div>
            </div>
          </div>
          <div className="footer-main-section-center">
            <div className="footer-main-section-center-box">
              <div className="footer-main-section-center__label">
                Quick Links
              </div>
              <div className="footer-main-section-center__text">
                <Link href="/">About Us</Link>
                <Link href="/">Contact Us</Link>
                <Link href="/">Terms & Conditions</Link>
                <Link href="/">Privacy Policy</Link>
              </div>
            </div>
            <div className="footer-main-section-center-box">
              <div className="footer-main-section-center__label">
                Our Services
              </div>
              <div className="footer-main-section-center__text">
                <Link href="/">Custom Synthesis</Link>
                <Link href="/">R&D Services</Link>
                <Link href="/">Package Inventories</Link>
                <Link href="/">Chemical Sourcing</Link>
                <Link href="/">Cheminformatics</Link>
              </div>
            </div>
            <div className="footer-main-section-center-box">
              <div className="footer-main-section-center__label">
                Shipping Partners
              </div>
              <div className="footer-main-section-center__image">
                <div className="partners_logo">
                  <Image
                    src={AppIcons.SPartners1}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                  <Image
                    src={AppIcons.SPartners2}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                  <Image
                    src={AppIcons.SPartners3}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                </div>
              </div>
            </div>
            <div className="footer-main-section-center-box">
              <div className="footer-main-section-center__label">
                Payment Methods
              </div>
              
              <div className="footer-main-section-center__image">
              <div className="partners_logo payment_partners">
                  <Image
                    src={AppIcons.PPartners1}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                  <Image
                    src={AppIcons.PPartners2}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                  <Image
                    src={AppIcons.PPartners3}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                  <Image
                    src={AppIcons.PPartners4}
                    alt="logo"
                    width={0}
                    height={0}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="footer-main-section-right">
            <div className="footer-main-section-right__label">Contact Us</div>
            <div className="footer-main-section-right__text">
              <Iconify icon="flowbite:globe-solid" width={20} height={20} />
              <Link href="/">
                1ClickChemistry, Inc.
                <br />
                PO BOX 1638, Allen,TX 75013, TX
                <br />
                75013, USA
              </Link>
            </div>
            <div className="footer-main-section-right__text">
              <Iconify
                icon="material-symbols:mail-outline"
                width={20}
                height={20}
              />
              <Link href="/">sales@1clickchemistry.com</Link>
            </div>
            <div className="footer-main-section-right__text">
              <Iconify icon="ic:baseline-phone" width={20} height={20} />
              <Link href="/">(+1) 888-600-0442</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-legal-section">
        <div className="footer-legal-section-container">
          <Iconify icon="lucide:copyright" width={14} height={14} />{" "}
          <span>1ClickChemistry. 2025. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
