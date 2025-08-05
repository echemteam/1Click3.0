import React, { useEffect, useState } from "react";
import Checkbox from "@components/ui/checkbox/Checkbox";
import Slider from "@components/ui/slider/Slider";
import Button from "@components/ui/button/Button";
import "./Filters.scss";
// import SwiperSlider from "@components/ui/swiperSlider/SwiperSlider";
import ProductDetailCard from "@components/ui/productDetailCard/ProductDetailCard";
import CenterModal from "@components/ui/centerModal/CenterModal";
import Input from "@components/ui/input/Input";
import SwiperSlider from "@components/ui/swiperSlider/SwiperSlider";
import { useLazyGetRecentViewsQuery } from "src/redux/serviceApi/recentViewAPI";
import { useSelector } from "react-redux";

const Filters = ({ filters, setFilters, onApplyBaseFilters, onApplyAdvancedFilters, resetAllFilters, isFetching }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [range, setRange] = useState([filters.priceFrom || 0, filters.priceTo || 10000]);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [productList, setProductList] = useState([])
  const isAuthenticated = useSelector(state => state.auth.isLogedin);
  const [getRecentViews, { isFetching: isGetRecentViewsFetching, isSuccess: isGetRecentViewsSuccess, data: isGetRecentViewsData, },] = useLazyGetRecentViewsQuery();
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    handleFilterChange("priceFrom", newRange[0]);
    handleFilterChange("priceTo", newRange[1]);
  };

  useEffect(() => {
    if (filters.priceFrom !== undefined && filters.priceTo !== undefined) {
      setRange([filters.priceFrom, filters.priceTo]);
    }
  }, [filters.priceFrom, filters.priceTo]);

  useEffect(() => {
    setRange([filters.priceFrom || 0, filters.priceTo || 10000]);
  }, [filters]);

  const slides = productList.map((item, index) => (
    <div className="slide-card" key={index}>
      <ProductDetailCard casNumber={item.casNo}
        catalogNumber={item.catalogId}
        mdlNumber={item.mdlNo}
        title={item.productName}
        imageSrc=""
      />
    </div>
  ));
  return (
    <div className="filters">
      <h3 className="filters_main-title">Filters</h3>
      <div className="filters_filter-bar">
        <h4 className="filters_filter-bar_title">Availability</h4>
        <label>
          <Checkbox
            label="In Stock"
            color="secondary"
            checked={filters.availability.includes("InStock")}
            onChange={() => {
              const updated = filters.availability.includes("InStock")
                ? filters.availability.filter(val => val !== "InStock")
                : [...filters.availability, "InStock"];
              handleFilterChange("availability", updated);
            }}
          />

          <Checkbox
            label="Backordered"
            color="secondary"
            checked={filters.availability.includes("Backordered")}
            onChange={() => {
              const updated = filters.availability.includes("Backordered")
                ? filters.availability.filter(val => val !== "Backordered")
                : [...filters.availability, "Backordered"];
              handleFilterChange("availability", updated);
            }}
          />
        </label>
      </div>
      <div className="filters_filter-bar">
        <h4 className="filters_filter-bar_title">Select Price</h4>
        <div className="filters_filter-bar_price-range">
          <div className="filters_filter-bar_price-range">
            <div>

              <div className="filters_filter-bar_price-range_lable">
                <span>Min</span>
                <span>Max</span>
              </div>
              <div>
                <Slider
                  color="primary"
                  type="range"
                  min={0}
                  max={10000}
                  setRange={handleRangeChange}
                  valueMin={range[0]}
                  valueMax={range[1]}
                />
              </div>
            </div>
          </div>
          <div className="filters_filter-bar_price-range_filter-button">
            <div className="filters_filter-bar_price-range_filter-button_price">
              <span className="value">${range[0]} — ${range[1]}</span>
            </div>
            <Button variant="contained" color="tertiary" onClick={() => onApplyBaseFilters()} disabled={isFetching}>
              {/* Filter */}  {isFetching ? "Filtering..." : "Filter"}
            </Button>
          </div>
          <div className="filters_filter-bar_price-range_reset-button">

            <Button
              variant="contained"
              color="tertiary"
              onClick={resetAllFilters}
              disabled={isFetching}
            >
              {isFetching ? "Resetting..." : "Reset Filter"}
            </Button>
            <Button variant="contained" color="secondary" onClick={openModal}>
              Advance Search
            </Button>
          </div>
        </div>
      </div>
      <div className="filters_filter-bar">
        <h4 className="filters_filter-bar_title">Recently Viewed</h4>
        <div className="filters_filter-bar_recently-viewed-product">
          <SwiperSlider slides={slides} slidesResponsive={false} />
        </div>
      </div>
      <CenterModal
        isOpen={modalOpen}
        onClose={closeModal}
        modalTitle="Advance Search"
        transition="grow"
        modalSize="w-50"
        className="mobile-w"
      >
        <div className="filter-grid-modal-container">
          <div className="filter-grid-modal">
            <div className="filter-group">
              <label>Mol Formula :</label>
              <div className="single-input">
                <Input
                  type="text"
                  placeholder="Mol Formula"
                  value={filters?.molFormula ?? ''}
                  onChange={(e) => handleFilterChange("molFormula", e.target.value)}
                />

              </div>
            </div>

            <div className="filter-group">
              <label>Mol Weight :</label>
              <div className="range-inputs">
                <Input
                  type="number"
                  placeholder="From"
                  value={filters?.molWeightFrom ?? null}
                  onChange={(e) => handleFilterChange("molWeightFrom", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={filters?.molWeightTo ?? null}
                  onChange={(e) => handleFilterChange("molWeightTo", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>R Bond :</label>
              <div className="range-inputs">
                <Input
                  type="number"
                  placeholder="From"
                  value={filters?.rotBondFrom ?? null}
                  onChange={(e) => handleFilterChange("rotBondFrom", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={filters?.rotBondTo ?? null}
                  onChange={(e) => handleFilterChange("rotBondTo", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Polar SA :</label>
              <div className="range-inputs">
                <Input
                  type="number"
                  placeholder="From"
                  value={filters?.polarSAFrom ?? null}
                  onChange={(e) => handleFilterChange("polarSAFrom", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={filters?.polarSATo ?? null}
                  onChange={(e) => handleFilterChange("polarSATo", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>H Accept :</label>
              <div className="range-inputs">
                <Input
                  type="number"
                  placeholder="From"
                  value={filters?.hAcceptFrom ?? null}
                  onChange={(e) => handleFilterChange("hAcceptFrom", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={filters?.hAcceptTo ?? null}
                  onChange={(e) => handleFilterChange("hAcceptTo", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>H Donor :</label>
              <div className="range-inputs">
                <Input
                  type="number"
                  placeholder="From"
                  value={filters?.hDonorFrom ?? null}
                  onChange={(e) => handleFilterChange("hDonorFrom", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={filters?.hDonorTo ?? null}
                  onChange={(e) => handleFilterChange("hDonorTo", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Log P :</label>
              <div className="range-inputs">
                <Input
                  type="number"
                  placeholder="From"
                  value={filters?.logPFrom ?? null}
                  onChange={(e) => handleFilterChange("logPFrom", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="To"
                  value={filters?.logPTo ?? null}
                  onChange={(e) => handleFilterChange("logPTo", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="modal-button-container">
            <Button variant="contained" color="secondary" onClick={closeModal}>
              Close
            </Button>
            {/* <Button variant="contained" color="primary" onClick={() => onApplyAdvancedFilters()} disabled={isFetching}> */}
            <Button variant="contained" color="primary" onClick={() => { onApplyAdvancedFilters(); closeModal(); }} disabled={isFetching}>
              {/* Save */} {isFetching ? "Applying..." : "Save"}
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};

export default Filters;
