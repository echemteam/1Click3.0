"use client";

import React, { useEffect, useState } from "react";
import "./ProductListPage.scss";
import ProductListView from "./components/productListView/ProductListView";
import ProductGridView from "./components/productListGrid/ProductListGrid";
import { useRouter, useSearchParams } from "next/navigation";
import Filters from "./components/filters/Filters";
import SortBar from "./components/sortBar/SortBar";
import IconButton from "@components/ui/iconButton/IconButton";
import Button from "@components/ui/button/Button";
import { useGetAllProductTextSearchMutation } from "src/redux/serviceApi/productAPI";
import { useDispatch, useSelector } from "react-redux";
import { setSearchText } from "src/redux/slice/productSearchSlice";
import { encryptUrlData } from "src/services/crypto/CryptoService";
import DataLoader from "@components/Common/Loader/DataLoader";
import NoProductFound from "@components/ui/noProductFound/NoProductFound";
import { useLazyGetTotalCountByUseIdQuery } from "src/redux/serviceApi/commonAPI";
import CenterModal from "@components/ui/centerModal/CenterModal";
import RFQModal from "./components/rfqModal/RFQModal";

const ProductListPage = () => {
  const [viewType, setViewType] = useState("grid");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  // const { structureRequest, isStructure } = router.query;
  // const requestStructure=JSON.parse(structureRequest);
  const searchParams = useSearchParams();
  const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || "ProductName");
  const [dataSource, setDataSource] = useState();
  const [totalCount, setTotalCount] = useState();

  const [getAllProductTextSearch, { isLoading, isSuccess, data }] =
    useGetAllProductTextSearchMutation();
  const [getTotalCountByUseId] = useLazyGetTotalCountByUseIdQuery();
  const dispatch = useDispatch();
  const [structureSearchList, setStructureSearchList] = useState([])
  // const [getAllProductStructureSearch, {isFetching: isGetAllProductStructureSearchFetching, isSuccess: isGetAllProductStructureSearchSuccess, data: GetAllProductStructureSearchData}] = useLazyGetAllProductStructureSearchQuery();

  const searchText = useSelector((state) => state.productSearch.searchText);
  // const [structureSearchList, setStructureSearchList] = useState([])



  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);
  const [showLessLoading, setShowLessLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openMRFQForm, setOpenMRFQForm] = useState(false);
  const defaultFilterState = {
    availability: [],
    priceFrom: 0,
    priceTo: 10000,
    molFormula: "",
    molWeightFrom: null,
    molWeightTo: null,
    logPFrom: null,
    logPTo: null,
    polarSAFrom: null,
    polarSATo: null,
    hAcceptFrom: null,
    hAcceptTo: null,
    hDonorFrom: null,
    hDonorTo: null,
    rotBondFrom: null,
    rotBondTo: null,
  };
  const defaultResetFilterState = {
    availability: [],
    priceFrom: 0,
    priceTo: 10000,
    molFormula: "",
    molWeightFrom: null,
    molWeightTo: null,
    logPFrom: null,
    logPTo: null,
    polarSAFrom: null,
    polarSATo: null,
    hAcceptFrom: null,
    hAcceptTo: null,
    hDonorFrom: null,
    hDonorTo: null,
    rotBondFrom: null,
    rotBondTo: null,
  };
  const [filters, setFilters] = useState({ ...defaultFilterState });
  const [appliedFilters, setAppliedFilters] = useState({
    ...defaultFilterState,
  });

  useEffect(() => {
    fetchProductList(1, false);
  }, []);

  // useEffect(() => {
  //   if (isStructure === true && requestStructure) {
  //     getAllProductStructureSearch(requestStructure)
  //   }
  // }, [isStructure,requestStructure])


  // useEffect(() => {
  //   if (!isGetAllProductStructureSearchFetching && isGetAllProductStructureSearchSuccess && GetAllProductStructureSearchData) {
  //     if (GetAllProductStructureSearchData) {
  //       setDataSource(GetAllProductStructureSearchData)
  //     }
  //   }
  // }, [isGetAllProductStructureSearchFetching, isGetAllProductStructureSearchSuccess, GetAllProductStructureSearchData])

  useEffect(() => {
    if (searchText) {
      setPageIndex(1);
      // getAllProductTextSearch({
      //   searchText,
      //   pageIndex: 1,
      //   pageSize: 10,
      //   orderby: orderBy,
      // });
      fetchProductList(1, false);
    }
  }, [searchText, orderBy, appliedFilters]);

  useEffect(() => {
    if (!isLoading && isSuccess && data) {
      if (data.count === 1) {
        const product = data?.data[0] || null;
        const productId = encryptUrlData(product.productId);
        router.push(`/products/${productId}`);
        return;
      }

      const updatedAllData =
        pageIndex === 1 ? data?.data : [...(allData || []), ...data?.data];

      setAllData(updatedAllData);
      setDataSource(updatedAllData.slice(0, pageIndex * 10));

      setTotalCount(updatedAllData.length);
      setHasMore(pageIndex * 10 < data.count);
    }
  }, [isLoading, isSuccess, data]);

  useEffect(() => {
    if (searchText) {
      dispatch(setSearchText(searchText));
    }
  }, [searchText]);

  const fetchProductList = (page, shouldAppend = false) => {
    const requestData = {
      searchText,
      pageIndex: page,
      pageSize: 10,
      orderby: orderBy,
      ...appliedFilters,
      availability: appliedFilters.availability?.join(",") || null,
    };
    getAllProductTextSearch(requestData);
  };

  const toggleWishlistStatus = (catalogId) => {
    const updated = allData.map((product) =>
      product.catalogId === catalogId
        ? { ...product, isFavourite: !product.isFavourite }
        : product
    );
    setAllData(updated);
    setDataSource(updated.slice(0, pageIndex * 10));
    getTotalCountByUseId();
  };

  const handlePageChange = () => {
    const nextPage = pageIndex + 1;
    setPageIndex(nextPage);
    fetchProductList(nextPage, true);
  };

  const handleSortChange = (newOrderBy) => {
    setOrderBy(newOrderBy);
  };

  const manageProductView = (viewType) => {
    setViewType(viewType);
  };

  const handleNavigation = (product) => {
    let productId = encryptUrlData(product.productId);
    router.push(`/products/${productId}`);
  };

  const handleShowLess = () => {
    setShowLessLoading(true);
    setTimeout(() => {
      if (pageIndex > 1) {
        const newPage = pageIndex - 1;
        const newData = allData.slice(0, newPage * 10);
        setPageIndex(newPage);
        setAllData(newData);
        setDataSource(newData);
        setTotalCount(newData.length);
        setHasMore(true);
      }
      setShowLessLoading(false);
    }, 300);
  };

  const onApplyBaseFilters = () => {
    setPageIndex(1);
    setAppliedFilters({ ...filters });
    fetchProductList(1, true)
  }

  const onApplyAdvancedFilters = () => {
    setPageIndex(1);
    setAppliedFilters({ ...filters });
    fetchProductList(1, true)

  };
  const resetAllFilters = () => {
    const resetState = { ...defaultFilterState };
    setFilters(resetState);
    setAppliedFilters(resetState);
    setPageIndex(1);
    fetchProductList(1, true);
  };

  const handleSelectedProduct = (selectedProducts) => {
    setSelectedProducts(selectedProducts);
  };
  const handleMRFQForm = () => {
    if (openMRFQForm) {
      // when closing modal → clear selected products
      setSelectedProducts([]);
      fetchProductList(1, false);
    }
    setOpenMRFQForm(!openMRFQForm);
  };

  return (
    <>
      <div className={`main-container ${isOpen ? "backdrop-filter" : ""}`}>

        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <aside className="filter-sidebar">
            {/* <Filters /> */}
            <Filters filters={filters} setFilters={setFilters} onApplyBaseFilters={onApplyBaseFilters}
              onApplyAdvancedFilters={onApplyAdvancedFilters} defaultFilterState={defaultFilterState} setAppliedFilters={setAppliedFilters} resetAllFilters={resetAllFilters}
            // isFetching={isFetching}
            />
          </aside>
          <div className="sidebar-filter">
            <IconButton
              variant="contained"
              icon={`${isOpen ? "material-symbols:close-rounded" : "mage:filter"
                }`}
              shape="square"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
        <div className="content-area">
          <SortBar
            onViewChange={manageProductView}
            onSortChange={handleSortChange}
            totalCount={totalCount}
            orderBy={orderBy}
            openMRFQForm={handleMRFQForm}
            selectedProducts={selectedProducts}
          />
          {!isLoading && isSuccess && data?.data.length > 0 ? (
            <>
              {viewType === "list" && (
                <ProductListView
                  products={dataSource}
                  onProductClick={handleNavigation}
                  onWishlistToggle={toggleWishlistStatus}
                  handleSelectedProduct={handleSelectedProduct}
                />
              )}
              {viewType !== "list" && (
                <ProductGridView
                  products={dataSource}
                  onProductClick={handleNavigation}
                  onWishlistToggle={toggleWishlistStatus}
                  handleSelectedProduct={handleSelectedProduct}
                />
              )}
            </>
          ) : (
            isLoading && !isSuccess && <DataLoader />
          )}
          {!isLoading && isSuccess && data?.data.length === 0 && (
            <NoProductFound />
          )}

          {dataSource && dataSource.length > 0 && (
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
                  disabled={isLoading}
                  style={{ marginRight: "1rem", display: "inline-block" }}
                >
                  {isLoading ? "Loading..." : "Show More"}
                </Button>
              )}
            </div>
          )}
        </div>
        {openMRFQForm && (
          <CenterModal
            isOpen={openMRFQForm}
            onClose={handleMRFQForm}
            modalTitle="Request Quote"
            transition="grow"
            modalSize="w-60"
            className="mobile-w"
          >
            <RFQModal
              onClose={handleMRFQForm}
              isMultiRFQForm={true}
              selectedProducts={selectedProducts}
            />
          </CenterModal>
        )}
      </div>
    </>
  );
};

export default ProductListPage;
