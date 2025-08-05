import React, { useMemo, useState } from "react";
import "./RecentOrders.scss";
import Iconify from "@components/ui/iconify/Iconify";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import Image from "next/image";
import Counter from "@components/ui/counter/Counter";

const RecentOrders = () => {
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
  // Track image errors for each product by index
  const [imgErrors, setImgErrors] = useState({});

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
        {productsList.map((product, index) => {
          const {
            imageSrc,
            casNumber,
            catalogNumber,
            mdlNumber,
            mwNumber,
            title,
            availability,
          } = product;

          return (
            <div key={index} className="recent-product_table-body_product-list">
              <div className="recent-product-detail">
                <div className="recent-product-detail-container">
                  <div className="recent-product-detail-container__image-container">
                    {availability === true && (
                      <div className="product-detail-availability-tag green">
                        <div className="product-availability-icon">
                          <Iconify icon="prime:check-circle" width={16} />
                        </div>
                        <div className="product-availability-status-title">
                          In Stock
                        </div>
                      </div>
                    )}
                    {availability === false && (
                      <div className="product-detail-availability-tag red">
                        <div className="product-availability-icon">
                          <Iconify icon="mingcute:warning-line" width={16} />
                        </div>
                        <div className="product-availability-status-title">
                          Out of Stock
                        </div>
                      </div>
                    )}

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

                  <div className="recent-product-detail-container__detail">
                    <div className="product-detail-page-detail-title">
                      <div className="product_title">{title}</div>
                    </div>
                    <div className="product-detail-page-detail-info">
                      {casNumber && (
                        <div className="product_info_number">
                          <span className="key">Cas No.</span>
                          <span>:</span>
                          <span className="value">{casNumber}</span>
                        </div>
                      )}
                      {catalogNumber && (
                        <div className="product_info_number">
                          <span className="key">Catalog</span>
                          <span>:</span>
                          <span className="value">{catalogNumber}</span>
                        </div>
                      )}
                      {mdlNumber && (
                        <div className="product_info_number">
                          <span className="key">MDL</span> <span>:</span>
                          <span className="value">{mdlNumber}</span>
                        </div>
                      )}
                      {mwNumber && (
                        <div className="product_info_number">
                          <span className="key">MW</span>
                          <span>:</span>
                          <span className="value">{mwNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="recent-product-quantity">
                <Counter />
              </div>
              <div className="recent-product-price">
                <div className="recent-product-price_title">Price:</div>
                <div className="recent-product-price_value">$276.33</div>
              </div>
              <div className="recent-product-total">
                <div className="recent-product-total_title">Total:</div>
                <div className="recent-product-total_value">$552.66</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrders;
