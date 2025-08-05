import React from "react";
import "./ProductListView.scss";
import ProductDetailListCard from "@components/ui/productDetailListCard/ProductDetailListCard";

const ProductListView = ({ products, onProductClick, onWishlistToggle }) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <div
          key={product.application_id}
          onClick={() => onProductClick?.(product)}
        >
           <ProductDetailListCard
            casNumber={product.casNumber}
            catalogNumber={product.catalogNumber}
            inChikey={product.inChikey}
            mdlNumber={product.mdlNumber}
            title={product.title}
            imageSrc=''
            price={product.price || "0.00"}
            isFavourite ={product?.isFavourite}
            onWishlistToggle={() => onWishlistToggle(product.catalogNumber)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductListView;
