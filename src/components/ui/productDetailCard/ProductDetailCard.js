"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Iconify from "../iconify/Iconify";
import "./ProductDetailCard.scss";
import Button from "../button/Button";
import IconButton from "../iconButton/IconButton";
import CenterModal from "../centerModal/CenterModal";
import RFQModal from "@features/products/productList/components/rfqModal/RFQModal";
import { isAuthorized } from "src/lib/authenticationLibrary";
import { useAddEditWishListMutation } from "src/redux/serviceApi/wishListAPI";
import SwalAlert from "src/services/swal/SwalService";
import { useLazyGetRenderImagebychemProductIdAndInchikeyQuery } from "src/redux/serviceApi/ImageAPI";
import Loading from "src/app/loading";
import Checkbox from "../checkbox/Checkbox";

const ProductDetailCard = ({
  // imageSrc = "",
  casNumber = "{casno}",
  catalogNumber = "{catalogno}",
  mdlNumber = "{mdlnum}",
  title = "{productname}",
  price = "0.00",
  actionButtons = "{}",
  availability = null,
  isFavourite,
  onWishlistToggle,
  inChikey
}) => {


  const [imgError, setImgError] = useState(false);
  const [rfqModalOpen, setModalOpen] = React.useState(false);
  const [addEditWishList, { isSuccess: isaddEditWishListSuccess, data: isaddEditWishListData },] = useAddEditWishListMutation();
  const { toast } = SwalAlert();
  const isAuthenticate = isAuthorized();
  const [imageSrc, setImageSrc] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [
    getRenderImagebychemProductIdAndInchikey,
    {
      isLoading: isGetRenderImagebychemProductIdAndInchikeyLoading,
      isSuccess: isGetRenderImagebychemProductIdAndInchikeySucess,
      data: imageBlob,
    },
  ] = useLazyGetRenderImagebychemProductIdAndInchikeyQuery();

  useEffect(() => {
    if (inChikey) {
      getRenderImagebychemProductIdAndInchikey({
        chemProductID: "",
        inChIKey: inChikey,
      });
    }
  }, [inChikey]);

  useEffect(() => {
    if (isGetRenderImagebychemProductIdAndInchikeySucess && imageBlob instanceof Blob) {
      const objectUrl = URL.createObjectURL(imageBlob);
      setImageSrc(objectUrl);
      setImgError(false);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [imageBlob, isGetRenderImagebychemProductIdAndInchikeySucess])

  const handlewishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let request = {
      CatalogId: catalogNumber,
      isWishListProduct: isFavourite
    }
    addEditWishList(request);
  }
  useEffect(() => {
    if (isaddEditWishListSuccess && isaddEditWishListData) {
      if (isaddEditWishListData.errorMessage.includes("added")) {
        toast("success", isaddEditWishListData.errorMessage);
        onWishlistToggle(catalogNumber);
      }
      else if (isaddEditWishListData.errorMessage.includes("removed")) {
        toast("success", isaddEditWishListData.errorMessage);
        onWishlistToggle(catalogNumber);
      }
      else {
        toast("error", "Failed to add product to WishList. Please try again.");
      }
    }
  }, [isaddEditWishListData, isaddEditWishListSuccess]);

  const openModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setModalOpen(true)
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="product-detail-card-container">
      <div className="product-detail-card-container__image-container">
        {availability === true && (
          <div className="product-detail-availability-tag green">
            <div className="product-availability-icon">
              <Iconify icon="prime:check-circle" width={12} />
            </div>
            <div className="product-availability-status-title">In Stock</div>
          </div>
        )}
        {availability === false && (
          <div className="product-detail-availability-tag red">
            <div className="product-availability-icon">
              <Iconify icon="mingcute:warning-line" width={12} />
            </div>
            <div className="product-availability-status-title">
              Out of Stock
            </div>
          </div>
        )}

        {isGetRenderImagebychemProductIdAndInchikeyLoading ? (
          <Loading />
        ) : imageSrc && !imgError ? (
          <div className="product-detail-image">
            <Image
              src={imageSrc}
              alt="product-image"
              width={0}
              height={0}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="product-detail-image-placeholder">
            <Image
              src={AppIcons.ProductDetailCardPlaceholder}
              alt="product-placeholder-image"
              width={0}
              height={0}
            />
          </div>
        )}

        {actionButtons && (
          <div className="product-detail-card-detail-action-button">
            <div className="add-to-cart-btn">

              <Button variant="outlined" color="secondary" startIcon="famicons:cart-outline">
                View
              </Button>
            </div>
            {isAuthenticate && isClient &&
              <div className={`wishlist-btn ${isFavourite ? 'add-to-wishlist' : ''}`}>
                <IconButton
                  variant="outlined"
                  color="secondary"
                  icon="weui:like-outlined"
                  shape="square"
                  onClick={handlewishlist}
                />
              </div>}
            <div className="view-product-btn">

              <IconButton
                variant="outlined"
                color="secondary"
                icon="lsicon:export-outline"
                shape="square"
                onClick={openModal}
              />
            </div>
          </div>
        )}
      </div>
      <CenterModal
        isOpen={rfqModalOpen}
        onClose={closeModal}
        modalTitle="Request Quote"
        transition="grow"
        modalSize="w-60"
        className="mobile-w"
      >
        <RFQModal onClose={closeModal} catalogNumber={catalogNumber} title={title} casNumber={casNumber} mdlNumber={mdlNumber} />
      </CenterModal>
      <div className="product-detail-card-container__detail">
        <div className="product-detail-card-detail-info">
          {catalogNumber && (
            <div className="product_info_number">{catalogNumber}</div>
          )}
          {casNumber && <div className="product_info_number">{casNumber}</div>}
          {mdlNumber && <div className="product_info_number">{mdlNumber}</div>}
        </div>

        <div className="product-detail-card-detail-title">
          <div className="product_title">{title}</div>
        </div>

        {price && (
          <div className="product-detail-card-detail-price">
            <div className="product-price">${price}</div>
          </div>
        )}
      </div>
    </div>
  );
};

ProductDetailCard.propTypes = {
  imageSrc: PropTypes.string,
  casNumber: PropTypes.string,
  catalogNumber: PropTypes.string,
  mdlNumber: PropTypes.string,
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  availability: PropTypes.bool,
  sizeId: PropTypes.string,
  isFavourite: PropTypes.bool,
  onWishlistToggle: PropTypes.func,
  packSize: PropTypes.string
};

export default ProductDetailCard;
