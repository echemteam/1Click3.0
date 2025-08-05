"use client";

import React, { useEffect,  useRef, useState } from "react";
import "./MyWishlist.scss";
import Iconify from "@components/ui/iconify/Iconify";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import Image from "next/image";
import Counter from "@components/ui/counter/Counter";
import { useLazyGetWishlistQuery } from "src/redux/serviceApi/wishListAPI";
import { useSearchParams } from "next/navigation";
import SortBar from "@features/products/productList/components/sortBar/SortBar";
import { encryptUrlData } from "src/services/crypto/CryptoService";
import ProductListView from "@features/products/productList/components/productListView/ProductListView";
import ProductListGrid from "@features/products/productList/components/productListGrid/ProductListGrid";
import DataLoader from "@components/Common/Loader/DataLoader";
import NoProductFound from "@components/ui/noProductFound/NoProductFound";
import { useRouter } from "next/navigation";

const MyWishlist = () => {
  const router = useRouter();
  const [getWishlist, { isFetching: isGetFetching,isSuccess: isGetWishlistSuccess, data: isGetWishlistData  }] = useLazyGetWishlistQuery();
  const [orderBy, setOrderBy] = useState("Asending");
  const [GetWishlistData, setsGetWishlistData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [viewType, setViewType] = useState("grid");
  // Track image errors for each product by index
  const [imgErrors, setImgErrors] = useState({});

  // useEffect(() => {
  //   const order = searchParams.get("orderBy") || "ProductName";
  //   setOrderBy(order);
  // }, [searchParams]);

  useEffect(() => {
    const request = {
      pageIndex: 1,
      pageSize: 10,
      orderby: orderBy,
    };
    getWishlist(request);
  }, [orderBy]);

  useEffect(() => {
    if (!isGetFetching && isGetWishlistSuccess && isGetWishlistData) {
      const rawData = isGetWishlistData?.data || [];
      const transformedData = rawData.map((item) => ({
        productId:item.productId,
        casNumber: item.casNo,
        catalogNumber: item.catalogId,
        mdlNumber: item.mdlNo,
        title: item.productName,
        price: item.price,
        quantity: item.quantity,
        MW: item.mw,
        PackSize: item.packSize,
        isFavourite:item.isFavourite,
       }));
      setsGetWishlistData(transformedData);
      setTotalCount(rawData.length || 0);
    }
  }, [isGetFetching, isGetWishlistSuccess, isGetWishlistData]);
  

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

const handleSortChange = (newOrderBy) => {
  setOrderBy(newOrderBy);
};

const manageProductView = (viewType) => {
  setViewType(viewType);
};
const handleNavigation = (product) => {
  let productId = encryptUrlData(product.productId)
  router.push(`/products/${productId}`);
};

const toggleWishlistStatus = () =>{
  const request = {
    pageIndex: 1,
    pageSize: 10,
    orderby: orderBy,
  };
  getWishlist(request);
}
  
  return (
    <div className='mywishlist-page-section'>
      <div className='mywishlist-page-section__content'>
        <div className="wishlist-product">
          <div className="wishlist-product_table-head">
            <h2 className="wishlist-product_table-head_title">Product</h2>
            <h2 className="wishlist-product_table-head_title">Stock Status</h2>
            <h2 className="wishlist-product_table-head_title">Action</h2>
          </div>
          <div className="wishlist-product_table-body">
          <SortBar onViewChange={manageProductView} onSortChange={handleSortChange} totalCount={totalCount}  />

          {isGetFetching ? (
          <DataLoader /> 
        ) : !isGetFetching && !totalCount ? (
          <h3 style={{ textAlign: "center",  }}>
          <NoProductFound />
          </h3>
        ) : (
          <>
            {viewType === "list" ? (
              <ProductListView products={GetWishlistData} onProductClick={handleNavigation} onWishlistToggle={toggleWishlistStatus}/>
            ) : (
              <ProductListGrid products={GetWishlistData} onProductClick={handleNavigation} onWishlistToggle={toggleWishlistStatus}/>
            )}
          </>
        )}

          {/* {GetWishlistData && GetWishlistData.length > 0 ? (
            GetWishlistData.map((product, index) => (
                <div key={index} className="wishlist-product_table-body_product-list">
                  <div className="wishlist-product-detail">
                 
                    <div className="wishlist-product-detail-container">
                      <div className="wishlist-product-detail-container__image-container">
                        {product.imageSrc && !product.imgErrors[index] ? (
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

                      <div className="wishlist-product-detail-container__detail">
                        <div className="product-detail-page-detail-title">
                     
                          <div className="product_title">{product.productName? product.productName : '-'}</div>
                        </div>
                        <div className="product-detail-page-detail-info">
                        
                            <div className="product_info_number">
                              <span className="key">Cas No.</span>
                              <span>:</span>
                              <span className="value">{product.casNo? product.casNo : '-'}</span>
                            </div>
                         
                         
                            <div className="product_info_number">
                              <span className="key">Catalog</span>
                              <span>:</span>
                              <span className="value">{product.catalogId? product.catalogId : '-'}</span>
                            </div>
                          
                  
                            <div className="product_info_number">
                              <span className="key">MDL</span> <span>:</span>
                              <span className="value">{product.mdlNo? product.mdlNo : '-'}</span>
                            </div>
                         
                            <div className="product_info_number">
                              <span className="key">MW</span>
                              <span>:</span>
                              <span className="value">{product.mw ? product.mw : '-'}</span>
                            </div>
                         
                            <div className="product_info_number">
                              <span className="key"> PackSize</span>
                              <span>:</span>
                              <span className="value">{`${product.packSize ? product.packSize : '-'} ${product.size ? product.size : ''}`}</span>
                            </div>
                        
                     
                            <div className="product_info_number">
                              <span className="key">Price</span>
                              <span>:</span>
                              <span className="value">{product.price? product.price : '-'}</span>
                            </div>
                          
                         
                            <div className="product_info_number">
                              <span className="key">Quantity</span>
                              <span>:</span>
                              <span className="value">{product.quantity? product.quantity : '-'}</span>
                            </div>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="wishlist-product-status">
                    {product.availability === true && (
                      <div className="product-detail-availability-tag green">
                        <div className="product-availability-icon">
                          <Iconify icon="prime:check-circle" width={20} />
                        </div>
                        <div className="product-availability-status-title">
                          In Stock
                        </div>
                      </div>
                    )}
                    {product.availability === false && (
                      <div className="product-detail-availability-tag red">
                        <div className="product-availability-icon">
                          <Iconify icon="mingcute:warning-line" width={20} />
                        </div>
                        <div className="product-availability-status-title">
                          Out of Stock
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="wishlist-product-action">
                    <Button variant="contained" color="tertiary">
                      quick view
                    </Button>
                  </div>
                </div>
                 ))
          ) : (
            <div className="no-records-found">No records found</div>
          )}
           */}
          </div>
         
        </div>
      </div>
    </div> 
  );
};

export default MyWishlist;
