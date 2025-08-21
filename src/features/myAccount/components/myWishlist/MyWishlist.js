"use client";

import React, { useEffect, useState } from "react";
import "./MyWishlist.scss";
import { useLazyGetWishlistQuery } from "src/redux/serviceApi/wishListAPI";
import SortBar from "@features/products/productList/components/sortBar/SortBar";
import { encryptUrlData } from "src/services/crypto/CryptoService";
import DataLoader from "@components/Common/Loader/DataLoader";
import NoProductFound from "@components/ui/noProductFound/NoProductFound";
import { useRouter } from "next/navigation";
import WishListGrid from "./wishListGrid/WishListGrid";
import WishListView from "./wishListView/WishListView";
import { useLazyGetTotalCountByUseIdQuery } from "src/redux/serviceApi/commonAPI";
import Button from "@components/ui/button/Button";

const MyWishlist = () => {
  const router = useRouter();
  const [getWishlist, { isLoading: isGetWishListLoading, isSuccess: isGetWishlistSuccess, data: isGetWishlistData }] = useLazyGetWishlistQuery();
  const [getTotalCountByUseId] = useLazyGetTotalCountByUseIdQuery();
  const [orderBy, setOrderBy] = useState("Asending");
  const [GetWishlistData, setsGetWishlistData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showLessLoading, setShowLessLoading] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [viewType, setViewType] = useState("grid");
  // Track image errors for each product by index
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    fetchWishlist(1, false);
  }, [orderBy]);

  useEffect(() => {
    if (!isGetWishListLoading && isGetWishlistSuccess && isGetWishlistData) {
      const updatedAllData =
        pageIndex === 1 ? isGetWishlistData.data : [...allData, ...isGetWishlistData.data];
      setAllData(updatedAllData);
      setsGetWishlistData(updatedAllData.slice(0, pageIndex * 10));
      setHasMore(pageIndex * 10 < isGetWishlistData.count);
      getTotalCountByUseId();
    }
  }, [isGetWishListLoading, isGetWishlistSuccess, isGetWishlistData]);

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };


  const fetchWishlist = (page, shouldAppend = false) => {
    const request = {
      pageIndex: page,
      pageSize: 10,
      orderby: orderBy,
    };
    getWishlist(request);
  };

  const handleSortChange = (newOrderBy) => {
    setOrderBy(newOrderBy?.value);
  };

  const manageProductView = (viewType) => {
    setViewType(viewType);
  };
  const handleNavigation = (product) => {
    let productId = encryptUrlData(product.productId);
    router.push(`/products/${productId}`);
  };

  const toggleWishlistStatus = () => {
    fetchWishlist(1, false);
  };

  const handlePageChange = () => {
    const nextPage = pageIndex + 1;
    setPageIndex(nextPage);
    fetchWishlist(nextPage, true);
    console.log('GetWishlistData', GetWishlistData);
  };


  const handleShowLess = () => {
    setShowLessLoading(true);
    setTimeout(() => {
      if (pageIndex > 1) {
        const newPage = pageIndex - 1;
        setPageIndex(newPage);
        const newData = allData.slice(0, newPage * 10);
        setTotalCount(newData.length);
        setsGetWishlistData(newData);
        setHasMore(true);
        fetchWishlist(newPage, true);
      }
      setShowLessLoading(false);
    }, 300);
  };

  return (

    < div className="mywishlist-page-section" >
      <div className="mywishlist-page-section__content">
        <div className="wishlist-product">
          {/* <div className="wishlist-product_table-head">
            <h2 className="wishlist-product_table-head_title">Product</h2>
            <h2 className="wishlist-product_table-head_title">Stock Status</h2>
            <h2 className="wishlist-product_table-head_title">Action</h2>
          </div> */}
          <div className="wishlist-product_table-body">
            <SortBar
              onViewChange={manageProductView}
              onSortChange={handleSortChange}
              totalCount={GetWishlistData?.length}
            />
            {!isGetWishListLoading && isGetWishlistData?.data.length > 0 ? (
              <>
                {viewType === "list" && (
                  <WishListView
                    products={GetWishlistData}
                    onProductClick={handleNavigation}
                    onWishlistToggle={toggleWishlistStatus}
                  />
                )}
                {viewType !== "list" && (
                  <WishListGrid
                    products={GetWishlistData}
                    onProductClick={handleNavigation}
                    onWishlistToggle={toggleWishlistStatus}
                  />
                )}
              </>
            ) : (
              isGetWishListLoading && <DataLoader />
            )}
            {!isGetWishListLoading && isGetWishlistData?.data.length === 0 && (
              <h3 style={{ textAlign: "center" }}>
                <NoProductFound />
              </h3>
            )}

            {GetWishlistData && GetWishlistData.length > 0 && (
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                {pageIndex > 1 && (
                  <Button
                    color="secondary"
                    onClick={handleShowLess}
                    disabled={showLessLoading}
                    style={{ marginRight: "1rem", display: "inline-block" }}
                  >
                    {showLessLoading ? "Loading..." : "Show Less"}
                  </Button>
                )}
                {hasMore && (
                  <Button
                    color="secondary"
                    onClick={handlePageChange}
                    disabled={isGetWishListLoading}
                    style={{ marginRight: "1rem", display: "inline-block" }}
                  >
                    {isGetWishListLoading ? "Loading..." : "Show More"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default MyWishlist;
