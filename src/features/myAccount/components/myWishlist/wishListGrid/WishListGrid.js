import React from "react";
// import "../wishListGrid.scss";
import ProductDetailWishCard from "./productDetailCard/ProductDetailWishCard";

const WishListGrid = ({ products = [], onProductClick, onWishlistToggle }) => {
  return (
    <div className="product-grid">
      {products.map((product, key) => (
        <div key={product.productId} className="product-grid-item">
          <div
            className="product-card"
            onClick={() => onProductClick?.(product)}
          >
            <ProductDetailWishCard
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

export default WishListGrid;
