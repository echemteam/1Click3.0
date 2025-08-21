import React from "react";
import "./WishListView.scss";
import ProductDetailWishListCard from "./productDetailWishListCard/ProductDetailWishListCard";

const WishListView = ({ products = [], onProductClick, onWishlistToggle }) => {
  return (
    <div className="product-list">
      {products.map((product, key) => (
        <div key={product.productId}>
          <div onClick={() => onProductClick?.(product)}>
            <ProductDetailWishListCard
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

export default WishListView;
