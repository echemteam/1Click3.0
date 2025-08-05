import React, { useContext, useMemo, useState, useEffect } from "react";
import Counter from "@components/ui/counter/Counter";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import "./OrderOverview.scss";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import ValidationText from "@components/Common/validation/validationText";
import { Messages } from "@utils/Messages/Messages";
import Input from "@components/ui/input/Input";
import { useAddEditOrderDetailMutation, useLazyCheckPoNumberQuery, useLazyGetItemByOrderIdQuery } from "src/redux/serviceApi/OrderAPI";
import SwalAlert from "src/services/swal/SwalService";
import { TabContext } from "@features/context/TabContext";
import OrderContext from "@features/contextAPIs/OrderContext";
import Loading from "src/app/loading";
import Textarea from "@components/ui/textarea/Textarea";
import Label from "@components/ui/label/Label";

const OrderOverview = () => {
  const { setActiveTab, tabs, markTabAsCompleted } = useContext(TabContext);
  const { orderId, setOrderId } = useContext(OrderContext);

  const currentTabIndex = 2;
  const [checkPoNumber, { isSuccess: isCheckPoNumberSuccess, data: isCheckPoNumberData }] = useLazyCheckPoNumberQuery();
  const [getItemByOrderId, { isFetching: isGetItemByOrderIdFetch, isSuccess: isGetItemByOrderIdSuccess, data: isGetItemByOrderIdData }] = useLazyGetItemByOrderIdQuery();
  const [addEditOrderDetail, { isLoading: isAddEditOrderDetailLoading, isSuccess: isAddEditOrderDetailSuccess, data: isAddEditOrderDetailData }] = useAddEditOrderDetailMutation();
  const { toast } = SwalAlert();
  const [OrderitemData, setOrderitemData] = useState({});
  const [formData, setFormData] = useState({
    poNumber: "",
    refNumber: "",
    note: "",
  });
  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });


  // Validation rules similar to SignUpPage
  const validationRules = {
    poNumber: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "purchase order number"),
      },
    ],

  };

  const validation = (key, object) => {
    const validRules = { ...validationRules };
    const validStates = { ...validState };
    const returnValidState = validate(key, object, validRules, validStates);
    setValidState(returnValidState);
    // handlePoNumberBlur();
    if (key === "poNumber" && returnValidState?.isValid && !returnValidState?.error?.poNumber) {
      handlePoNumberBlur(object.poNumber);
    }
  };

  const isValid = () => {
    const returnValidState = isValidForm(formData, validationRules, validState);
    setValidState(returnValidState);
    return returnValidState.isValid;
  };

  useEffect(() => {
    if (orderId > 0) {
      getItemByOrderId(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isGetItemByOrderIdFetch && isGetItemByOrderIdSuccess && isGetItemByOrderIdData) {
      setOrderitemData(isGetItemByOrderIdData);
      setFormData({ poNumber: isGetItemByOrderIdData.purchaseOrder === "0" ? "" : isGetItemByOrderIdData.purchaseOrder || "", refNumber: isGetItemByOrderIdData.refNumber === "0" ? "" : isGetItemByOrderIdData.refNumber || "", note: isGetItemByOrderIdData.note || "" })

    }
  }, [isGetItemByOrderIdData, isGetItemByOrderIdSuccess, isGetItemByOrderIdFetch]);

  const handleBack = () => {
    setActiveTab(prev => Math.max(prev - 1, 0));
  }

  const handleChange = (field) => (e) => {
    let { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // const handlePoNumberBlur = async () => {
  //   if (isValid) {
  //     await checkPoNumber({ poNumber: formData.poNumber }).unwrap();
  //   }
  // };

  const handlePoNumberBlur = async (poNumber) => {

    if (poNumber) {
      const res = await checkPoNumber({ poNumber }).unwrap();
      if (res?.keyValue === 1) {
        setValidState((prev) => ({
          ...prev,
          isValid: false,
          error: {
            ...prev.error,
            poNumber: "This purchase order number already exists.",
          },
        }));
      } else {

        setValidState((prev) => ({
          ...prev,
          error: {
            ...prev.error,
            poNumber: "",
          },
        }));
      }
    }

  };

  useEffect(() => {
    if (isCheckPoNumberSuccess && isCheckPoNumberData.keyValue === 1) {
      toast("warning", isCheckPoNumberData.errorMessage);
    }
  }, [isCheckPoNumberSuccess, isCheckPoNumberData])

  const handleNext = () => {
    if (validState.isValid === true) {
      if (isValid() && orderId) {
        const request = {
          orderId: orderId,
          refNumber: formData?.refNumber,
          purchaseOrder: formData?.poNumber,
          note: formData?.note,
        };
        addEditOrderDetail(request);
      }
    } else {
      const poNumberTrimmed = formData?.poNumber?.trim();
      const poAlreadyExists = isCheckPoNumberData.errorMessage.includes("exists");

      setValidState((prev) => ({
        ...prev,
        isValid: false,
        error: {
          ...prev.error,
          ...(poNumberTrimmed
            ? poAlreadyExists
              ? { poNumber: "This purchase order number already exists." }
              : {}
            : {}),
        },
      }));
      return;
    }
  };

  useEffect(() => {
    if (isAddEditOrderDetailSuccess && isAddEditOrderDetailData) {
      if (isAddEditOrderDetailData > 0) {
        setOrderId(isAddEditOrderDetailData)
        toast("success", "Order Detail Updated")
        markTabAsCompleted(currentTabIndex);
        setActiveTab(prevTab => {
          const nextTab = prevTab + 1;
          return nextTab < tabs.length ? nextTab : prevTab;
        });

      }
    }
  }, [isAddEditOrderDetailSuccess, isAddEditOrderDetailData])

  return (
    <>
      <div className="order-review">
        <div className="title-desc-top">
          <div className="left-title-sec">
            <h2 className="page-title">Order Review</h2>
            <p className="desc">Please review your order.</p>
          </div>
        </div>
        <div className="product-lists">
          <div className="cart-lists">
            <div className="cart-product">
              <div className="cart-product_table-head">
                <h2 className="cart-product_table-head_title">
                  Product Details
                </h2>
                <h2 className="cart-product_table-head_title">Quantity</h2>
                <h2 className="cart-product_table-head_title">Unit Price</h2>
                <h2 className="cart-product_table-head_title">Total Price</h2>
              </div>
              <div className="cart-product_table-body">
                {isGetItemByOrderIdFetch ? (
                  <Loading />) : (
                  OrderitemData.orderItemList?.map((product, index) => (
                    <div
                      key={index}
                      className="cart-product_table-body_product-list"
                    >
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
                                <Image
                                  src={AppIcons.ProductDetailCardPlaceholder}
                                  alt="product-placeholder-image"
                                  width={0}
                                  height={0}
                                />
                              </div>
                            )} */}
                          </div>

                          <div className="cart-product-detail-container__detail">
                            <div className="product-detail-page-detail-title">
                              <div className="product_title">{product?.chemicalName}</div>
                            </div>
                            <div className="product-detail-page-detail-info">
                              <div className="product_info_number">
                                <span className="key">Catalog</span>
                                <span>:</span>
                                <span className="value">{product.catalogId ? product?.catalogId : '-'}</span>
                              </div>

                              <div className="product_info_number">
                                <span className="key">MDL</span>{" "}
                                <span>:</span>
                                <span className="value">{product.mdlNumber ? product?.mdlNumber : '-'}</span>
                              </div>

                              <div className="product_info_number">
                                <span className="key">Cas No.</span>
                                <span>:</span>
                                <span className="value">{product.casNumber ? product?.casNumber : '-'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="cart-product-quantity">
                        <span>{`${product.quantity} X ${product.packSize} ${product.size}`}</span>
                        {/* <Counter counts={product?.quantity} disabled /> */}
                      </div>
                      <div className="cart-product-price">
                        <div className="cart-product-price_title">Price:</div>
                        <div className="cart-product-price_value">${(product?.unitPrice)?.toFixed(2)}</div>
                      </div>
                      <div className="cart-product-total">
                        <div className="cart-product-total_title">Total:</div>
                        <div className="cart-product-total_value">${(product?.totalPrice)?.toFixed(2)}</div>
                      </div>
                    </div>

                  ))
                )}
              </div>
            </div>
            {/* Form Fields with Validation */}
            <div className="form-fields">
              <div className="form-field">
                <Label label="Purchase Order" isRequired={true} />
                <Input
                  type="text"
                  cssClass="input-field"
                  value={formData?.poNumber || ""}
                  onChange={handleChange("poNumber")}
                  onBlur={() => validation("poNumber", formData)}
                  // onBlur={handlePoNumberBlur}
                  placeholder="Purchase Order"
                  maxLength={20}
                // isRequired={true} 
                />
                <ValidationText errorText={validState.error.poNumber} />
              </div>
              <br />
              <div className="form-field">
                <Label label="Reference Number" isRequired={false} />
                <Input
                  type="text"
                  cssClass="input-field"
                  value={formData?.refNumber || ""}
                  onChange={handleChange("refNumber")}
                  placeholder="Reference Number"
                  maxLength={20}
                />
                <ValidationText errorText={validState.error.refNumber} />
              </div>
              <br />
              <div className="form-field">
                <Label label="Special Note" isRequired={false} />
                <Textarea
                  placeholder="Special Note"
                  name="note"
                  maxLength={1000}
                  value={formData?.note || ""}
                  onChange={handleChange("note")}

                />


              </div>
            </div>
          </div>

          <div className="cart-details">
            <div className="cart-info-form">
              <div className="cart-form-title">Order Details</div>
              <div className="charges-heading">
                <span className="heading-txt">Charges</span>
                <span className="heading-total">Total</span>
              </div>
              <div className="cart-heading">
                <span className="heading-txt">Order Total</span>
                <span className="heading-total">${OrderitemData?.subTotalPrice?.toFixed(2) || "0.00"}</span>
              </div>
              {OrderitemData?.shippingCharges > 0 &&
                <div className="cart-heading">
                  <span className="heading-txt">Shipping Charges</span>
                  <span className="heading-total">${OrderitemData?.shippingCharges?.toFixed(2) || "0.00"}</span>
                </div>
              }
              {OrderitemData?.handlingCharges > 0 &&
                <div className="cart-heading">
                  <span className="heading-txt">Handling Charges </span>
                  <span className="heading-total">${OrderitemData?.handlingCharges?.toFixed(2) || "0.00"}</span>
                </div>
              }
              {/* <div className="cart-heading">
                <span className="heading-txt">Discount</span>
                <span className="heading-total">${OrderitemData?.discountPrice}</span>
              </div> */}

              <div className="form-sec">
                <div className="total-price">
                  <span>Total</span>
                  <span>${OrderitemData?.orderPrice?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="bottom-note">
                  <p>
                    You will be redirected to Payment page. You may purchase or
                    PO (if already approved on Terms) or Credit Card.
                  </p>
                  <div className="payment_partners">
                    <Image
                      src={AppIcons.PPartners1}
                      alt="logo"
                      width={0}
                      height={0}
                    />
                    <Image
                      src={AppIcons.PPartners2}
                      alt="logo"
                      width={0}
                      height={0}
                    />
                    <Image
                      src={AppIcons.PPartners3}
                      alt="logo"
                      width={0}
                      height={0}
                    />
                    <Image
                      src={AppIcons.PPartners4}
                      alt="logo"
                      width={0}
                      height={0}
                    />
                  </div>
                </div>
                <div className="bottom-btns">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon="ph:arrow-left-bold"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    endIcon="ph:arrow-right-bold"
                    onClick={handleNext}
                    disabled={isAddEditOrderDetailLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-navigation"></div>
        </div>
      </div>
    </>
  );
};

export default OrderOverview;
