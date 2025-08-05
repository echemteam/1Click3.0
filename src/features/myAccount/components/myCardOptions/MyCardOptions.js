import React, { useEffect, useState } from 'react'
import Button from '@components/ui/button/Button';
import PaymentCard from '@components/ui/paymentCard/PaymentCard';
import CenterModal from '@components/ui/centerModal/CenterModal';
import AddEditCardDetails from './components/addEditCardDetails/AddEditCardDetails';
import "./MyCardOptions.scss";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Constants } from '@components/Common/Enum/CommonEnum';
import { useLazyGetStripeCardDetailsQuery } from 'src/redux/serviceApi/paymentAPI';
import DataLoader from '@components/Common/Loader/DataLoader';
import ConfirmationModal from './components/addEditCardDetails/confirmationModal/ConfirmationModal';

const MyCardOptions = () => {
  const [addEditCardModalOpen, setAddEditCardModalOpen] = React.useState(false);
  const [paymentMethodListData, setPaymentMethodListData] = useState();
  const [selcectedCard,setSelectedCard]=useState(null);

  const stripePromise = loadStripe(Constants.StripeKey);

  const [GetPaymentMethodsList, { isFetching: isFetchingGetPaymentMethods, isSuccess: isGetPaymentMethodsSuccess, data: isGetPaymentMethodsData }] = useLazyGetStripeCardDetailsQuery();


  useEffect(() => {
    GetPaymentMethodsList();
  }, [])

  useEffect(() => {
    if (isGetPaymentMethodsSuccess && isGetPaymentMethodsData && !isFetchingGetPaymentMethods) {
      setPaymentMethodListData(isGetPaymentMethodsData);
    }
  }, [isGetPaymentMethodsSuccess, isGetPaymentMethodsData, isFetchingGetPaymentMethods]);


  const onDelete = (data) => {
    openMainModal(data);
  }

  const [openConfirmationModal, setopenConfirmationModal] = React.useState(false);

  const closeThisModal = () => setopenConfirmationModal(false);

  const openModal = () => setAddEditCardModalOpen(true);
  const closeModal = () => setAddEditCardModalOpen(false);


  const openMainModal = (data) => {
    setSelectedCard(
      data,
    );
    setopenConfirmationModal(true);
  };

  const onEdit = () => {
    openModal();
  }

  const handleCardCheck = (id) => {
    setSelectedCard(id);  
  };


  return (
    <div className='mycardoptions-container'>
      <div className='mycardoptions-container_header'>
        <div className='mycardoptions-container_title'>
          My Card Options
        </div>
        <div className='mycardoptions-container_btn'>
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
      <div className='mycardoptions-container_content'>
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
              checked={selcectedCard === paymentMethodId}
              onCheck={() => handleCardCheck(paymentMethodId)}
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
  )
}

export default MyCardOptions