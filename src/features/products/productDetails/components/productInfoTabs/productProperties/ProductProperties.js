import React, { useEffect, useState } from "react";
import "./ProductProperties.scss";
import { useLazyGetProductPropertiesQuery } from "src/redux/serviceApi/productAPI";

const ProductProperties = ({catalogId}) => {
  const [productProperty,setProductProperty]=useState(null);
  const [getProductProperties,{isFetching:getProductPropertiesFetching ,isSuccess:getProductPropertiesSuccess ,data:getProductPropertiesData}]=useLazyGetProductPropertiesQuery();
  useEffect(() => {
    if (catalogId) {
      getProductProperties({catalogId})
    }
  }, [getProductProperties, catalogId]);


  useEffect(()=>{
    if(!getProductPropertiesFetching && getProductPropertiesSuccess && getProductPropertiesData){
      if(getProductPropertiesData){
        setProductProperty(getProductPropertiesData)
      }
    }
  },[getProductPropertiesFetching,getProductPropertiesSuccess,getProductPropertiesData])
  
  
  const infoData = productProperty
    ? [
        { label: "Mol. Formula", value: productProperty.mf || "Not available" },
        { label: "Mol. Weight", value: productProperty.molecularWeight || "Not available" },
        { label: "Rot. Bonds", value: productProperty.rotBonds ?? "Not available" },
        { label: "H Acceptor", value: productProperty.hacceptor ?? "Not available" },
        { label: "H Donor", value: productProperty.hdonor ?? "Not available" },
        { label: "Polar SA", value: productProperty.polarSA || "Not available" },
      ]
    : [];


    const isEmpty =
  !getProductPropertiesFetching &&
  (!productProperty || Object.keys(productProperty).length === 0);

return (
  <div className="product-properties-container">
    {isEmpty ? (
      <div className="no-product-message">
        <p>No product properties found for this catalog item.</p>
      </div>
    ) : (
      <div className="info-table">
        {infoData.map((item, index) => (
          <div className="info-table__row" key={index}>
            <div className="info-table__label">{item.label}</div>
            <div className="info-table__value">{item.value}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default ProductProperties;
