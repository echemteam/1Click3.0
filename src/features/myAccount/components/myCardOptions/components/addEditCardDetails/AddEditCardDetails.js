import React, { useEffect, useState } from 'react';
import Label from '@components/ui/label/Label';
import Input from '@components/ui/input/Input';
import Button from '@components/ui/button/Button';
import "./AddEditCardDetails.scss";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useSaveCardMutation } from 'src/redux/serviceApi/paymentAPI';
import { useSelector } from 'react-redux';
import SwalAlert from 'src/services/swal/SwalService';

const AddEditCardDetails = ({ onClose, GetPaymentMethodsList }) => {
  
  const user = useSelector((state) => state.auth);
  const { toast } = SwalAlert();
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);

  const [saveCard, { isLoading, isSuccess: isSaveCardSuccess, data: isSaveCardData }] = useSaveCardMutation();

  const validateField = (fieldName, value, element = null) => {
    const errors = { ...fieldErrors };

    switch (fieldName) {
      case 'cardHolderName':
        if (value.trim() === '') {
          errors.cardHolderName = 'Please enter card holder name';
        } else {
          delete errors.cardHolderName;
        }
        break;
      case 'cardNumber':
        if (!element || element._implementation._empty) {
          errors.cardNumber = 'Please enter card number';
        } else if (element._implementation._invalid) {
          errors.cardNumber = 'Card number is invalid';
        } else {
          delete errors.cardNumber;
        }
        break;
      case 'cardExpiry':
        if (!element || element._implementation._empty) {
          errors.cardExpiry = 'Please enter card expiry';
        } else if (element._implementation._invalid) {
          errors.cardExpiry = 'Expiry date is invalid';
        } else {
          delete errors.cardExpiry;
        }
        break;
      case 'cardCvc':
        if (!element || element._implementation._empty) {
          errors.cardCvc = 'Please enter CVC';
        } else if (element._implementation._invalid) {
          errors.cardCvc = 'CVC is invalid';
        } else {
          delete errors.cardCvc;
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValid = () => {
    const cardNumber = elements.getElement(CardNumberElement);
    const cardCvc = elements.getElement(CardCvcElement);
    const cardExpiry = elements.getElement(CardExpiryElement);

    let isValidForCard = true;
    const errors = {};

    if (cardHolderName.trim() === '') {
      errors.cardHolderName = 'Please enter card holder name';
      isValidForCard = false;
    }

    if (!cardNumber || cardNumber._implementation._empty) {
      errors.cardNumber = 'Please enter card number';
      isValidForCard = false;
    } else if (cardNumber._implementation._invalid) {
      errors.cardNumber = 'Card number is invalid';
      isValidForCard = false;
    }

    if (!cardExpiry || cardExpiry._implementation._empty) {
      errors.cardExpiry = 'Please enter card expiry';
      isValidForCard = false;
    } else if (cardExpiry._implementation._invalid) {
      errors.cardExpiry = 'Expiry date is invalid';
      isValidForCard = false;
    }

    if (!cardCvc || cardCvc._implementation._empty) {
      errors.cardCvc = 'Please enter CVC';
      isValidForCard = false;
    } else if (cardCvc._implementation._invalid) {
      errors.cardCvc = 'CVC is invalid';
      isValidForCard = false;
    }

    setFieldErrors(errors);
    return isValidForCard;
  };

  useEffect(() => {
    if (isSaveCardSuccess && isSaveCardData) {
    }
  }, [isSaveCardSuccess, isSaveCardData]);


  const handleSaveCard = async () => {
    
    setErrorMessage(null);
    if (!stripe || !elements) return;

    if (!isValid()) return;

    const cardNumberElement = elements.getElement(CardNumberElement);


    const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: cardHolderName,
        email: user?.email,
      },
    });

    if (createError) {
      setErrorMessage(createError.message);
      return;
    }

    const payload = {
      customerId: null,
      paymentMethod: paymentMethod.id,
      email: user?.email,
      name: cardHolderName,
    };
 
    try {
      const response = await saveCard(payload).unwrap();

      const clientSecret = response?.client_secret;
      const customerId = response?.customer;

      if (clientSecret) {
        setIsConfirming(true);
        const confirmResult = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: cardHolderName,
              email: user?.email,
            },
          },
        });
        setIsConfirming(false);
        if (confirmResult?.setupIntent?.status === "succeeded") {
          toast("success", " Card details saved successfully!");
          onClose();
          GetPaymentMethodsList({ customerId: user.userId });
        } else if (confirmResult.error) {
          switch (confirmResult.error.code) {
            case "card_declined":
              toast("error", "Your card was declined.");
              break;
            case "expired_card":
              toast("error", "Your card has expired.");
              break;
            case "incorrect_cvc":
              toast("error", "Incorrect CVC code.");
              break;
            case "incorrect_number":
              toast("error", "Incorrect card number.");
              break;
            default:
              toast("error", confirmResult.error.message || "Something went wrong while confirming the card.");
          }
        }
      } else {
        toast("error", "Missing client secret in response.");
      }
    } catch (apiError) {
      setIsConfirming(false);
      const errorMsg =
        apiError?.data?.message || apiError?.message || "Failed to save card.";
      setErrorMessage(errorMsg);
    }
  };


  const handleElementBlur = (fieldName, element) => {
    validateField(fieldName, null, element);
  };

  const handleCardHolderNameBlur = () => {
    validateField('cardHolderName', cardHolderName);
  };

  return (
    <div className='addeditcarddetails-container'>
      <div className='addeditcarddetails-container_form'>
        <div className="myprofile-container_main-container_edit-profile-form_group">
          <Label label="Card Holder Name" isRequired />
          <Input
            type="text"
            placeholder="Card Holder Name"
            name="name"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            onBlur={handleCardHolderNameBlur}
          />
          {fieldErrors.cardHolderName && (
            <div className="error-message">{fieldErrors.cardHolderName}</div>
          )}
        </div>

        <div className="myprofile-container_main-container_edit-profile-form_group">
          <Label label="Card Number" isRequired />
          <div className="stripe-element-wrapper">
            <CardNumberElement
              options={{
                style: {
                  base: { fontSize: '16px', color: '#424770' },
                  invalid: { color: '#9e2146' },
                },
              }}
              onBlur={() => handleElementBlur('cardNumber', elements.getElement(CardNumberElement))}
            />
          </div>
          {fieldErrors.cardNumber && (
            <div className="error-message">{fieldErrors.cardNumber}</div>
          )}
        </div>

        <div className="myprofile-container_main-container_edit-profile-form_group">
          <Label label="Expiry Date" isRequired />
          <div className="stripe-element-wrapper">
            <CardExpiryElement
              options={{
                style: {
                  base: { fontSize: '16px', color: '#424770' },
                  invalid: { color: '#9e2146' },
                },
              }}
              onBlur={() => handleElementBlur('cardExpiry', elements.getElement(CardExpiryElement))}
            />
          </div>
          {fieldErrors.cardExpiry && (
            <div className="error-message">{fieldErrors.cardExpiry}</div>
          )}
        </div>

        <div className="myprofile-container_main-container_edit-profile-form_group">
          <Label label="CVV" isRequired />
          <div className="stripe-element-wrapper">
            <CardCvcElement
              options={{
                style: {
                  base: { fontSize: '16px', color: '#424770' },
                  invalid: { color: '#9e2146' },
                },
              }}
              onBlur={() => handleElementBlur('cardCvc', elements.getElement(CardCvcElement))}
            />
          </div>
          {fieldErrors.cardCvc && (
            <div className="error-message">{fieldErrors.cardCvc}</div>
          )}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className='addeditcarddetails-container_form_actions'>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCard}
            disabled={!stripe || isLoading || isConfirming}
          >
            {isLoading || isConfirming ? 'Saving...' : 'Save Card'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditCardDetails;
