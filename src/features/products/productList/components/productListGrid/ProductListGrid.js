import ProductDetailCard from "@components/ui/productDetailCard/ProductDetailCard";
import React from "react";
import "./ProductListGrid.scss";

const ProductListGrid = ({ products = [], onProductClick,onWishlistToggle }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.application_id}
          className="product-card"
          onClick={() => onProductClick?.(product)}
        >
          <ProductDetailCard
            casNumber={product.casNumber}
            catalogNumber={product.catalogNumber}
            inChikey={product.inChikey}
            mdlNumber={product.mdlNumber}
            title={product.title}
            imageSrc=""
            price={product.price || "0.00"}
            isFavourite ={product?.isFavourite}
            onWishlistToggle={() => onWishlistToggle(product.catalogNumber)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductListGrid;
