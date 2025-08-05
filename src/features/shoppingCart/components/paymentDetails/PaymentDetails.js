import React, { useContext, useEffect, useState } from "react";
import Button from "@components/ui/button/Button";
import "./PaymentDetails.scss";
import CenterModal from "@components/ui/centerModal/CenterModal";
import PaymentCard from "@components/ui/paymentCard/PaymentCard";
import AddEditCardDetails from "@features/myAccount/components/myCardOptions/components/addEditCardDetails/AddEditCardDetails";
import ConfirmationModal from "@features/myAccount/components/myCardOptions/components/addEditCardDetails/confirmationModal/ConfirmationModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Constants } from "@components/Common/Enum/CommonEnum";
import { useCreatePaymentIntentMutation, useLazyGetStripeCardDetailsQuery } from "src/redux/serviceApi/paymentAPI";
import DataLoader from "@components/Common/Loader/DataLoader";
import { useSelector } from "react-redux";
import SwalAlert from "src/services/swal/SwalService";
import { TabContext } from "@features/context/TabContext";
import OrderContext from "@features/contextAPIs/OrderContext";
import { useLazyGetPaymentOptionbyOrderIdQuery, usePlaceOrderMutation, useLazyGetItemByOrderIdQuery } from "src/redux/serviceApi/OrderAPI";

const Paymentdetails = () => {
  const currentTabIndex = 4;
  const { setActiveTab, tabs, markTabAsCompleted } = useContext(TabContext);
  const { orderId, orderGrandTotal, setOrderId } = useContext(OrderContext);
  const [addEditCardModalOpen, setAddEditCardModalOpen] = React.useState(false);
  const { toast } = SwalAlert();
  const stripePromise = loadStripe(Constants.StripeKey);
  const [paymentMethodListData, setPaymentMethodListData] = useState([]);
  const [selcectedCard, setSelectedCard] = useState(null);
  const openModal = () => setAddEditCardModalOpen(true);
  const closeModal = () => setAddEditCardModalOpen(false);
  const user = useSelector((state) => state.auth);
  const [OrderitemData, setOrderitemData] = useState([]);
  const [GetPaymentMethodsList, { isFetching: isFetchingGetPaymentMethods, isSuccess: isGetPaymentMethodsSuccess, data: isGetPaymentMethodsData }] = useLazyGetStripeCardDetailsQuery();
  const [createPaymentIntent, { isLoading, isSuccess: isCreatePaymentIntentSuccess, data: isCreatePaymentIntentData }] = useCreatePaymentIntentMutation();
  const [placeOrder, { isLoading: isPlaceOrderLoading, isSuccess: isPlaceOrderSuccess, data: isPlaceOrderData }] = usePlaceOrderMutation();
  const [getItemByOrderId, { isFetching: isGetItemByOrderIdFetch, isSuccess: isGetItemByOrderIdSuccess, data: isGetItemByOrderIdData }] = useLazyGetItemByOrderIdQuery();

  useEffect(() => {
    GetPaymentMethodsList();
  }, [])

  useEffect(() => {
    if (isGetPaymentMethodsSuccess && isGetPaymentMethodsData && !isFetchingGetPaymentMethods) {

      setPaymentMethodListData(isGetPaymentMethodsData);
    }
  }, [isGetPaymentMethodsSuccess, isGetPaymentMethodsData, isFetchingGetPaymentMethods]);

  useEffect(() => {
    if (orderId) {
      getItemByOrderId(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isGetItemByOrderIdFetch && isGetItemByOrderIdSuccess && isGetItemByOrderIdData) {
      setOrderitemData(isGetItemByOrderIdData);

    }
  }, [isGetItemByOrderIdData, isGetItemByOrderIdSuccess, isGetItemByOrderIdFetch]);

  useEffect(() => {
    if (isCreatePaymentIntentSuccess && isCreatePaymentIntentData) {
      if (isCreatePaymentIntentData) {
        toast("success", "Place order successfully!");
        setSelectedCard(null);
      }
    }
  }, [isCreatePaymentIntentSuccess, isCreatePaymentIntentData]);

  const onEdit = () => {
    openModal();
  }

  const onDelete = (data) => {
    openMainModal(data);
  }

  const [openConfirmationModal, setopenConfirmationModal] = React.useState(false);

  const closeThisModal = () => setopenConfirmationModal(false);

  const openMainModal = (data) => {
    setSelectedCard(
      data,
    );
    setopenConfirmationModal(true);
  };

  const handleCardCheck = (data) => {

    setSelectedCard(data);
  };


  const handlePlaceOrder = () => {
    if (!selcectedCard) {
      toast("warning", "Please select a card for payment");
      return;
    }
    if (selcectedCard) {
      const request = {
        orderId: orderId,
        tokenId: null,
        amount: parseFloat(OrderitemData?.orderPrice),
        description: "Order payment",
        paymentMethodId: selcectedCard.paymentMethodId,
        paymentIntentId: selcectedCard.paymentIntentId,
        metadata: null,
        cardHolderName: selcectedCard?.cardHolderName,
        cardLastFourNumber: selcectedCard.cardLastFourNumber,
        customerStripeId: selcectedCard?.customerStripeId,
        cardProcessingCharges: 252.82
      };

      placeOrder(request);
    }
  };


  useEffect(() => {
    if (isPlaceOrderSuccess && isPlaceOrderData) {
      if (isPlaceOrderData > 0) {
        toast("success", "Place order successfully!");
        setOrderId(isPlaceOrderData);
        markTabAsCompleted(currentTabIndex);
        setActiveTab(prevTab => {
          const nextTab = prevTab + 1;
          return nextTab < tabs.length ? nextTab : prevTab;
        });
      }
    }
  }, [isPlaceOrderSuccess, isPlaceOrderData])

  const handleBack = () => {
    setActiveTab(prev => Math.max(prev - 1, 0));
  }

  return (
    <>
      <div className="payment-details-sec">
        <div className="title-desc-top">
          <div className="left-title-sec">
            <h2 className="page-title">Payment Details</h2>
            <p className="desc">
              Please select/add card details and proceed to do payment.
            </p>
          </div>
        </div>
        <div className="product-lists">
          <div className="cart-lists">
            <div className="mycardoptions-container">
              <div className="mycardoptions-container_header">

                <div className="mycardoptions-container_btn">
                  <Button
                    variant="contained"
                    startIcon="material-symbols:add-rounded"
                    color="secondary"
                    onClick={openModal}
                  >
                    Add New Card
                  </Button>
                </div>
              </div>
              <div className="mycardoptions-container_content">
                {isFetchingGetPaymentMethods ? (
                  <DataLoader />
                ) : paymentMethodListData?.length > 0 ? (
                  paymentMethodListData.map((method) => {
                    const { paymentMethodId, stripeCardId, } = method;
                    const brand = method?.type?.toLowerCase() || 'default';
                    const cardNumber = `XXXX XXXX XXXX ${method?.cardLastFourNumber || '0000'}`;
                    const name = method?.cardHolderName || 'Unknown';
                    const validTill = method?.expires;
                    const cvv = '***';

                    return (
                      <PaymentCard
                        key={paymentMethodId}
                        variant={brand}
                        cardNumber={cardNumber}
                        name={name}
                        validTill={validTill}
                        cvv={cvv}
                        onEdit={() => onEdit(paymentMethodId)}
                        onDelete={() => onDelete(method)}
                        checked={selcectedCard?.paymentMethodId === paymentMethodId}
                        onCheck={() => handleCardCheck(method)}
                      />
                    );
                  })
                ) : (
                  <p>No saved cards available.!</p>
                )}
              </div>

              <CenterModal
                isOpen={addEditCardModalOpen}
                onClose={closeModal}
                modalTitle="Add/Edit Card Details"
                transition="grow"
                modalSize="w-40"
              >
                <Elements stripe={stripePromise}>
                  <AddEditCardDetails onClose={closeModal} GetPaymentMethodsList={GetPaymentMethodsList} />
                </Elements>
              </CenterModal>

              <CenterModal
                isOpen={openConfirmationModal}
                onClose={closeThisModal}
                transition="grow"
                modalSize="w-40"
                className="confirmation-modal-container"
              >
                <ConfirmationModal onClose={closeThisModal} GetPaymentMethodsList={GetPaymentMethodsList} cardDetails={selcectedCard} />
              </CenterModal>
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
              {selcectedCard &&
                <div className="cart-heading">
                  <span className="heading-txt">Card Processing Charges </span>
                  <span className="heading-total">$252.82</span>
                </div>

              }
              {/* <div className="cart-heading">
                <span className="heading-txt">Discount</span>
                <span className="heading-total">${OrderitemData?.discountPrice}</span>
              </div> */}

              <div className="form-sec">
                {selcectedCard ? (

                  <div className="total-price">
                    <span>Total</span>
                    <span>
                      ${((OrderitemData?.orderPrice ?? 0) + 252.82)?.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="total-price">
                    <span>Total</span>
                    <span>${OrderitemData?.orderPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                )}
                <div className="bottom-note">
                  <p>Make payment and procced to place order!</p>
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
                    disabled={!selcectedCard || isPlaceOrderLoading}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-navigation"></div>
        </div>
      </div >
    </>
  );
};

export default Paymentdetails;
