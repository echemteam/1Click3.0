import Button from "@components/ui/button/Button";
import CenterModal from "@components/ui/centerModal/CenterModal";
import Input from "@components/ui/input/Input";
import Label from "@components/ui/label/Label";
import Select from "@components/ui/select/Select";
import Textarea from "@components/ui/textarea/Textarea";
import { TabContext } from "@features/context/TabContext";
import OrderContext from "@features/contextAPIs/OrderContext";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAddEditOrderAddressMutation, useLazyGetCheckoutTabDataByOrderIdQuery, useLazyGetItemByOrderIdQuery } from "src/redux/serviceApi/OrderAPI";
import { useLazyGetShippingMethodsByIdQuery } from "src/redux/serviceApi/ShippingAPI";
import { useLazyGetAddressDetailsByAddressIdQuery, useLazyGetUserAddressByIdQuery } from "src/redux/serviceApi/addressAPI";
import SwalAlert from "src/services/swal/SwalService";
import AddAddress from "./AddAddress";
import Iconify from "@components/ui/iconify/Iconify";
import Checkbox from "@components/ui/checkbox/Checkbox";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import { AddressType, carrierOptions } from "@components/Common/Enum/CommonEnum";
import ValidationText from "@components/Common/validation/validationText";
import { Messages } from "@utils/Messages/Messages";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import AddEditAddress from "@features/myAccount/components/addresses/components/addEditAddress/AddEditAddress";
import "./Checkout.scss"
 
const CheckoutMain = () => {
 
  const currentTabIndex = 1;
  const { toast } = SwalAlert();
  const { setActiveTab, markTabAsCompleted, tabs } = useContext(TabContext);
  const { orderId, setOrderId, shoppingCartListData, setShoppingCartListData } = useContext(OrderContext);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [shippingAddressList, setShippingAddressList] = useState([]);
  const [billingAddressList, setBillingAddressList] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isShiipingAddressModalOpen, setShippingIsAddressModalOpen] = useState(false);
  const [isBillingAddressModalOpen, setBillingAddressModalOpen] = useState(false);
  const [shoppingCartItemDetail, setShoppingCartItemDetail] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });
  const [formData, setFormData] = useState({
    shippingAddress: null,
    billingAddress: null,
    selectedShippingAddress: null,
    selectedBillingAddress: null,
    shippingMethod: null,
    shippingNumber: null,
    shippingCharges: null,
    carrier: null,
    handlingCharges: 10.00
  });
 
  const [getShippingAddresses, { data: shippingData, isSuccess: isShippingSuccess, isFetching: isShippingFetching }] = useLazyGetUserAddressByIdQuery();
  const [getBillingAddresses, { data: billingData, isSuccess: isBillingSuccess, isFetching: isBillingFetching }] = useLazyGetUserAddressByIdQuery();
  const [getShipingAddressDetailsByAddressId, { data: GetShippingAddressDetailsByAddressIdData, isSuccess: isShippingGetAddressDetailsByAddressIdSuccess, isFetching: isGetShippingAddressDetailsByAddressIdFetching }] = useLazyGetAddressDetailsByAddressIdQuery();
  const [getBillingAddressDetailsByAddressId, { data: GetBillingAddressDetailsByAddressIdData, isSuccess: isGetBillingAddressDetailsByAddressIdSuccess, isFetching: isGetBillingAddressDetailsByAddressIdFetching }] = useLazyGetAddressDetailsByAddressIdQuery();
  const [getShippingMethodsById, { isFetching: isfetch, data: isgetShippingMethodsByIdData, isSuccess: isgetShippingMethodsByIdSuccess },] = useLazyGetShippingMethodsByIdQuery();
  const [addEditOrderAddress, { isLoading: isaddEditOrderAddressLoading, isSuccess: isaddEditOrderAddressSuccess, data: addEditOrderAddressData }] = useAddEditOrderAddressMutation();
  const [getCheckoutTabDataByOrderId, { isFetching: isGetCheckoutTabDataByOrderIdFetching, data: isGetCheckoutTabDataByOrderIdData, isSuccess: isGetCheckoutTabDataByOrderIdSuccess },] = useLazyGetCheckoutTabDataByOrderIdQuery();
  const [getItemByOrderId, { isFetching: isGetItemByOrderIdFetch, isSuccess: isGetItemByOrderIdSuccess, data: isGetItemByOrderIdData }] = useLazyGetItemByOrderIdQuery();
 
  const validationrule = {
    shippingNumber: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "shipping number"
        ),
      },
    ],
    shippingMethod: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "shipping method"
        ),
      },
    ],
    carrier: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "carrier"
        ),
      },
    ],
    selectedBillingAddress: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "selected billing address"
        ),
      },
    ],
  }
  useEffect(() => {
    getShippingAddresses({ AddressTypeId: AddressType.SHIPPING });
    getBillingAddresses({ AddressTypeId: AddressType.BILLING });
  }, []);
  useEffect(() => {
    if (orderId > 0 || !isBillingAddressModalOpen) {
      getShippingAddresses({ AddressTypeId: AddressType.SHIPPING });
      getBillingAddresses({ AddressTypeId: AddressType.BILLING });
    }
  }, [orderId, getShippingAddresses, getBillingAddresses])
  useEffect(() => {
    if (!isShippingFetching && isShippingSuccess && shippingData) {
      let transformedShipping = shippingData.map((item) => ({
        value: item.addressId,
        label: item.addressName,
        isDefault: item.isDefault,
      }));
      setShippingAddressList(transformedShipping);
 
      if (!orderId) {
        const defaultAddress = transformedShipping.find(item => item.isDefault === true);
        if (transformedShipping.length > 0 && defaultAddress ) {
          setFormData(prev => ({
            ...prev,
            selectedShippingAddress: defaultAddress.value,
          }));
 
          getShipingAddressDetailsByAddressId({ addressId: defaultAddress.value });
        }
      }
    }
  }, [isShippingFetching, isShippingSuccess, shippingData]);
  useEffect(() => {
    if (!isBillingFetching && isBillingSuccess && billingData) {
      let transformedBilling = billingData.map((item) => ({
        value: item.addressId,
        label: item.addressName,
        isDefault: item.isDefault
      }));
      setBillingAddressList(transformedBilling);
      if (!orderId) {
        const defaultAddress = transformedBilling.find(item => item.isDefault === true);
        if (transformedBilling.length > 0 && defaultAddress ) {
         
          setFormData(prev => ({
            ...prev,
            selectedBillingAddress: defaultAddress.value,
          }));
 
          getBillingAddressDetailsByAddressId({ addressId: defaultAddress.value });
        }
      }
    }
  }, [isBillingFetching, isBillingSuccess, billingData]);
  useEffect(() => {
 
    if (orderId > 0) {
      getCheckoutTabDataByOrderId(orderId)
      getItemByOrderId(orderId)
    }
  }, [orderId])
  useEffect(() => {
    if (!isGetCheckoutTabDataByOrderIdFetching && isGetCheckoutTabDataByOrderIdSuccess && isGetCheckoutTabDataByOrderIdData && billingAddressList.length > 0 && shippingAddressList.length > 0) {
      if (isGetCheckoutTabDataByOrderIdData) {
        if (isGetCheckoutTabDataByOrderIdData?.billingAddressId != isGetCheckoutTabDataByOrderIdData.shippingAddressId) {
          setShowBilling(true)
          let setbillingOption = billingAddressList.find((item) => item.value === isGetCheckoutTabDataByOrderIdData.billingAddress.addressId)
          setFormData(prev => ({
            ...prev,
            billingAddress: isGetCheckoutTabDataByOrderIdData?.billingAddress,
            selectedBillingAddress: setbillingOption?.value
          }));
          getBillingAddressDetailsByAddressId({ addressId: setbillingOption?.value })
 
        }
 
        let setOption = shippingAddressList.find((item) => item.value === isGetCheckoutTabDataByOrderIdData.shippingAddress.addressId)
 
        setFormData(prev => ({
          ...prev,
          shippingAddress: isGetCheckoutTabDataByOrderIdData?.shippingAddress,
          selectedShippingAddress: setOption?.value,
          shippingMethod: isGetCheckoutTabDataByOrderIdData?.shippingMethod,
          shippingNumber: isGetCheckoutTabDataByOrderIdData?.ownShippingNumber,
          carrier: isGetCheckoutTabDataByOrderIdData?.ownShippingProvider
 
        }));
        getShipingAddressDetailsByAddressId({ addressId: setOption?.value })
      }
 
    }
  }, [isGetCheckoutTabDataByOrderIdFetching, isGetCheckoutTabDataByOrderIdSuccess, isGetCheckoutTabDataByOrderIdData, shippingAddressList, billingAddressList])
  useEffect(() => {
 
    if (!isGetShippingAddressDetailsByAddressIdFetching && isShippingGetAddressDetailsByAddressIdSuccess && GetShippingAddressDetailsByAddressIdData) {


 {
      setFormData(prev => ({
        ...prev,
        shippingAddress: GetShippingAddressDetailsByAddressIdData,
      }));
    }
      const countryId = GetShippingAddressDetailsByAddressIdData.countryId;
      if (countryId) {
        getShippingMethodsById(countryId);
      }
    }
  }, [isGetShippingAddressDetailsByAddressIdFetching, isShippingGetAddressDetailsByAddressIdSuccess, GetShippingAddressDetailsByAddressIdData]);
  useEffect(() => {
    if (!isGetBillingAddressDetailsByAddressIdFetching && isGetBillingAddressDetailsByAddressIdSuccess && GetBillingAddressDetailsByAddressIdData) {
      setFormData(prev => ({
        ...prev,
        billingAddress: GetBillingAddressDetailsByAddressIdData,
      }));
    }
  }, [isGetBillingAddressDetailsByAddressIdFetching, isGetBillingAddressDetailsByAddressIdSuccess, GetBillingAddressDetailsByAddressIdData]);
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
        price: 0
      };
      const allOptions = [...formattedOptions, customOption];
      const filterdata = allOptions?.find(data => data?.price === isGetItemByOrderIdData?.shippingCharges)
      setFormData(prev => ({
        ...prev,
        shippingMethod: filterdata?.value ?? allOptions[0]?.value,
        shippingCharges: isGetItemByOrderIdData?.shippingCharges ?? allOptions[0]?.price,
      }));
      setShippingOptions(allOptions);
    }
  }, [isgetShippingMethodsByIdSuccess, isgetShippingMethodsByIdData, isfetch])
 
  const handleLoginClick = () => {
    router.push("/login");
  };
  const handleCouponClick = () => {
    setShowCoupon(true);
  };
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
  const total = shoppingCartListData.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const totalPrice = useMemo(() => {
    let extraCharge = 0;
 
    if (formData?.shippingMethod === "own_shipping") {
      extraCharge = parseFloat(formData?.handlingCharges ?? 0);
    } else {
      extraCharge = parseFloat(formData?.shippingCharges ?? 0);
    }
    const orderAmount = parseFloat(total) + extraCharge;
    return orderAmount.toFixed(2);
  }, [total, formData?.shippingCharges, formData?.handlingCharges, formData?.shippingMethod, shoppingCartListData]);
 
  const handleBack = () => {
    setActiveTab(prev => Math.max(prev - 1, 0));
  }
  const handleAddressChange = (option, type) => {
    if (!option) {
      if (type === "shippingMethod") {
        setFormData(prev => ({
          ...prev,
          shippingCharges: 0,
          shippingMethod: null,
        }));
      } else if (type === "shipping") {
        setFormData(prev => ({
          ...prev,
          shippingAddress: null,
          selectedShippingAddress: null,
        }));
      } else if (type === "billing") {
        setFormData(prev => ({
          ...prev,
          billingAddress: null,
          selectedBillingAddress: null,
        }));
      }
      return;
    }
 
    if (type === "shipping") {
      setFormData(prev => ({
        ...prev,
        selectedShippingAddress: option.value,
      }));
      getShipingAddressDetailsByAddressId({ addressId: option.value });
    } else if (type === "billing") {
      setFormData(prev => ({
        ...prev,
        selectedBillingAddress: option.value,
      }));
      getBillingAddressDetailsByAddressId({ addressId: option.value });
    } else if (type === "shippingMethod") {
      setFormData(prev => ({
        ...prev,
        shippingMethod: option.value,
        shippingCharges: option.price,
        shippingNumber: option.value !== 'own_shipping' ? null : formData?.shippingNumber,
        carrier: option.value !== 'own_shipping' ? null : formData?.carrier,
      }));
    }
  };
  useEffect(() => {
    if (!isGetItemByOrderIdFetch && isGetItemByOrderIdSuccess && isGetItemByOrderIdData) {
 
      let transformData = isGetItemByOrderIdData.orderItemList.map((item) => ({
        ...item,
        productName: item.chemicalName,
        price: item.unitPrice,
      }));
      setShoppingCartListData(transformData);
      setShoppingCartItemDetail(isGetItemByOrderIdData)
    }
  }, [isGetItemByOrderIdData, isGetItemByOrderIdSuccess, isGetItemByOrderIdFetch]);
 
  const handleFormChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };
  const isValid = () => {
    const isValidState = isValidForm(formData, validationrule, validState);
    if (formData?.shippingMethod !== 'own_shipping') {
      delete isValidState.error.carrier;
      delete isValidState.error.shippingNumber;
    }
    if (!showBilling) {
      delete isValidState.error.selectedBillingAddress;
    }
    isValidState.isValid = Object.keys(isValidState.error).length === 0;
    setValidState(isValidState);
    return isValidState.isValid;
  };
  const handleNextClick = () => {
    if (isValid()) {
      if (!formData.selectedShippingAddress || !formData.shippingMethod) {
        toast("warning", "Please fill all required fields!");
        return;
      }
      if (formData.selectedShippingAddress && formData.shippingMethod) {
 
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
          billingAddressId: showBilling ? formData?.selectedBillingAddress : formData?.selectedShippingAddress,
          shippingAddressId: formData?.selectedShippingAddress,
          shippingMethod: formData?.shippingMethod ?? null,
          shippingCharges: formData?.shippingCharges || 0,
          ownShippingProvider: formData?.shippingMethod === 'own_shipping' ? formData?.carrier : "",
          ownShippingNumber: formData?.shippingMethod === 'own_shipping' ? formData?.shippingNumber : "",
          handlingCharges: formData?.shippingMethod === 'own_shipping' ? 10.00 : 0,
          OrderItemList,
        };
        addEditOrderAddress(payload);
      }
    }
  };
  const handleSave = () => {
    setEditingAddress(null);
    setShippingIsAddressModalOpen(false);
    setBillingAddressModalOpen(false);
  };
 
 
  // const handleQuantityChange = (index, newQuantity) => {
  //   setShoppingCartListData((prevData) =>
  //     prevData.map((item, i) =>
  //       i === index ? { ...item, quantity: newQuantity } : item
  //     )
  //   );
  // };
 
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
 
  const validation = (key, object) => {
    const validRules = { ...validationrule };
    const vaildStates = { ...validState };
    const returnValidState = validate(key, object, validRules, vaildStates);
    setValidState(returnValidState);
  };
  return (<div className="checkout-container">
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
            <span className="title-txt">Shipping details</span>
            <span className="optional">
              <Select options={shippingAddressList}
                placeholder="Select Address" value={formData?.selectedShippingAddress}
                onChange={(option) => handleAddressChange(option, "shipping")} />
              <Button variant="contained" color="secondary" onClick={openShippingAddressModal}>
                Add
              </Button>
            </span>
          </h3>
          <div className="form-sec">
            <div className="half-form">
              <div className="input-field">
                <Label label="Address Name" isRequired={true} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.addressName || ""} isdisable={true} />
              </div>
              <div className="input-field">
                <Label label="Attend To" isRequired={true} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.attendantName || ""} isdisable={true} />
              </div>
              <div className="input-field">
                <Label label="Address Line 1" isRequired={true} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.addressLine1 || ""} isdisable={true} />
              </div>
              <div className="input-field">
                <Label label="Address Line 2" isRequired={false} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.addressLine2 || ""} isdisable={true} />
              </div>
            </div>
            <div className="four-c-form">
              <div className="input-field">
                <Label label="Country" isRequired={true} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.countryName || ""} isdisable={true} />
              </div>
              <div className="input-field">
                <Label label="State" isRequired={true} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.stateName || ""} isdisable={true} />
              </div>
              <div className="input-field">
                <Label label="Town / City" isRequired={false} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.cityName || ""} isdisable={true} />
              </div>
              <div className="input-field">
                <Label label="Postcode / ZIP" isRequired={true} />
                <Input type="text" placeholder="Address Name" name="name" value={formData?.shippingAddress?.zipCode || ""} isdisable={true} />
              </div>
            </div>
            <div className="three-c-form">
              <div className="input-field">
                <Label label="Phone No" isRequired={true} />
                <Input type="text" placeholder="Phone No" name="phoneNo" value={formData?.shippingAddress?.attendantPhoneNo || ""} isdisable={true} />
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
                <Input type="text" placeholder="Fax" name="fax" value={formData?.shippingAddress?.fax || ""} isdisable={true} />
              </div>
            </div>
            <div className="half-form">
              <div className="input-field">
                <Label label="Shipping Details" isRequired={true} />
                <Select
                  options={shippingOptions}
                  placeholder="Shipping Details"
                  value={formData?.shippingMethod}
                  onChange={(option) => handleAddressChange(option, 'shippingMethod')}
                  onBlur={() => validation("shippingMethod", formData)}
                />
                <ValidationText errorText={validState.error.shippingMethod} />
                <div className="input-field">
                  <Label label="Shipping preferred shipping option. Charges depends on the delivery location." isRequired={true} />
                </div>
              </div>
              <div className="half-form">
                {formData?.shippingMethod === 'own_shipping' && (
                  <>
                    <div className="input-field">
                      <Label label="Shipping Number" isRequired={true} />
                      <Input type="text" placeholder="Shipping Number" value={formData?.shippingNumber}
                        onChange={(e) => handleFormChange('shippingNumber', e.target.value)}
                        onBlur={() => validation("shippingNumber", formData)} />
                      <ValidationText errorText={validState.error.shippingNumber} />
                    </div>
                    <div className="input-field">
                      <Label label="Carrier" isRequired={true} />
                      <Select options={carrierOptions}
                        placeholder="Select Carrier" value={formData?.carrier}
                        onChange={(option) => handleFormChange('carrier', option?.value ?? "")}
                        onBlur={() => validation("carrier", formData)} />
                      <ValidationText errorText={validState.error.carrier} />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="full-form">
              <div className="input-field checkbox-field d-inline-flex">
                <Checkbox label="Create an account?" color="primary" />
              </div>
              <div className="input-field checkbox-field d-inline-flex">
                <Checkbox
                  label="Bill to a different address?"
                  color="primary"
                  checked={showBilling}
                  onChange={(checked) => {
                    setShowBilling(checked);
                    if (!checked) {
                      setFormData(prev => ({
                        ...prev,
                        billingAddress: null,
                      }));
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
                <Select options={billingAddressList}
                  placeholder="Select Address" value={formData?.selectedBillingAddress}
                  onChange={(option) => handleAddressChange(option, "billing")}
                  onBlur={() => validation("selectedBillingAddress", formData)} />
                <ValidationText errorText={validState.error.selectedBillingAddress} />
                <Button variant="contained" color="secondary" onClick={openBillinggAddressModal} >
                  Add
                </Button>
              </span>
            </h3>
            <div className="form-sec">
              <div className="half-form">
                <div className="input-field">
                  <Label label="Address Name" isRequired={true} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.addressName || ""} isdisable={true} />
                </div>
                <div className="input-field">
                  <Label label="Attend To" isRequired={true} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.attendantName || ""} isdisable={true} />
                </div>
                <div className="input-field">
                  <Label label="Address Line 1" isRequired={true} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.addressLine1 || ""} isdisable={true} />
                </div>
                <div className="input-field">
                  <Label label="Address Line 2" isRequired={false} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.addressLine2 || ""} isdisable={true} />
                </div>
              </div>
              <div className="four-c-form">
                <div className="input-field">
                  <Label label="Country" isRequired={true} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.countryName || ""} isdisable={true} />
                </div>
                <div className="input-field">
                  <Label label="State" isRequired={true} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.stateName || ""} isdisable={true} />
                </div>
                <div className="input-field">
                  <Label label="Town / City" isRequired={false} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.cityName || ""} isdisable={true} />
                </div>
                <div className="input-field">
                  <Label label="Postcode / ZIP" isRequired={true} />
                  <Input type="text" placeholder="Address Name" name="name" value={formData?.billingAddress?.zipCode || ""} isdisable={true} />
                </div>
              </div>
              <div className="three-c-form">
                <div className="input-field">
                  <Label label="Phone No" type="number" isRequired={true} />
                  <Input type="text" placeholder="Phone No" name="phoneNo" value={formData?.billingAddress?.attendantPhoneNo || ""} isdisable={true} />
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
                  <Input type="text" placeholder="Fax" name="fax" value={formData?.billingAddress?.fax || ""} isdisable={true} />
                </div>
              </div>
            </div>
            <div className="full-form">
              <div className="input-field">
                <Label label="Order notes (optional)" isRequired={false} />
                <Textarea
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  name="message"
                  disabled={true}
                  value={formData?.message}
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
              const { imageSrc } = product;
              return (
                <div className="product-list" key={index}>
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
                        <span>{`${product.quantity} X ${product.packSize} ${product.size}`}</span>
                        {/* <Counter counts={product?.quantity} disabled={true}
                          onChange={(newQuantity) => handleQuantityChange(index, newQuantity)} /> */}
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
            <span className="heading-total">${shoppingCartItemDetail?.subtotalPrice || total?.toFixed(2)}</span>
          </div>
          {formData?.shippingMethod !== "own_shipping" && formData?.shippingMethod !== null &&
            <div className="order-heading bottom">
              <span className="heading-txt">Shipping Charges</span>
              <span className="heading-total">${formData?.shippingCharges?.toFixed(2) || shoppingCartItemDetail?.shippingCharges?.toFixed(2)}
              </span>
            </div>
          }
          {formData?.shippingMethod === "own_shipping" &&
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
            <span>${shoppingCartItemDetail?.orderPrice || totalPrice}</span>
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
 
    <CenterModal isOpen={isShiipingAddressModalOpen || isBillingAddressModalOpen}
      onClose={isShiipingAddressModalOpen ? closeShippingAddressModal : closeBillingAddressModal}
      modalTitle={isShiipingAddressModalOpen ? "Shipping Address" : "Billing Address"}
      transition="grow" transitionDirection="fromBottom" modalSize="w-50">
      <AddEditAddress
            onCancel={isShiipingAddressModalOpen ? closeShippingAddressModal : closeBillingAddressModal}
            //addressTypeId={isShiipingAddressModalOpen ? AddressType.SHIPPING : AddressType.BILLING} getShippingAddresses={getShippingAddresses}
            onSave={handleSave}
            editingAddress={editingAddress}
          />
    </CenterModal>
  </div>)
}
 
export default CheckoutMain;
 