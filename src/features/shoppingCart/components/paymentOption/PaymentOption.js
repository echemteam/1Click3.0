import React, { useContext, useEffect, useState } from "react";
import "./PaymentOption.scss";
import RadioButton from "@components/ui/radioButton/RadioButton";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Image from "next/image";
import Iconify from "@components/ui/iconify/Iconify";
import Button from "@components/ui/button/Button";
import { useAddEditPaymentOptionMutation } from "src/redux/serviceApi/paymentAPI";
import { useLazyGetItemByOrderIdQuery, useLazyGetPaymentOptionbyOrderIdQuery, usePlaceOrderMutation } from "src/redux/serviceApi/OrderAPI";
import OrderContext from "@features/contextAPIs/OrderContext";
import { TabContext } from "@features/context/TabContext";
import SwalAlert from "src/services/swal/SwalService";

const PaymentOption = () => {
  const {toast} = SwalAlert();
  const { orderId ,setOrderId} = useContext(OrderContext);
  const currentTabIndex = 3;
  const { setActiveTab, tabs, markTabAsCompleted } = useContext(TabContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [OrderitemData, setOrderitemData] = useState([]);
  const [getPaymentOptionbyOrderId, { isLoading: isGetPaymentOptionbyOrderIdLoading, isSuccess: isGetPaymentOptionbyOrderIdSuccess, data: GetPaymentOptionbyOrderIdData }] = useLazyGetPaymentOptionbyOrderIdQuery();
  const [addEditPaymentOption, { isSuccess: isAddEditPaymentOptionSuccess, data: isAddEditPaymentOptionData }] = useAddEditPaymentOptionMutation();
  const [getItemByOrderId, { isFetching: isGetItemByOrderIdFetch, isSuccess: isGetItemByOrderIdSuccess, data: isGetItemByOrderIdData }] = useLazyGetItemByOrderIdQuery();
  const [placeOrder, { isLoading: isPlaceOrderLoading, isSuccess: isPlaceOrderSuccess, data: isPlaceOrderData }] = usePlaceOrderMutation();

  useEffect(() => {
    if (orderId > 0) {
      getPaymentOptionbyOrderId(orderId);
    }
  }, []);

  useEffect(()=>{
    if (orderId > 0) {
    getItemByOrderId(orderId);
  }
}, []);


  useEffect(() => {
    if (!isGetPaymentOptionbyOrderIdLoading && GetPaymentOptionbyOrderIdData && isGetPaymentOptionbyOrderIdSuccess) {
      setSelectedOption(GetPaymentOptionbyOrderIdData.paymentType);
    }
  }, [isGetPaymentOptionbyOrderIdSuccess, GetPaymentOptionbyOrderIdData, isGetPaymentOptionbyOrderIdLoading]);

  useEffect(() => {
    if (!isGetItemByOrderIdFetch && isGetItemByOrderIdSuccess && isGetItemByOrderIdData) {
      setOrderitemData(isGetItemByOrderIdData);
    }
  }, [isGetItemByOrderIdData, isGetItemByOrderIdSuccess, isGetItemByOrderIdFetch]);

  const handlepaymentoption = () => {
    if(selectedOption)
    {
    let request = {
      orderId: orderId,
      paymentType: selectedOption
    }
    addEditPaymentOption(request);
  }
  else{
    toast("warning","Please select either the Po or card PaymentOption")
  }

    if (selectedOption === "Net30") {
 
      const request = {
        orderId: orderId,
        tokenId: null,
        amount: parseFloat(OrderitemData?.orderPrice),
        description: "Order payment",
        paymentMethodId: null,
        paymentIntentId: null,
        metadata: null,
        cardHolderName: null,
        cardLastFourNumber: null,
        customerStripeId: null,
        cardProcessingCharges: 0
      }
      placeOrder(request);
    }
  }
  useEffect(() => {
    if (isAddEditPaymentOptionData && isAddEditPaymentOptionSuccess) {
      markTabAsCompleted(currentTabIndex);
      setActiveTab(prevTab => {
        const nextTab = prevTab + (selectedOption === "Card" ? 1 : 2);
        return nextTab < tabs.length ? nextTab : prevTab;
      });
    }
  }, [isAddEditPaymentOptionData, isAddEditPaymentOptionSuccess]);

useEffect(() => {
    if (isPlaceOrderSuccess && isPlaceOrderData) {
      if (isPlaceOrderData > 0) {
        toast("success", "Place order successfully!");
        setOrderId(isPlaceOrderData)
        // setActiveTab(prevTab => {
        //   const nextTab = prevTab + 2;
        //   return nextTab < tabs.length ? nextTab : prevTab;
        // });
      }
    }
  }, [isPlaceOrderSuccess, isPlaceOrderData])

  const handleBack = () => {
    setActiveTab(prev => Math.max(prev - 1, 0));
    
  }


  return (
    <div className="payment-option-sec">
      <div className="payment-option-sec_main-title">
        <h1>Payment Options</h1>
      </div>
      <div className="payment-option-sec_alert-part">
        <span className="payment-option-sec_alert-part_icon">
          <Iconify icon="material-symbols:info-rounded" width={35} />
        </span>
        <span className="payment-option-sec_alert-part_content">
          If you want to place the order via PO terms, send us the purchase
          order at sales@1clickchemistry.com
        </span>
      </div>

      <div className="payment-option-sec_option">
        <div className="payment-option-sec_option_title">
          <h3>How would like to pay ?</h3>
        </div>
        <div className="payment-option-sec_option_card-container">
          <div
            className={`payment-option-sec_option_card-container_card ${selectedOption === "Net30" ? "card-select" : ""
              }`}
            onClick={() => setSelectedOption("Net30")}
          >
            <div className="payment-option-sec_option_card-container_card_select-button">
              {/* <RadioButton  name="payment-method" checked={selectedOption === "Net30"}  value={selectedOption} onChange={(val) => setSelectedOption(val)}/> */}
              <input
                type="radio"
                name="payment-method"
                value={selectedOption}
                checked={selectedOption === "Net30"}
                onChange={(val) => setSelectedOption(val)}
              />
            </div>
            <div className="payment-option-sec_option_card-container_card_title">
            PO
            </div>
            <div className="payment-option-sec_option_card-container_card_payment-icon">
              <Image
                src={AppIcons.PurchaseOrder}
                alt="logo"
                width={100}
                height={150}
              />
            </div>
          </div>
          <div
            className={`payment-option-sec_option_card-container_card ${selectedOption === "Card" ? "card-select" : ""
              }`}
            onClick={() => setSelectedOption("Card")}
          >
            <div className="payment-option-sec_option_card-container_card_select-button">
              {/* <RadioButton  name="payment-method" checked={selectedOption === "Card"} value={selectedOption} onChange={(val) => setSelectedOption(val)}/> */}
              <input
                type="radio"
                name="payment-method"
                value={selectedOption}
                checked={selectedOption === "Card"}
                onChange={(val) => setSelectedOption(val)}
              />
            </div>
            <div className="payment-option-sec_option_card-container_card_title">
              Card
            </div>
            <div className="payment-option-sec_option_card-container_card_payment-icons">
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
        </div>
        <div className="payment-option-sec_option_sub-title">
          <p>You can also checkout directly using credit/debit card payment option!</p>
        </div>
        <div className="payment-option-sec_option_botttom-btn-sec">
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
            onClick={handlepaymentoption}
          >
           {selectedOption === "Net30" ? "Place Order" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOption;
 