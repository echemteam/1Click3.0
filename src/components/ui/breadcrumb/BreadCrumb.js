'use client'

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./BreadCrumb.scss";
import Iconify from "../iconify/Iconify";
import { useSelector } from "react-redux";

const Breadcrumb = () => {
  let breadcrumbCatalogId  = useSelector((state) => state.productSearch.breadcrumbCatalogId);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Define paths or prefixes where breadcrumb should be hidden
  const hiddenPaths = ["/", "/sign-up", "/landing","/cart"];
  const shouldHide = hiddenPaths.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );

  if (shouldHide) return null;

  const generateHref = (index) => "/" + segments.slice(0, index + 1).join("/");

  return (
    <div className="breadcrumb-section">
      <div className="breadcrumb-container">
        <div className="breadcrumb-container__item">
          <Link href="/" className="breadcrumb-container__text">
            Home
          </Link>
          {segments.length > 0 && (
            <Iconify icon="mdi:chevron-right" className="breadcrumb-container__icon" />
          )}
        </div>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          const isProductDetailsPage = 
            segments.length === 2 && 
            segments[0].toLowerCase() === "products";

          // Hide last segment temporarily only on product details page
          if (isLast && isProductDetailsPage && !breadcrumbCatalogId) {
            return null;
          }

          // Show catalogId only on product details page, if available
          const label =
            isLast && isProductDetailsPage && breadcrumbCatalogId
              ? breadcrumbCatalogId
              : decodeURIComponent(segment).replace(/-/g, " ");

          return (
            <div key={index} className="breadcrumb-container__item">
              <Link
                href={generateHref(index)}
                className={`breadcrumb-container__text ${isLast ? "active" : ""}`}
              >
                {label}
              </Link>
              {!isLast && (
                <Iconify icon="mdi:chevron-right" className="breadcrumb-container__icon" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;
