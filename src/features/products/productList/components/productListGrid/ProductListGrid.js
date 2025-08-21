import React, { useEffect, useState } from "react";
import ProductDetailCard from "@components/ui/productDetailCard/ProductDetailCard";
import Checkbox from "@components/ui/checkbox/Checkbox";
import "./ProductListGrid.scss";

const ProductListGrid = ({ products = [], onProductClick, onWishlistToggle, handleSelectedProduct }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleSelectProduct = (product) => {

    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (p) => p.catalogId === product.catalogId
      );

      if (isAlreadySelected) {
        // Remove from selected
        return prevSelected.filter((p) => p.catalogId !== product.catalogId);
      } else {
        // Add to selected
        return [...prevSelected, product];
      }
    });
  };

  const isProductSelected = (product) => {
    return selectedProducts.some((p) => p.catalogId === product.catalogId);
  };

  useEffect(() => {
    if (selectedProducts) {
      return handleSelectedProduct(selectedProducts);
    }
  }, [selectedProducts]);

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.catalogId} className="product-grid-item">
          <Checkbox
            label=""
            color="secondary"
            name={product.catalogId}
            checked={isProductSelected(product)}
            onChange={() => handleSelectProduct(product)}
          />
          <div
            className="product-card"
            onClick={() => onProductClick?.(product)}
          >
            <ProductDetailCard
              casNumber={product.casNo}
              catalogNumber={product.catalogId}
              inChikey={product.inChikey}
              mdlNumber={product.mdlNo}
              title={product.productName}
              imageSrc=""
              price={product.price || "0.00"}
              isFavourite={product?.isFavourite}
              onWishlistToggle={() => onWishlistToggle(product.catalogId)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListGrid;
