import React, { useEffect, useMemo, useState } from "react";
import "./RecentOrders.scss";
import Iconify from "@components/ui/iconify/Iconify";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import Image from "next/image";
import Counter from "@components/ui/counter/Counter";
import { useLazyGetRecentOrdersByUserIdQuery } from "src/redux/serviceApi/OrderAPI";
import { isAuthorized } from "src/lib/authenticationLibrary";
import DataLoader from "@components/Common/Loader/DataLoader";

const RecentOrders = () => {
  const [imgErrors, setImgErrors] = useState({});
  const isAuthenticate = isAuthorized();
  const [products, setProducts] = useState([]);

  const [getRecentOrdersByUserId, {isLoading, isSuccess, data}] = useLazyGetRecentOrdersByUserIdQuery();
  const productsList = useMemo(
    () => [
      {
        application_id: "1",
        imageSrc: "",
        casNumber: "101554-76-1",
        catalogNumber: "2C65140",
        mdlNumber: "MFCD00236937",
        mwNumber: "244.29",
        title:
          "ε-Maleimidocaproic acid-(2-nitro-4-sulfo)-phenyl ester . solium salt",
        price: "59.0",
        description:
          "H302 (100%): Harmful if swallowed [Warning Acute toxicity, oral], H332 (100%): Harmful if inhaled [Warning Acute toxicity, inhalation], H411 (100%): Toxic to aquatic life with long lasting effects [Hazardous to the aquatic environment, long-term hazard]",
        availability: true,
      },
      {
        application_id: "1",
        imageSrc: "",
        casNumber: "101554-76-1",
        catalogNumber: "2C65140",
        mdlNumber: "MFCD00236937",
        mwNumber: "244.29",
        title:
          "ε-Maleimidocaproic acid-(2-nitro-4-sulfo)-phenyl ester . solium salt",
        price: "59.0",
        description:
          "H302 (100%): Harmful if swallowed [Warning Acute toxicity, oral], H332 (100%): Harmful if inhaled [Warning Acute toxicity, inhalation], H411 (100%): Toxic to aquatic life with long lasting effects [Hazardous to the aquatic environment, long-term hazard]",
        availability: true,
      },
      {
        application_id: "1",
        imageSrc: "",
        casNumber: "101554-76-1",
        catalogNumber: "2C65140",
        mdlNumber: "MFCD00236937",
        mwNumber: "244.29",
        title:
          "ε-Maleimidocaproic acid-(2-nitro-4-sulfo)-phenyl ester . solium salt",
        price: "59.0",
        description:
          "H302 (100%): Harmful if swallowed [Warning Acute toxicity, oral], H332 (100%): Harmful if inhaled [Warning Acute toxicity, inhalation], H411 (100%): Toxic to aquatic life with long lasting effects [Hazardous to the aquatic environment, long-term hazard]",
        availability: true,
      },
    ],
    []
  );

  useEffect(() => {
    if (isAuthenticate) {
      getRecentOrdersByUserId();
    }
  }, [isAuthenticate]);

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      
      const productsList = Array.isArray(data) ? data : [data];

      const transformedData = productsList.map((item) => ({
        catalogId : item.catalogId,
        chemicalName : item.chemicalName,
        casNumber : item.casNumber,
        mdlNumber : item.mdlNumber,
        quantity : item.quantity,
        unitPrice : item.unitPrice,
        totalPrice : item.totalPrice,
        mw : item.mw,
        imageSrc : "",
        availability : true
      }))

      setProducts(transformedData);
    }
  }, [isLoading, isSuccess, data]);

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  return (
    <div className="recent-product">
      <div className="recent-product_table-head">
        <h2 className="recent-product_table-head_title">Recent Orders</h2>
        <h2 className="recent-product_table-head_title">Quantity</h2>
        <h2 className="recent-product_table-head_title">Price</h2>
        <h2 className="recent-product_table-head_title">Total</h2>
      </div>
      <div className="recent-product_table-body">
        {isLoading ? <DataLoader /> :
          products.map((product, index) => (
          <div
            key={`${product.catalogId ?? "row"}-${index}`}
            className="recent-product_table-body_product-list"
          >
            <div className="recent-product-detail">
              <div className="recent-product-detail-container">
                <div className="recent-product-detail-container__image-container">
                  {product.availability ? (
                    <div className="product-detail-availability-tag green">
                      <div className="product-availability-icon">
                        <Iconify icon="prime:check-circle" width={16} />
                      </div>
                      <div className="product-availability-status-title">
                        In Stock
                      </div>
                    </div>
                  ) : (
                    <div className="product-detail-availability-tag red">
                      <div className="product-availability-icon">
                        <Iconify icon="mingcute:warning-line" width={16} />
                      </div>
                      <div className="product-availability-status-title">
                        Out of Stock
                      </div>
                    </div>
                  )}

                  {product.imageSrc && !imgErrors[index] ? (
                    <div className="product-detail-image">
                      <Image
                        src={product.imageSrc}
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

                <div className="recent-product-detail-container__detail">
                  <div className="product-detail-page-detail-title">
                    <div className="product_title">{product.chemicalName}</div>
                  </div>

                  <div className="product-detail-page-detail-info">
                    {product.casNumber && (
                      <div className="product_info_number">
                        <span className="key">Cas No.</span>
                        <span>:</span>
                        <span className="value">{product.casNumber}</span>
                      </div>
                    )}

                    {product.catalogId && (
                      <div className="product_info_number">
                        <span className="key">Catalog</span>
                        <span>:</span>
                        <span className="value">{product.catalogId}</span>
                      </div>
                    )}

                    {product.mdlNumber && (
                      <div className="product_info_number">
                        <span className="key">MDL</span>
                        <span>:</span>
                        <span className="value">{product.mdlNumber}</span>
                      </div>
                    )}

                    {product.mw !== undefined && product.mw !== null && (
                      <div className="product_info_number">
                        <span className="key">MW</span>
                        <span>:</span>
                        <span className="value">{product.mw}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-product-quantity">
              <Counter counts={product.quantity ?? 1} disabled />
            </div>

            <div className="recent-product-price">
              <div className="recent-product-price_title">Price:</div>
              <div className="recent-product-price_value">
                ${product.unitPrice}
              </div>
            </div>

            <div className="recent-product-total">
              <div className="recent-product-total_title">Total:</div>
              <div className="recent-product-total_value">
                ${product.totalPrice}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
