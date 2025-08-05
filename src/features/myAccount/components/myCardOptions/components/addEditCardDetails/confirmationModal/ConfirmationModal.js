import React, { useEffect } from "react";
import "./ConfirmationModal.scss";
import Iconify from "@components/ui/iconify/Iconify";
import Button from "@components/ui/button/Button";
import { useDeleteCardMutation } from "src/redux/serviceApi/paymentAPI";
import SwalAlert from "src/services/swal/SwalService";
import { useSelector } from "react-redux";

const ConfirmationModal = ({ onClose, cardDetails, GetPaymentMethodsList }) => {
  const { toast } = SwalAlert();
  const user = useSelector((state) => state.auth);
  const [DeleteCard, { isSuccess: isDeleteCardSuccess, data: isDeleteCardData },] = useDeleteCardMutation();

  const handleDelete = () => {
    DeleteCard(cardDetails.stripeCardId);
  };

  useEffect(() => {
    if (isDeleteCardSuccess && isDeleteCardData) {
      if (isDeleteCardData.keyValue > 0) {
        toast("success", isDeleteCardData.errorMessage);
        onClose();
        GetPaymentMethodsList(); 
      }else if(isDeleteCardData.keyValue === 0){
        toast("warning", isDeleteCardData.errorMessage);
      }
    }
  }, [isDeleteCardSuccess, isDeleteCardData]);

  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal_main-title">
        <h2>Are you sure you want to delete this card?</h2>
      </div>
      <div className="confirmation-modal_card-detail">
        <div className="confirmation-modal_card-detail_top-title">
          <span className="confirmation-modal_card-detail_top-title_icon">
            <Iconify icon="ion:card" width={25} />
          </span>
          <span className="confirmation-modal_card-detail_top-title_title">
            {/* American Express */}
            {cardDetails?.type?.toUpperCase() || "Card"}
          </span>
        </div>
        <div className="confirmation-modal_card-detail_number">
          <span className="confirmation-modal_card-detail_number_sub-title">
            Card Number
          </span>
          <span className="confirmation-modal_card-detail_number_count">
            {/* 8050 4450 6022 2011 */}

            **** **** **** {cardDetails?.cardLastFourNumber}
          </span>
        </div>
        <div className="confirmation-modal_card-detail_person-detail">
          <div className="confirmation-modal_card-detail_person-detail_name">
            {/* Pankaj V. Chauhan */}
            {cardDetails?.cardHolderName || "N/A"}
          </div>
          <div className="confirmation-modal_card-detail_person-detail_date">
            <div className="confirmation-modal_card-detail_person-detail_date_container">
              <span className="title">Valid Till</span>
              <span className="valid-date">
                {cardDetails?.expires}
              </span>
            </div>
            <div className="confirmation-modal_card-detail_person-detail_date_container">
              <span className="title">CVV</span>
              <span className="valid-date">
                ***
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="confirmation-modal_card-detail_btn-section">
        <Button variant="contained" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
