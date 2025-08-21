import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import "./ProductDetailWishListCard.scss";
import RFQModal from "@features/products/productList/components/rfqModal/RFQModal";
import { isAuthorized } from "src/lib/authenticationLibrary";
import { useAddEditWishListMutation } from "src/redux/serviceApi/wishListAPI";
import SwalAlert from "src/services/swal/SwalService";
import { useLazyGetRenderImagebychemProductIdAndInchikeyQuery } from "src/redux/serviceApi/ImageAPI";
import Loading from "src/app/loading";
import Iconify from "@components/ui/iconify/Iconify";
import Button from "@components/ui/button/Button";
import IconButton from "@components/ui/iconButton/IconButton";
import CenterModal from "@components/ui/centerModal/CenterModal";
import DataLoader from "@components/Common/Loader/DataLoader";

const ProductDetailWishListCard = ({
  casNumber = "{casno}",
  catalogNumber = "{catalogno}",
  mdlNumber = "{mdlnum}",
  title = "{productname}",
  price = "0.00",
  actionButtons = "{}",
  availability = null,
  isFavourite,
  onWishlistToggle,
  inChikey,
}) => {
  const { toast } = SwalAlert();
  const [imgError, setImgError] = useState(false);
  const [rfqModalOpen, setModalOpen] = React.useState(false);

  const [
    addEditWishList,
    {
      isLoading: isaddEditWishListLoading,
      isSuccess: isaddEditWishListSuccess,
      data: isaddEditWishListData,
    },
  ] = useAddEditWishListMutation();

  const isAuthenticate = isAuthorized();
  const [imageSrc, setImageSrc] = useState(null);

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
    if (
      isGetRenderImagebychemProductIdAndInchikeySucess &&
      imageBlob instanceof Blob
    ) {
      const objectUrl = URL.createObjectURL(imageBlob);
      setImageSrc(objectUrl);
      setImgError(false);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [imageBlob, isGetRenderImagebychemProductIdAndInchikeySucess]);

  const openModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlewishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let request = {
      CatalogId: catalogNumber,
      isWishListProduct: isFavourite,
    };
    addEditWishList(request);
  };

  useEffect(() => {
    if (isaddEditWishListSuccess && isaddEditWishListData) {
      if (isaddEditWishListData.errorMessage.includes("added")) {
        toast("success", isaddEditWishListData.errorMessage);
        onWishlistToggle(catalogNumber);
      } else if (isaddEditWishListData.errorMessage.includes("removed")) {
        toast("success", isaddEditWishListData.errorMessage);
        onWishlistToggle(catalogNumber);
      } else {
        toast("error", "Failed to add product to WishList. Please try again.");
      }
    }
  }, [isaddEditWishListData, isaddEditWishListSuccess]);

  return (
    <div className="product-detail-list-card-container">
      <div className="product-detail-list-card-container__image-container">
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
      </div>

      <div className="product-detail-list-card-container__detail">
        <div>
          <div className="product-detail-list-card-detail-title">
            <div className="product_title">{title}</div>
          </div>
          <div className="product-detail-list-card-detail-info">
            {catalogNumber && (
              <div className="product_info_number">{catalogNumber}</div>
            )}
            {casNumber && (
              <div className="product_info_number">{casNumber}</div>
            )}
            {mdlNumber && (
              <div className="product_info_number">{mdlNumber}</div>
            )}
          </div>
          {price && (
            <div className="product-detail-list-card-detail-price">
              <div className="product-price">${price}</div>
            </div>
          )}
        </div>
        {actionButtons && (
          <div className="product-detail-list-card-detail-action-button">
            <Button variant="outlined" color="secondary">
              View
            </Button>
            {isAuthenticate && isaddEditWishListLoading ? (
              <div className="wishlist-btn">
                <DataLoader />
              </div>
            ) : (
              <div
                className={`wishlist-btn ${
                  isFavourite ? "add-to-wishlist" : ""
                }`}
              >
                <IconButton
                  variant="outlined"
                  color="secondary"
                  icon="weui:like-outlined"
                  shape="square"
                  onClick={handlewishlist}
                />
              </div>
            )}
            <IconButton
              variant="outlined"
              color="secondary"
              icon="lsicon:export-outline"
              shape="square"
              onClick={openModal}
            />
          </div>
        )}
      </div>

      <CenterModal
        isOpen={rfqModalOpen}
        onClose={closeModal}
        modalTitle="Request Quote"
        transition="grow"
        modalSize="w-60"
      >
        <RFQModal
          onClose={closeModal}
          catalogNumber={catalogNumber}
          title={title}
          casNumber={casNumber}
          mdlNumber={mdlNumber}
        />
      </CenterModal>
    </div>
  );
};

ProductDetailWishListCard.propTypes = {
  imageSrc: PropTypes.string,
  casNumber: PropTypes.string,
  catalogNumber: PropTypes.string,
  mdlNumber: PropTypes.string,
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  availability: PropTypes.bool,
  isFavourite: PropTypes.bool,
  onWishlistToggle: PropTypes.func,
};

export default ProductDetailWishListCard;
