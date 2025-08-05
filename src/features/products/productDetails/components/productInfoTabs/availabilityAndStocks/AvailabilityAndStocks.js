"use client";
import React, { useEffect, useState } from "react";
import "./AvailabilityAndStocks.scss";
import { useLazyGetStockAvailabilityQuery } from "src/redux/serviceApi/productAPI";

const AvailabilityAndStocks = ({ catalogId }) => {
  const [stockData, setStockData] = useState()
  const [getStockAvailability, { isFetching: isGetStockAvailabilityFetching, isSuccess: isGetStockAvailabilitySuccess, data: isGetStockAvailabilityData, },] = useLazyGetStockAvailabilityQuery();

  useEffect(() => {
    if(catalogId){
      const request = {
        catalogId: catalogId
      }
      getStockAvailability(request)
    }
  }, [catalogId])

  useEffect(() => {
    if (!isGetStockAvailabilityFetching && isGetStockAvailabilitySuccess && isGetStockAvailabilityData)
    
      if (isGetStockAvailabilityData) {
        setStockData(isGetStockAvailabilityData)
      }
  }, [isGetStockAvailabilityFetching, isGetStockAvailabilitySuccess, isGetStockAvailabilityData])

  return (
    <div className="availability-and-stocks-container">
      <div className="info-table">
        {stockData?.map((item, index) => (
          <div className="info-table__row" key={index}>
            <div className="info-table__label">{item?.stockLocation ? item?.stockLocation :" - "}</div>
            <div className="info-table__value">{item?.stockAmount ? item?.stockAmount :"-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityAndStocks;
