import React, { useContext, useEffect, useMemo, useState } from "react";
import Counter from "@components/ui/counter/Counter";
import Button from "@components/ui/button/Button";
import "./ShoppingCart.scss";
import SwalAlert from "src/services/swal/SwalService";
import { TabContext } from "@features/context/TabContext";
import OrderContext from "@features/contextAPIs/OrderContext";
import IconButton from "@components/ui/iconButton/IconButton";
import { useLazyGetTotalCountByUseIdQuery } from "src/redux/serviceApi/commonAPI";
import { useLazyGetShoppingCartByIdQuery, useUpdateQuantityMutation, useUpdateShoppingCartByIdMutation } from "src/redux/serviceApi/shoppingCartAPI";
import { useRouter } from "next/navigation";
import DataLoader from "@components/Common/Loader/DataLoader";

const ShoppingCart = () => {
  const router = useRouter();
  const { confirm, toast } = SwalAlert();
  const { setActiveTab, tabs } = useContext(TabContext);
  const { setShoppingCartListData } = useContext(OrderContext);
  const [shoppingCartData, setShoppingCartData] = useState([]);

  const [getTotalCountByUseId] = useLazyGetTotalCountByUseIdQuery();
  const [updateShoppingCartById, { isSuccess: isUpdateSuccess }] = useUpdateShoppingCartByIdMutation();
  const [getShoppingCartById, { isLoading: isGetShoppingCartByIdLoading, isSuccess: isGetShoppingCartByIdSuccess, data: isGetShoppingCartByIdData }] = useLazyGetShoppingCartByIdQuery();
  const [UpdateQuantity, { isLoading: isUpdateQuantityLoading, data: isUpdateQuantityData, isSuccess: isUpdateQuantitySuccess }] = useUpdateQuantityMutation();

  useEffect(() => {
    getShoppingCartById();
  }, []);

  useEffect(() => {
    if (isGetShoppingCartByIdSuccess && isGetShoppingCartByIdData) {
      const cartWithSelection = isGetShoppingCartByIdData.map((product) => ({
        ...product,
        selected: false,
      }));
      setShoppingCartData(cartWithSelection);
    }
  }, [isGetShoppingCartByIdSuccess, isGetShoppingCartByIdData]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast("success", "Product Removed From Your Cart.");
      getShoppingCartById();

    }
  }, [isUpdateSuccess, getShoppingCartById]);

  useEffect(() => {
    if (!isUpdateQuantityLoading && isUpdateQuantityData && isUpdateQuantitySuccess) {
      toast("success", "Product Quantity Updated.");
    }
  }, [isUpdateQuantityLoading, isUpdateQuantityData && isUpdateQuantitySuccess]);

  const totalPrice = useMemo(() => {
    const total = shoppingCartData
      .reduce((sum, product) => sum + product.price * product.quantity, 0);
    return total?.toFixed(2);
  }, [shoppingCartData]);

  const handleQuantityChange = (index, newQuantity, shopppingCartProductId) => {
    setShoppingCartData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
    let request = {
      shopppingCartProductId,
      quantity: newQuantity
    }
    UpdateQuantity(request);
  };

  const handleDelete = (id) => {
    id = id.toString().trim();
    confirm(
      "Remove Product?",
      "Are you sure you want to Remove this product?",
      "Yes, Remove",
      "Cancel",
      true
    ).then((result) => {
      if (result) {
        const request = {
          ShoppingCartProductIds: id,
        };
        updateShoppingCartById(request);
        getTotalCountByUseId();
      }
    })
  }

  const handleProceedToCheckOut = () => {
    setActiveTab(prevTab => {
      const nextTab = prevTab + 1;
      return nextTab < tabs.length ? nextTab : prevTab;
    });
    if (shoppingCartData.length > 0) {
      setShoppingCartListData(shoppingCartData);
    }
  }

  const handleRemoveAll = async () => {

    const confirmation = await confirm(
      "Remove All Products?",
      "Are you sure you want to Remove All Products?",
      "Yes, Remove All",
      "Cancel"
    );
    if (confirmation === true) {
      let allIds = shoppingCartData.map(item => item.shopppingCartProductId)
      allIds = allIds.toString().trim();
      const request = {
        ShoppingCartProductIds: allIds,
      };
      await updateShoppingCartById(request);
      await getTotalCountByUseId();
    }
  }

  const handleHomeClick = () => {
    router.push('/')
  }

  return (
    <div className="shopping-cart">
      {isGetShoppingCartByIdLoading ? <DataLoader /> :
        <>
          <div className="title-desc-top">
            <div className="left-title-sec">
              <h2 className="page-title">Shopping Cart</h2>
              <p className="desc">View Your Cart</p>
            </div>
          </div>
          <div className="product-lists">
            <div className="cart-lists">
              <div className="cart-product">
                {shoppingCartData.length > 0 && (
                  <Button
                    variant="contained"
                    color="danger"
                    startIcon="material-symbols:delete"
                    onClick={handleRemoveAll}
                  >
                    Remove All
                  </Button>
                )}
                <div className="cart-product_table-head">
                  <h2 className="cart-product_table-head_title">
                    Product Details
                  </h2>
                  <h2 className="cart-product_table-head_title">Quantity</h2>
                  <h2 className="cart-product_table-head_title">Unit Price</h2>
                  <h2 className="cart-product_table-head_title">Total Price</h2>
                </div>
                <div className="cart-product_table-body">
                  {shoppingCartData.map((product, index) => {
                    return (
                      <div
                        key={index}
                        className="cart-product_table-body_product-list"
                      >
                        <div className="cart-product-checkbox">
                          <IconButton
                            icon="mdi:delete"
                            variant="text"
                            color="danger"
                            shape="round"
                            onClick={() =>
                              handleDelete(product.shopppingCartProductId)
                            }
                          />
                        </div>
                        <div className="cart-product-detail">
                          <div className="cart-product-detail-container">
                            <div className="cart-product-detail-container__image-container">
                              {/* {imageSrc && !imgErrors[index] ? (
                              <div className="product-detail-image">
                                <Image
                                  src={imageSrc}
                                  alt="product-image"
                                  width={0}
                                  height={0}
                                  onError={() => handleImageError(index)}
                                />
                              </div>
                            ) : (
                              <div className="product-detail-image-placeholder">
                              </div>
                            )} */}
                            </div>
                            <div className="cart-product-detail-container__detail">
                              <div className="product-detail-page-detail-title">
                                <div className="product_title">
                                  {product.productName}
                                </div>
                              </div>
                              <div className="product-detail-page-detail-info">
                                {product.catalogId && (
                                  <div className="product_info_number">
                                    <span className="key">Catalog</span>
                                    <span>:</span>
                                    <span className="value">
                                      {product.catalogId}
                                    </span>
                                  </div>
                                )}
                                {product.mdlNo && (
                                  <div className="product_info_number">
                                    <span className="key">MDL</span>{" "}
                                    <span>:</span>
                                    <span className="value">{product.mdlNo}</span>
                                  </div>
                                )}
                                {product.casNo && (
                                  <div className="product_info_number">
                                    <span className="key">Cas No.</span>
                                    <span>:</span>
                                    <span className="value">{product.casNo}</span>
                                  </div>
                                )}
                                {product.packSize && (
                                  <div className="product_info_number">
                                    <span className="key">Size</span>
                                    <span>:</span>
                                    <span className="value">
                                      <span>{`${product.packSize} ${product.size}`}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cart-product-quantity">
                          <Counter
                            counts={product.quantity}
                            onChange={(newQuantity) =>
                              handleQuantityChange(
                                index,
                                newQuantity,
                                product.shopppingCartProductId
                              )
                            }
                            onRemove={
                              () => handleDelete(product.shopppingCartProductId)
                            }
                          />
                        </div>
                        <div className="cart-product-price">
                          <div className="cart-product-price_title">Price:</div>
                          <div className="cart-product-price_value">
                            ${product.price?.toFixed(2)}
                          </div>
                        </div>
                        <div className="cart-product-total">
                          <div className="cart-product-total_title">Total:</div>
                          <div className="cart-product-total_value">
                            ${(product.price * product.quantity)?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="cart-details">
              <div className="cart-info-form">
                <div className="cart-form-title">Cart Totals</div>
                <div className="cart-heading">
                  <span className="heading-txt">No Of Products</span>
                  <span className="heading-total">{shoppingCartData.length}</span>
                </div>
                <div className="form-sec">
                  <div className="total-price">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="bottom-btns">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon="ph:arrow-left-bold"
                      onClick={handleHomeClick}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      endIcon="ph:arrow-right-bold"
                      onClick={handleProceedToCheckOut}
                      disabled={shoppingCartData.length === 0}
                    >
                      Proceed to checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-navigation"></div>
          </div>
        </>
      }</div>
  );
};

export default ShoppingCart;