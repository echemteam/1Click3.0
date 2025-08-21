import React, { useContext, useEffect, useMemo, useState } from "react";
import Iconify from "@components/ui/iconify/Iconify";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import "./OrderComplete.scss";
import { useLazyGetOrderDetailsbyOrderIdQuery } from "src/redux/serviceApi/OrderAPI";
import OrderContext from "@features/contextAPIs/OrderContext";
import { useLazyGetAddressDetailsByAddressIdQuery } from "src/redux/serviceApi/addressAPI";
import formatDate from "src/lib/formatDate";
import { useRouter } from "next/navigation";
import { useUpdateShoppingCartByIdMutation } from "src/redux/serviceApi/shoppingCartAPI";
import { useLazyGetTotalCountByUseIdQuery } from "src/redux/serviceApi/commonAPI";


const OrderComplete = () => {
  const router = useRouter();
  const { orderId, shoppingCartListData, setOrderId } = useContext(OrderContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null)
  const [shippingAddress, setShippingAddress] = useState(null)

  const [getOrderDetailsbyOrderId, { isFetching: isGetOrderDetailsbyOrderIdFetching, isSuccess: isGetOrderDetailsbyOrderIdSuccess, data: isGetOrderDetailsbyOrderIdData }] = useLazyGetOrderDetailsbyOrderIdQuery();
  const [getShipingAddressDetailsByAddressId, { data: GetShippingAddressDetailsByAddressIdData, isSuccess: isShippingGetAddressDetailsByAddressIdSuccess, isFetching: isGetShippingAddressDetailsByAddressIdFetching }] = useLazyGetAddressDetailsByAddressIdQuery();
  const [getBillingAddressDetailsByAddressId, { data: GetBillingAddressDetailsByAddressIdData, isSuccess: isGetBillingAddressDetailsByAddressIdSuccess, isFetching: isGetBillingAddressDetailsByAddressIdFetching }] = useLazyGetAddressDetailsByAddressIdQuery()
  const [updateShoppingCartById, { isSuccess: isUpdateSuccess }] = useUpdateShoppingCartByIdMutation();
  const [getTotalCountByUseId] = useLazyGetTotalCountByUseIdQuery();

  useEffect(() => {
    if (orderId > 0) {
      getOrderDetailsbyOrderId(orderId)
    }
  }, [orderId]);

  useEffect(() => {
    let allids = shoppingCartListData.map(item => item.shopppingCartProductId)
    allids = allids.toString().trim();
    const request = {
      ShoppingCartProductIds: allids,
    };
    if (orderId > 0) {
      updateShoppingCartById(request);
    }
  }, []);

  useEffect(() => {
    if (!isGetOrderDetailsbyOrderIdFetching && isGetOrderDetailsbyOrderIdSuccess && isGetOrderDetailsbyOrderIdData) {
      setOrderDetails(isGetOrderDetailsbyOrderIdData);
      setOrderId(0);
      getTotalCountByUseId();
    }
  }, [isGetOrderDetailsbyOrderIdFetching, isGetOrderDetailsbyOrderIdSuccess, isGetOrderDetailsbyOrderIdData])

  useEffect(() => {
    if (orderDetails) {
      getBillingAddressDetailsByAddressId({ addressId: orderDetails.billingAddressId })
      getShipingAddressDetailsByAddressId({ addressId: orderDetails.shippingAddressId })
    }
  }, [orderDetails])
  useEffect(() => {
    if (!isGetShippingAddressDetailsByAddressIdFetching && isShippingGetAddressDetailsByAddressIdSuccess && GetShippingAddressDetailsByAddressIdData) {

      setShippingAddress(GetShippingAddressDetailsByAddressIdData);
    }
  }, [isGetShippingAddressDetailsByAddressIdFetching, isShippingGetAddressDetailsByAddressIdSuccess, GetShippingAddressDetailsByAddressIdData]);
  useEffect(() => {
    if (!isGetBillingAddressDetailsByAddressIdFetching && isGetBillingAddressDetailsByAddressIdSuccess && GetBillingAddressDetailsByAddressIdData) {

      setBillingAddress(GetBillingAddressDetailsByAddressIdData);
    }
  }, [isGetBillingAddressDetailsByAddressIdFetching, isGetBillingAddressDetailsByAddressIdSuccess, GetBillingAddressDetailsByAddressIdData]);


  const list = [
    { value: 1, label: "USA" },
    { value: 2, label: "India" },
    { value: 3, label: "UK" },
  ];
  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };


  const handleHomeClick = () => {
    router.push('/')
  }
  return (
    <>
      <div className="payment-complete-sec">
        <div className="title-desc-top">
          <div className="title-desc-top_alert-part">
            <span className="title-desc-top_alert-part_icon">
              <Iconify icon="prime:check-circle" width={35} />
            </span>
            <span className="title-desc-top_alert-part_content">
              If you want to place the order via PO terms, send us the purchase
              order at sales@1clickchemistry.com
            </span>
          </div>
          <div className="title-desc-top_top-bar-title">
            <div className="left-title-sec">
              <h2 className="page-title">Thank You!</h2>
              <p className="desc">Your Order has been received</p>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleHomeClick}
            >
              Go To Home
            </Button>
          </div>
        </div>
        <div className="product-lists">
          <div className="cart-lists">
            <div className="cart-product">
              <div className="cart-product_table-head">
                <h2 className="cart-product_table-head_title">
                  Product Details
                </h2>
                <h2 className="cart-product_table-head_title">
                  Quantity X PackSize
                </h2>
                <h2 className="cart-product_table-head_title">
                  Unit Price
                </h2>
                <h2 className="cart-product_table-head_title">Total Price</h2>
              </div>
              <div className="cart-product_table-body">
                {orderDetails?.orderItem.map((product, index) => {
                  const { imageSrc } = product;
                  return (
                    <div key={index} className="cart-product_table-body_product-list">
                      <div className="cart-product-detail">
                        <div className="cart-product-detail-container">
                          <div className="cart-product-detail-container__image-container">
                            {imageSrc && !imgErrors[index] ? (
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
                                <Image
                                  src={AppIcons.ProductDetailCardPlaceholder}
                                  alt="product-placeholder-image"
                                  width={0}
                                  height={0}
                                />
                              </div>
                            )}
                          </div>

                          <div className="cart-product-detail-container__detail">
                            <div className="product-detail-page-detail-title">
                              <div className="product_title">{product?.chemicalName}</div>
                            </div>
                            <div className="product-detail-page-detail-info">
                              {product?.catalogId && (
                                <div className="product_info_number">
                                  <span className="key">Catalog</span>
                                  <span>:</span>
                                  <span className="value">{product?.catalogId}</span>
                                </div>
                              )}
                              {product?.mdlNumber && (
                                <div className="product_info_number">
                                  <span className="key">MDL</span>{" "}
                                  <span>:</span>
                                  <span className="value">{product?.mdlNumber}</span>
                                </div>
                              )}
                              {product?.casNumber && (
                                <div className="product_info_number">
                                  <span className="key">Cas No.</span>
                                  <span>:</span>
                                  <span className="value">{product?.casNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="cart-product-quantity">{`${product?.quantity} X ${product.packSize} ${product.size}`}</div>
                      <div className="cart-product-quantity">${product?.unitPrice.toFixed(2)}</div>
                      <div className="cart-product-total">
                        <div className="cart-product-total_title">Total:</div>
                        <div className="cart-product-total_value">${product?.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="order-note">
              <div className="order-note_note">
                <h3 className="order-note_note_title">Notes:</h3>
                <p className="order-note_note_note-content">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy
                  text ever since the 1500s, when an unknown printer took a galley
                  of type and scrambled it to make a type specimen book. Lorem
                  Ipsum is simply
                </p>
              </div>
              <div className="order-note_bill-detail">
                <h3 className="order-note_bill-detail_title">Bill Details</h3>
                <div className="order-note_bill-detail_detail">
                  <span>Sub Total</span>
                  <span>${orderDetails?.subTotalPrice?.toFixed(2)}</span>
                  {orderDetails?.shippingCharges ? (
                    <>
                      <span>Shipping Charges</span>
                      <span>${orderDetails?.shippingCharges?.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <span>Handling Charges</span>
                      <span>${orderDetails?.handlingCharges?.toFixed(2)}</span>
                    </>
                  )}
                  {orderDetails?.cardProcessingCharges !== 0 && (
                    <>
                      <span>Card Processing fee</span>
                      <span>${orderDetails?.cardProcessingCharges?.toFixed(2)}</span>
                    </>
                  )}
                  <div className="total-price">
                    <span>Total</span>
                    <span>${orderDetails?.totalPrice?.toFixed(2)} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cart-details">
            <div className="cart-info-form">
              <div className="cart-info-form_section">
                <div className="cart-form-title">
                  <span>Order Summary</span>
                  <Iconify icon="fluent:print-20-regular" width={60} />
                </div>
                <div className="cart-heading">
                  <span className="heading-txt">Order Number</span>
                  <span className="heading-total">{orderDetails?.orderNumber}</span>
                </div>
                <div className="cart-heading">
                  <span className="heading-txt">Created at</span>
                  <span className="heading-total">{formatDate(orderDetails?.createdAt)}</span>
                </div>
                <div className="cart-heading">
                  <span className="heading-txt">Total Price</span>
                  <span className="heading-total primary">${orderDetails?.totalPrice?.toFixed(2)}</span>
                </div>
                <div className="cart-heading">
                  <span className="heading-txt">Payment Method</span>
                  <span className="heading-total">{orderDetails?.paymentType}</span>
                </div>
              </div>
              <div className="cart-info-form_section">
                <div className="cart-form-title">
                  <span>Billing Address</span>
                </div>
                <div className="cart-heading">
                  <span className="heading-txt">{billingAddress?.attendantName}</span>
                </div>
                <div className="order-address">
                  <span>{billingAddress?.addressLine1} {billingAddress?.addressLine2}
                    {billingAddress?.cityName} {billingAddress?.zipCode}</span>
                  <span>
                    <Iconify icon="gis:location-poi" width={30} />
                  </span>
                </div>
              </div>
              <div className="cart-info-form_section">
                <div className="cart-form-title">
                  <span>Shipping Address</span>
                </div>
                <div className="cart-heading">
                  <span className="heading-txt">{shippingAddress?.attendantName}</span>
                </div>
                <div className="order-address">
                  <span>{shippingAddress?.addressLine1} {shippingAddress?.addressLine2}
                    {shippingAddress?.cityName} {shippingAddress?.zipCode}</span>
                  <span>
                    <Iconify icon="gis:location-poi" width={30} />
                  </span>
                </div>
              </div>
              <div className="cart-info-form_section">
                <Button variant="contained" color="secondary" onClick={handleHomeClick}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderComplete;
