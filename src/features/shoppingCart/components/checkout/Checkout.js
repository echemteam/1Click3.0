"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./Checkout.scss";
import Input from "@components/ui/input/Input";
import Button from "@components/ui/button/Button";
import Iconify from "@components/ui/iconify/Iconify";
import Label from "@components/ui/label/Label";
import Select from "@components/ui/select/Select";
import Checkbox from "@components/ui/checkbox/Checkbox";
import Textarea from "@components/ui/textarea/Textarea";
import Image from "next/image";
import Counter from "@components/ui/counter/Counter";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import { useLazyGetAddressDetailsByAddressIdQuery, useLazyGetUserAddressByIdQuery } from "src/redux/serviceApi/addressAPI";
import CenterModal from "@components/ui/centerModal/CenterModal";
import AddAddress from "./AddAddress";
import { useLazyGetShippingMethodsByIdQuery } from "src/redux/serviceApi/ShippingAPI";
import { Messages } from '@utils/Messages/Messages'
import { validate } from "@utils/Validations/CommonValidator";
import ValidationText from "@components/Common/validation/validationText";
import { AddressType, carrierOptions } from "@components/Common/Enum/CommonEnum";
import { TabContext } from "../../../context/TabContext";
import SwalAlert from "src/services/swal/SwalService";
import { useAddEditOrderAddressMutation, useLazyGetCheckoutTabDataByOrderIdQuery, useLazyGetItemByOrderIdQuery } from "src/redux/serviceApi/OrderAPI";
import OrderContext from "@features/contextAPIs/OrderContext";

const Checkout = () => {
  const { setActiveTab, markTabAsCompleted, tabs } = useContext(TabContext);
  const { orderId, setOrderId, shoppingCartListData, setShoppingCartListData } = useContext(OrderContext);
  const currentTabIndex = 1;
  const { toast } = SwalAlert();
  const [showCoupon, setShowCoupon] = useState(false);
  const router = useRouter();
  const [showBilling, setShowBilling] = useState(false);
  const [shippingAddressList, setShippingAddressList] = useState([]);
  const [billingAddressList, setBillingAddressList] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  const [selectedBillingOption, setSelectedBillingOption] = useState(null);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(null)
  const [selectedBillingAddressId, setSelectedBiliingAddressId] = useState(null)

  const [shippingAddressDetails, setShippingAddressDetails] = useState(null);
  const [billingAddressDetails, setBillingAddressDetails] = useState(null);
  const [isShiipingAddressModalOpen, setShippingIsAddressModalOpen] = useState(false);
  const [isBillingAddressModalOpen, setBillingAddressModalOpen] = useState(false);
  const [shoppingCartItemDetail,setShoppingCartItemDetail]=useState(null);
  //const [getDetailsData,setGetDetailsData]=useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);
  const [formData, setFormData] = useState({
    shippingMethod: null,
    shippingNumber: '',
    carrier: null,
  });
  // const [activeTab, setActiveTab] = useState(0);

  const [getShippingAddresses, { data: shippingData, isSuccess: isShippingSuccess, isFetching: isShippingFetching }] = useLazyGetUserAddressByIdQuery();
  const [getBillingAddresses, { data: billingData, isSuccess: isBillingSuccess, isFetching: isBillingFetching }] = useLazyGetUserAddressByIdQuery();
  const [getShipingAddressDetailsByAddressId, { data: GetShippingAddressDetailsByAddressIdData, isSuccess: isShippingGetAddressDetailsByAddressIdSuccess, isFetching: isGetShippingAddressDetailsByAddressIdFetching }] = useLazyGetAddressDetailsByAddressIdQuery();
  const [getBillingAddressDetailsByAddressId, { data: GetBillingAddressDetailsByAddressIdData, isSuccess: isGetBillingAddressDetailsByAddressIdSuccess, isFetching: isGetBillingAddressDetailsByAddressIdFetching }] = useLazyGetAddressDetailsByAddressIdQuery();
  const [getShippingMethodsById, { isFetching: isfetch, data: isgetShippingMethodsByIdData, isSuccess: isgetShippingMethodsByIdSuccess },] = useLazyGetShippingMethodsByIdQuery();
  const [addEditOrderAddress, { isLoading: isaddEditOrderAddressLoading, isSuccess: isaddEditOrderAddressSuccess, data: addEditOrderAddressData }] = useAddEditOrderAddressMutation();
  const [getCheckoutTabDataByOrderId, { isFetching: isGetCheckoutTabDataByOrderIdFetching, data: isGetCheckoutTabDataByOrderIdData, isSuccess: isGetCheckoutTabDataByOrderIdSuccess },] = useLazyGetCheckoutTabDataByOrderIdQuery();
  const [getItemByOrderId, { isFetching: isGetItemByOrderIdFetch, isSuccess: isGetItemByOrderIdSuccess, data: isGetItemByOrderIdData }] = useLazyGetItemByOrderIdQuery();


  useEffect(() => {
    getShippingAddresses({ AddressTypeId: AddressType.SHIPPING });
    getBillingAddresses({ AddressTypeId: AddressType.BILLING });
  }, []);


  useEffect(() => {
    if (!isShippingFetching && isShippingSuccess && shippingData) {
      let transformedShipping = shippingData.map((item) => ({
        value: item.addressId,
        label: item.addressName,
      }));
      setShippingAddressList(transformedShipping);
      if (!orderId) {
        if (transformedShipping.length > 0) {
          let firstItem = transformedShipping[0];
          setSelectedShippingOption(firstItem.value);
          getShipingAddressDetailsByAddressId({ addressId: firstItem.value });
        }
      }
    }
  }, [isShippingFetching, isShippingSuccess, shippingData]);

  useEffect(() => {
    if (!isBillingFetching && isBillingSuccess && billingData) {
      let transformedBilling = billingData.map((item) => ({
        value: item.addressId,
        label: item.addressName,
      }));
      setBillingAddressList(transformedBilling);
      if (!orderId) {
        if (transformedBilling.length > 0) {
          let firstItem = transformedBilling[0];
          setSelectedBillingOption(firstItem.value);
          getBillingAddressDetailsByAddressId({ addressId: firstItem.value });
        }
      }
    }
  }, [isBillingFetching, isBillingSuccess, billingData]);

  useEffect(() => {
    if (orderId > 0) {
      getShippingAddresses({ AddressTypeId: AddressType.SHIPPING });
      getBillingAddresses({ AddressTypeId: AddressType.BILLING });
      getCheckoutTabDataByOrderId(orderId)
      getItemByOrderId(orderId)
    }
  }, [orderId])



  useEffect(() => {
    if (!isGetCheckoutTabDataByOrderIdFetching && isGetCheckoutTabDataByOrderIdSuccess && isGetCheckoutTabDataByOrderIdData) {

      if (isGetCheckoutTabDataByOrderIdData) {
        if (isGetCheckoutTabDataByOrderIdData?.billingAddress) {
          setShowBilling(true)
          setBillingAddressDetails(isGetCheckoutTabDataByOrderIdData?.billingAddress)
          let setbillingOption = billingAddressList.find((item) => item.value === isGetCheckoutTabDataByOrderIdData.billingAddress.addressId)
          setSelectedBillingOption(setbillingOption)
          getBillingAddressDetailsByAddressId({ addressId: setbillingOption?.value })
          setSelectedBiliingAddressId(setbillingOption?.value)
        }
        setShippingAddressDetails(isGetCheckoutTabDataByOrderIdData?.shippingAddress)

        let setOption = shippingAddressList.find((item) => item.value === isGetCheckoutTabDataByOrderIdData.shippingAddress.addressId)
        setSelectedShippingOption(setOption)
        getShipingAddressDetailsByAddressId({ addressId: setOption?.value })
        setSelectedShippingAddressId(setOption?.value)
        if (isGetCheckoutTabDataByOrderIdData.shippingCharges)
          setFormData({ shippingMethod: isGetCheckoutTabDataByOrderIdData?.shippingMethod, shippingNumber: isGetCheckoutTabDataByOrderIdData?.ownShippingNumber, carrier: isGetCheckoutTabDataByOrderIdData?.ownShippingProvider })
      }
    }
  }, [isGetCheckoutTabDataByOrderIdFetching, isGetCheckoutTabDataByOrderIdSuccess, isGetCheckoutTabDataByOrderIdData])
  

  useEffect(() => {
    if (!isGetItemByOrderIdFetch && isGetItemByOrderIdSuccess && isGetItemByOrderIdData) {
      let transformData=isGetItemByOrderIdData.orderItemList.map((item)=>({
        productName:item.chemicalName,
        price:item.unitPrice,
      }));
      setShoppingCartListData(transformData);
      setShoppingCartItemDetail(isGetItemByOrderIdData)
    }
  }, [isGetItemByOrderIdData, isGetItemByOrderIdSuccess, isGetItemByOrderIdFetch]);

  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });

  const validationrule =
  {
    shippingNumber: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "shippingNumber"
        ),
      },
    ],
    // carrier: [
    //     {
    //         type: "require",
    //         message: Messages.CommonValidationMessages.FieldRequired.replace(
    //             "{0}",
    //             "carrier"
    //         ),
    //     },
    // ],
  }

  const validation = (key, object) => {
    const validRules = { ...validationrule };
    const vaildStates = { ...validState };
    const returnValidState = validate(key, object, validRules, vaildStates);
    setValidState(returnValidState);
  };

  const handleQuantityChange = (index, newQuantity) => {
    setShoppingCartListData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };


  useEffect(() => {

    if (!isGetShippingAddressDetailsByAddressIdFetching && isShippingGetAddressDetailsByAddressIdSuccess && GetShippingAddressDetailsByAddressIdData) {

      setShippingAddressDetails(GetShippingAddressDetailsByAddressIdData);


      const countryId = GetShippingAddressDetailsByAddressIdData.countryId;
      if (countryId) {
        getShippingMethodsById(countryId);
      }
    }
  }, [isGetShippingAddressDetailsByAddressIdFetching, isShippingGetAddressDetailsByAddressIdSuccess, GetShippingAddressDetailsByAddressIdData]);

  useEffect(() => {
    if (!isfetch && isgetShippingMethodsByIdSuccess && isgetShippingMethodsByIdData) {

      const formattedOptions = isgetShippingMethodsByIdData.map(method => ({
        label: `${method.shippingMethodType} $${method.price.toFixed(2)}`,
        value: method.shippingMethodType,
        price: method.price
      }));
      const customOption = {
        label: 'Own Shipping',
        value: 'own_shipping',
      };

      const allOptions = [...formattedOptions, customOption];
      setShippingOptions(allOptions);
    }

  }, [isgetShippingMethodsByIdSuccess, isgetShippingMethodsByIdData, isfetch]);


  useEffect(() => {
    if (!isGetBillingAddressDetailsByAddressIdFetching && isGetBillingAddressDetailsByAddressIdSuccess && GetBillingAddressDetailsByAddressIdData) {
      setBillingAddressDetails(GetBillingAddressDetailsByAddressIdData);
    }
  }, [isGetBillingAddressDetailsByAddressIdFetching, isGetBillingAddressDetailsByAddressIdSuccess, GetBillingAddressDetailsByAddressIdData]);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleCouponClick = () => {
    setShowCoupon(true);
  };

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleShippingDropdownChange = (id) => {
    if (!id) {
      setShippingAddressDetails(null);
      return;
    }
    setSelectedShippingAddressId(id.value);
    getShipingAddressDetailsByAddressId({ addressId: id.value })
  }

  const handleBillingDropdownChange = (id) => {
    if (!id) {
      setBillingAddressDetails(null);
      return;
    }
    setSelectedBiliingAddressId(id.value)
    getBillingAddressDetailsByAddressId({ addressId: id.value })
  }

  const openShippingAddressModal = () => {
    setShippingIsAddressModalOpen(true);
  };

  const closeShippingAddressModal = () => {
    setShippingIsAddressModalOpen(false);
  };

  const openBillinggAddressModal = () => {
    setBillingAddressModalOpen(true);
  };

  const closeBillingAddressModal = () => {
    setBillingAddressModalOpen(false);
  };

  const handleFormChange = (field, option) => {
    setFormData(prev => ({
      ...prev,
      [field]: option
    }));
  };


  const handleNextClick = () => {
    const price = shippingOptions.find(opt => opt.value === formData.shippingMethod)?.price
    if (!selectedShippingAddressId || !formData.shippingMethod) {
      toast("warning", "Please fill all required fields!");
      return;
    }
    if (selectedShippingAddressId && formData.shippingMethod) {

      let OrderItemList = shoppingCartListData.map(
        (data) => ({
          orderItemId: data?.orderItemId || 0,
          orderId: orderId || 0,
          catalogId: data?.catalogId,
          casNumber: data?.casNo,
          mdlNumber: data?.mdlNo,
          chemicalName: data?.productName,
          quantity: data?.quantity,
          packSize: data?.packSize,
          unitid: data?.sizeId,
          unitPrice: data?.price
        })
      );
      const payload = {
        orderId: orderId || 0,
        billingAddressId: showBilling ? billingAddressDetails?.addressId : shippingAddressDetails?.addressId,
        shippingAddressId: shippingAddressDetails?.addressId || selectedShippingAddressId,
        shippingMethod: formData.shippingMethod?.value ?? null,
        shippingCharges: formData.shippingMethod?.price ?? 0,
        ownShippingProvider: formData.shippingMethod?.value === 'own_shipping' ? formData.carrier : "",
        ownShippingNumber: formData.shippingMethod?.value === 'own_shipping' ? formData.shippingNumber : "",
        handlingCharges: formData.shippingMethod?.value === 'own_shipping' ? 10.00 : 0,
        OrderItemList,
      };
      addEditOrderAddress(payload);
    }
  };

  useEffect(() => {
    if (isaddEditOrderAddressSuccess && addEditOrderAddressData) {
      const orderId = parseInt(addEditOrderAddressData.keyValue);
      setOrderId(orderId);
      markTabAsCompleted(currentTabIndex);
      setActiveTab(prevTab => {
        const nextTab = prevTab + 1;
        return nextTab < tabs.length ? nextTab : prevTab;
      });
    }
  }, [isaddEditOrderAddressSuccess, addEditOrderAddressData]);


  const handleBack = () => {
    setActiveTab(prev => Math.max(prev - 1, 0));
  }

  const total = shoppingCartListData
    .reduce((sum, product) => sum + product.price * product.quantity, 0);

  const totalPrice = useMemo(() => {
    const orderAmount = parseFloat(total);
    return (orderAmount).toFixed(2);

    //return (orderAmount + shippingCharges + handlingCharges - discount).toFixed(2);
  }, [total]);

  const getSelectedOption = (list, value) => list.find(item => item.value === value) || null;

  return (
    <>
      <div className="checkout-container">
        <div className="title-desc-top">
          <div className="left-title-sec">
            <h2 className="page-title">Checkout</h2>
            <p className="desc">
              Please enter or select your address details and shipping methods.
            </p>
          </div>
          <div className="right-title-sec">
            <p className="desc-one">
              Returning customer? <span onClick={handleLoginClick}>Login</span>
            </p>
            <p className="desc-two">
              Have a coupon?{" "}
              <span onClick={handleCouponClick}>Enter your code</span>
            </p>
          </div>
        </div>

        <div className={`coupon-section ${showCoupon ? "active" : ""}`}>
          <p className="coupon-section_title">If you have a coupon code, please apply it below.</p>
          <div className="input-btn">
            <Input
              type="text"
              cssClass="signup-form__box__form_input"
              placeholder="Coupon Code"
            />
            <Button variant="contained" color="tertiary">
              Apply coupon
            </Button>
          </div>
          <div className="close-btn">
            <Iconify icon="mdi:close" onClick={() => setShowCoupon(false)} />
          </div>
        </div>

        <div className="form-details">
          <div className="form-left">
            <div className="form-main-sec">
              <h3 className="title">
                <span className="title-txt">Shipping detailsssss</span>
                <span className="optional">
                  <Select
                    options={shippingAddressList}
                    placeholder="Select Address"
                    value={selectedShippingOption}
                    onChange={handleShippingDropdownChange}

                  />
                  <Button variant="contained" color="secondary" onClick={openShippingAddressModal}>
                    Add
                  </Button>
                </span>
              </h3>
              <div className="form-sec">
                <div className="half-form">
                  <div className="input-field">
                    <Label label="Address Name" isRequired={true} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.addressName || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="Attend To" isRequired={true} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.attendantName || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="Address Line 1" isRequired={true} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.addressLine1 || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="Address Line 2" isRequired={false} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.addressLine2 || ""} isdisable={true} />
                  </div>
                </div>
                <div className="four-c-form">
                  <div className="input-field">
                    <Label label="Country" isRequired={true} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.countryName || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="State" isRequired={true} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.stateName || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="Town / City" isRequired={false} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.cityName || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="Postcode / ZIP" isRequired={true} />
                    <Input type="text" placeholder="Address Name" name="name" value={shippingAddressDetails?.zipCode || ""} isdisable={true} />
                  </div>
                </div>
                <div className="three-c-form">
                  <div className="input-field">
                    <Label label="Phone No" isRequired={true} />
                    <Input type="text" placeholder="Phone No" name="phoneNo" value={shippingAddressDetails?.attendantPhoneNo || ""} isdisable={true} />
                  </div>
                  <div className="input-field">
                    <Label label="Email" isRequired={false} />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      name="emailAddress"
                      isdisable={true}
                    />
                  </div>
                  <div className="input-field">
                    <Label label="Fax" isRequired={false} />
                    <Input type="text" placeholder="Fax" name="fax" value={shippingAddressDetails?.fax || ""} isdisable={true} />
                  </div>
                </div>
                <div className="half-form">
                  <div className="input-field">
                    <Label label="Shipping Detailssss" isRequired={false} />
                    <Select
                      options={shippingOptions}
                      placeholder="Shipping Detailssss"
                      value={getSelectedOption(shippingOptions, formData.shippingMethod)}
                      // value={formData.shippingMethod}
                      onChange={(option) => handleFormChange('shippingMethod', option)}
                    />
                    <div className="input-field">
                      <Label
                        label="Shipping preferred shipping option. Charges depends on the delivery location."
                        isRequired={true}
                      />
                    </div>
                    {formData.shippingMethod?.value === 'own_shipping' && (
                      <>
                        <div className="input-field">
                          <Label label="Shipping Number" isRequired={true} />
                          <Input
                            type="text"
                            placeholder="Shipping Number"
                            value={formData.shippingNumber}
                            onChange={(e) => handleFormChange('shippingNumber', e.target.value)}
                            onBlur={() => validation("shippingNumber", formData)}
                          />
                          <ValidationText errorText={validState.error.shippingNumber} />
                        </div>

                        <div className="input-field">
                          <Label label="Carrier" isRequired={true} />
                          <Select
                            options={carrierOptions}
                            placeholder="Select Carrier"
                            value={getSelectedOption(shippingOptions, formData.carrier)}
                            // value={formData.carrier}
                            onChange={(option) => handleFormChange('carrier', option)}
                          //onBlur={() => validation("carrier", formData)}
                          />
                          {/* <ValidationText errorText={validState.error.carrier} /> */}
                        </div>
                      </>
                    )}
                  </div>
                  {/* <div className="full-form gap-o">
                    <div className="input-field">
                      <Label
                        label="Shipping preferred shipping option. Charges depends on the delivery location."
                        isRequired={true}
                      />
                    </div>
                    <div className="half-form">
                      <div className="input-field">
                        <Select
                          options={SippingSelect}
                          placeholder="Select Address"
                        // value={formData.countryId}
                        // onChange={handleDropdownChange}
                        />
                      </div>
                      <div className="input-field">
                        <Input
                          type="text"
                          placeholder="Enter Shipping No."
                          name="phoneNo"
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="full-form">
                  <div className="input-field checkbox-field">
                    <Checkbox label="Create an account?" color="primary" />
                  </div>
                  <div className="input-field checkbox-field">
                    <Checkbox
                      label="Bill to a different address?"
                      color="primary"
                      checked={showBilling}

                      // onChange={(checked) => setShowBilling(checked)}
                      onChange={(checked) => {
                        setShowBilling(checked);
                        if (!checked) {
                          setBillingAddressDetails(null);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {showBilling && (
              <div className="form-main-sec billing-sec">
                <h3 className="title">
                  <span className="title-txt">Billing details</span>
                  <span className="optional">
                    <Select
                      options={billingAddressList}
                      placeholder="Select Address"
                      value={selectedBillingOption}
                      onChange={handleBillingDropdownChange}
                    />
                    <Button variant="contained" color="secondary" onClick={openBillinggAddressModal}>
                      Add
                    </Button>
                  </span>
                </h3>
                <div className="form-sec">
                  <div className="half-form">
                    <div className="input-field">
                      <Label label="Address Name" isRequired={true} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.addressName || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="Attend To" isRequired={true} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.attendantName || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="Address Line 1" isRequired={true} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.addressLine1 || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="Address Line 2" isRequired={false} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.addressLine2 || ""} isdisable={true} />
                    </div>
                  </div>
                  <div className="four-c-form">
                    <div className="input-field">
                      <Label label="Country" isRequired={true} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.countryName || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="State" isRequired={true} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.stateName || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="Town / City" isRequired={false} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.cityName || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="Postcode / ZIP" isRequired={true} />
                      <Input type="text" placeholder="Address Name" name="name" value={billingAddressDetails?.zipCode || ""} isdisable={true} />
                    </div>
                  </div>
                  <div className="three-c-form">
                    <div className="input-field">
                      <Label label="Phone No" type="number" isRequired={true} />
                      <Input type="text" placeholder="Phone No" name="phoneNo" value={billingAddressDetails?.attendantPhoneNo || ""} isdisable={true} />
                    </div>
                    <div className="input-field">
                      <Label label="Email" isRequired={false} />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        name="emailAddress"
                        isdisable={true}
                      />
                    </div>
                    <div className="input-field">
                      <Label label="Fax" isRequired={false} />
                      <Input type="text" placeholder="Fax" name="fax" value={billingAddressDetails?.fax || ""} isdisable={true} />
                    </div>
                  </div>
                </div>
                <div className="full-form">
                  <div className="input-field">
                    <Label label="Order notes (optional)" isRequired={false} />
                    <Textarea
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      name="message"
                      disabled={true}
                    // value={formData.message}
                    // onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="order-summary">
            <div className="order-info">
              <div className="order-form-title">Your order</div>
              <div className="order-heading">
                <span className="heading-txt">Product</span>
              </div>
              <div className="order-list-all">
                {shoppingCartListData.map((product, index) => {
                  const { imageSrc, title } = product;

                  return (
                    <div className="product-list" key={index}>
                      {/* <div className="delete-icon">
                        <Iconify icon="mingcute:close-fill" />
                      </div> */}
                      {imageSrc && !imgErrors[index] ? (
                        <div className="product-list_image">
                          <Image
                            src={imageSrc}
                            alt="product-image"
                            width={0}
                            height={0}
                            onError={() => handleImageError(index)}
                          />
                        </div>
                      ) : (
                        <div className="product_image">
                          <Image
                            src={AppIcons.ProductDetailCardPlaceholder}
                            alt="product_image"
                            width={0}
                            height={0}
                          />
                        </div>
                      )}
                      <div className="product_details">
                        <div className="product_details_title">
                          <div className="title-name">{product?.productName}</div>
                        </div>
                        <div className="product_details_info">
                          <div className="product_quantity">
                            <Counter counts={product?.quantity}
                              onChange={(newQuantity) => handleQuantityChange(index, newQuantity)} />
                          </div>
                          <div className="product_price">
                            <div className="price-value">${(product?.price)?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="order-heading bottom">
                <span className="heading-txt">Order Total</span>
                <span className="heading-total">${orderId? shoppingCartItemDetail?.subTotalPrice?.toFixed(2): total?.toFixed(2)  }</span>
              </div>
              {formData.shippingMethod?.value !== "own_shipping" &&
                <div className="order-heading bottom">
                  <span className="heading-txt">Shipping Charges</span>
                  <span className="heading-total">{formData.shippingMethod?.price !== undefined
                    ? `$${formData.shippingMethod.price?.toFixed(2)}`
                    : isGetCheckoutTabDataByOrderIdData?.shippingCharges
                      ? `$${isGetCheckoutTabDataByOrderIdData.shippingCharges?.toFixed(2)}`
                      : " - "} </span>
                </div>
              }
              {formData.shippingMethod?.value === "own_shipping" &&

                <div className="order-heading bottom">
                  <span className="heading-txt">Handling charges</span>
                  <span className="heading-total">$10.00</span>
                </div>
              }
              {/* <div className="order-heading bottom">
                <span className="heading-txt">Discount</span>
                <span className="heading-total">$558.0</span>
              </div> */}
              <div className="total-price">
                <span>Total</span>
                <span>${orderId ? shoppingCartItemDetail?.orderPrice.toFixed(2) : totalPrice}</span>
              </div>
              <div className="bottom-btns">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon="ph:arrow-left-bold"
                  onClick={handleBack}
                >
                  Back to Cart
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon="ph:arrow-right-bold"
                  onClick={handleNextClick}
                  loading={isaddEditOrderAddressLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <CenterModal
          isOpen={isShiipingAddressModalOpen || isBillingAddressModalOpen}
          onClose={isShiipingAddressModalOpen ? closeShippingAddressModal : closeBillingAddressModal}
          modalTitle={isShiipingAddressModalOpen ? "Shipping Address" : "Billing Address"}
          transition="grow"
          transitionDirection="fromBottom"
          modalSize="w-50"
        >
          <AddAddress
            onClose={isShiipingAddressModalOpen ? closeShippingAddressModal : closeBillingAddressModal}
            addressTypeId={isShiipingAddressModalOpen ? AddressType.SHIPPING : AddressType.BILLING} getShippingAddresses={getShippingAddresses}
          />
        </CenterModal>
      </div>
    </>
  );
};

export default Checkout;
