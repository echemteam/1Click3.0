import React, { useEffect, useMemo, useState } from "react";
import "./MyViewedProduct.scss";
import Iconify from "@components/ui/iconify/Iconify";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import Image from "next/image";
import { useLazyGetRecentViewsQuery } from "src/redux/serviceApi/recentViewAPI";
import formatDate from "src/lib/formatDate";
import DataLoader from "@components/Common/Loader/DataLoader";
import { useSelector } from "react-redux";
import { encryptUrlData } from "src/services/crypto/CryptoService";
import { useRouter } from "next/navigation";
import Loading from "src/app/loading";

const MyViewedProduct = () => {

  const router = useRouter();
  const [productList, setProductList] = useState([])
  const isAuthenticated = useSelector(state => state.auth.isLogedin);
  // Track image errors for each product by index
  const [imgErrors, setImgErrors] = useState({});
  const [getRecentViews, { isLoading: isGetRecentViewsLoading, isFetching: isGetRecentViewsFetching, isSuccess: isGetRecentViewsSuccess, data: isGetRecentViewsData, },] = useLazyGetRecentViewsQuery();

  useEffect(() => {
    if (isAuthenticated) {
      const request = {
        FilterByDate: false
      }
      getRecentViews(request)
    }
  }, [isAuthenticated])


  useEffect(() => {
    if (!isGetRecentViewsFetching && isGetRecentViewsSuccess && isGetRecentViewsData) {
      if (isGetRecentViewsData) {
        setProductList(isGetRecentViewsData)
      }

    }
  }, [isGetRecentViewsFetching, isGetRecentViewsData, isGetRecentViewsSuccess])

  const handleNavigation = (product) => {
    let productId = encryptUrlData(product.productId);
    router.push(`/products/${productId}`);
  };

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <div className="view-product">
      <div className="view-product_table-head">
        <h2 className="view-product_table-head_title">My Viewed Product</h2>
        <h2 className="view-product_table-head_title">Date</h2>
        <h2 className="view-product_table-head_title">ACTION</h2>
      </div>{
        !isGetRecentViewsFetching ? <div className="view-product_table-body">
          {productList.map((product, index) => {
            const {
              imageSrc,
            } = product;

            return (
              <div key={index} className="view-product_table-body_product-list">
                <div className="view-product-detail">
                  <div className="view-product-detail-container">
                    <div className="view-product-detail-container__image-container">
                      {product.availabilityType === "In Stock" && (
                        <div className="product-detail-availability-tag green">
                          <div className="product-availability-icon">
                            <Iconify icon="prime:check-circle" width={16} />
                          </div>
                          <div className="product-availability-status-title">
                            {product.availabilityType}
                          </div>
                        </div>
                      )}
                      {/* {productList.availabilityType === false && (
                      <div className="product-detail-availability-tag red">
                        <div className="product-availability-icon">
                          <Iconify icon="mingcute:warning-line" width={16} />
                        </div>
                        <div className="product-availability-status-title">
                          Out of Stock
                        </div>
                      </div>
                    )} */}

                      {imageSrc && !imgErrors[index] ? (
                        <div className="product-detail-image">
                          <Image
                            src={imageSrc}
                            alt="product-image"
                            width={0}
                            height={0}
                            onError={() => handleImageError(index)}
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

                    <div className="view-product-detail-container__detail">
                      <div className="product-detail-page-detail-title">
                        <div className="product_title">
                          {product?.productName}
                        </div>
                      </div>
                      <div className="product-detail-page-detail-info">
                        {product?.casNo && (
                          <div className="product_info_number">
                            <span className="key">Cas No.</span>
                            <span>:</span>
                            <span className="value">{product?.casNo}</span>
                          </div>
                        )}
                        {product?.catalogId && (
                          <div className="product_info_number">
                            <span className="key">Catalog</span>
                            <span>:</span>
                            <span className="value">{product?.catalogId}</span>
                          </div>
                        )}
                        {product?.mdlNo && (
                          <div className="product_info_number">
                            <span className="key">MDL</span> <span>:</span>
                            <span className="value">{product?.mdlNo}</span>
                          </div>
                        )}
                        {product?.mwNumber && (
                          <div className="product_info_number">
                            <span className="key">MW</span>
                            <span>:</span>
                            <span className="value">
                              {product?.mwNumber || " - "}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="view-product-date">
                  <div className="view-product-date_title">Date:</div>
                  <div className="view-product-date_value">
                    {formatDate(product?.viewDate, "MM-DD-YYYY")}
                  </div>
                </div>
                <div className="view-product-action">
                  <Button
                    variant="contained"
                    color="tertiary"
                    onClick={() => handleNavigation(product)}
                  >
                    {isGetRecentViewsLoading ? <Loading /> : "quick view"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div> :
          <DataLoader />
      }

    </div>
  );
};

export default MyViewedProduct;
