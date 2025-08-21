import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
// Components
import Iconify from "@components/ui/iconify/Iconify";
import Button from "@components/ui/button/Button";
import IconButton from "@components/ui/iconButton/IconButton";
import Input from "@components/ui/input/Input";
import Select from "@components/ui/select/Select";
import ValidationText from "@components/Common/validation/validationText";
import AddQuotationRequest from "@features/products/productDetails/components/AddQuotationRequest";
import Loading from "src/app/loading";
// Utils & Services
import { AppIcons } from "@utils/AppIcons/AppIcons";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import { Messages } from "@utils/Messages/Messages";
import SwalAlert from "src/services/swal/SwalService";
// Redux
import { useAddRfqMutation } from "src/redux/serviceApi/rfqAPI";
// Styles
import "./RFQModal.scss";

const RFQModal = ({ onClose, catalogNumber, casNumber, title, mdlNumber, isMultiRFQForm, selectedProducts, setSelectedProducts }) => {
  const { toast } = SwalAlert();
  const [formData, setFormData] = useState({
    emailAddress: "",
    firstName: "",
    lastName: "",
    companyName: "",
    requestNote: "",
    timeFrame: "",
    country: "",
  });
  const [rfqProducts, setRfqProducts] = useState([{ package: "", quantity: "", sizeId: null }]);
  const [imgErrors, setImgErrors] = useState({});
  const [validState, setValidState] = useState({ isValid: true, error: {} });

  const [addRfq, { isLoading: isLoading, isSuccess: isSuccess, data: AddRFQRecordResponse }] = useAddRfqMutation();

  // Validation Rules
  const validationRules = {
    emailAddress: [
      { type: "require", message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "email address") },
      { type: "email", message: Messages.CommonValidationMessages.EmailAddressNotValid },
    ],
    firstName: [{ type: "require", message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "first name") }],
    lastName: [{ type: "require", message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "last name") }],
    companyName: [{ type: "require", message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "company name") }],
    package: [{ type: "require", message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "package") }],
    quantity: [{ type: "require", message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "quantity") }],
  };

  // Handle Image Load Error
  const handleImageError = useCallback((index) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Validate individual field
  const validateField = useCallback((key, value, index = null) => {
    const rules = validationRules[key] || [];
    let error = null;

    for (const rule of rules) {
      if (rule.type === "require" && !value) {
        error = rule.message;
        break;
      }
    }

    setValidState((prev) => {
      const newError = { ...prev.error };
      if (index !== null) {
        newError[`${key}_${index}`] = error;
      } else {
        newError[key] = error;
      }
      return { ...prev, error: newError };
    });

    return !error;
  }, [validationRules]);

  // Validate full form
  const isValid = () => {
    let isFormValid = true;

    // Validate formData
    Object.entries(formData).forEach(([key, value]) => {
      if (validationRules[key] && !validateField(key, value)) {
        isFormValid = false;
      }
    });

    // Validate rfqProducts
    rfqProducts.forEach((product, index) => {
      if (!validateField("package", product.package, index)) isFormValid = false;
      if (!validateField("quantity", product.quantity, index)) isFormValid = false;
    });

    setValidState((prev) => ({
      ...prev,
      isValid: isFormValid,
    }));

    return isFormValid;
  };

  // Handle RFQ response
  useEffect(() => {
    if (isSuccess) {
      if (AddRFQRecordResponse?.keyValue === "0") {
        toast("warning", AddRFQRecordResponse.errorMessage);
      } else {
        toast("success", AddRFQRecordResponse.errorMessage);
        onClose();
      }
    }
  }, [isSuccess, AddRFQRecordResponse, toast, onClose]);

  const productsList = useMemo(() => [{
    imageSrc: "",
    casNumber,
    catalogNumber,
    mdlNumber,
    mwNumber: "NA",
    title,
    availability: true,
  }], [casNumber, catalogNumber, mdlNumber, title]);

  return (
    <div className="rfq-modal">
      {!isMultiRFQForm &&
        productsList?.length > 0 &&
        productsList?.map((product, index) => {
          const {
            imageSrc,
            casNumber,
            catalogNumber,
            mdlNumber,
            mwNumber,
            title,
            availability,
          } = product;
          return (
            <div key={index} className="rfq-detail-card-container">
              <div className="rfq-detail-card-container__image-container">
                <div
                  className={`rfq-detail-availability-tag ${availability ? "green" : "red"
                    }`}
                >
                  <div className="product-availability-icon">
                    <Iconify
                      icon={
                        availability
                          ? "prime:check-circle"
                          : "mingcute:warning-line"
                      }
                      width={12}
                    />
                  </div>
                  <div className="product-availability-status-title">
                    {availability ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
                {imageSrc && !imgErrors[index] ? (
                  <div className="rfq-detail-image">
                    <Image
                      src={imageSrc}
                      alt="product-image"
                      width={0}
                      height={0}
                      onError={() => handleImageError(index)}
                    />
                  </div>
                ) : (
                  <div className="rfq-detail-image-placeholder">
                    <Image
                      src={AppIcons.ProductDetailCardPlaceholder}
                      alt="product-placeholder"
                      width={0}
                      height={0}
                    />
                  </div>
                )}
              </div>
              <div className="rfq-detail-card-detail">
                <div className="rfq-detail-card-detail-title">
                  <div className="product_title">{title}</div>
                </div>
                <div className="rfq-detail-card-detail-info">
                  {casNumber && (
                    <div className="product_info_number">
                      <span className="key">Cas No.: </span>
                      <span className="value">{casNumber}</span>
                    </div>
                  )}
                  {catalogNumber && (
                    <div className="product_info_number">
                      <span className="key">Catalog: </span>
                      <span className="value">{catalogNumber}</span>
                    </div>
                  )}
                  {mdlNumber && (
                    <div className="product_info_number">
                      <span className="key">MDL: </span>
                      <span className="value">{mdlNumber}</span>
                    </div>
                  )}
                  {mwNumber && (
                    <div className="product_info_number">
                      <span className="key">MW: </span>
                      <span className="value">{mwNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      {isMultiRFQForm && selectedProducts?.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f6f6f6" }}>
              <th>Catalog Number</th>
              <th>Chemical Name</th>
              <th>CAS Number</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((chemical, index) => {
              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                  }}
                >
                  <td>{chemical.catalogId || "-"}</td>
                  <td>{chemical.productName || "-"}</td>
                  <td>{chemical.casNo || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* Quotation Request Section */}
      <AddQuotationRequest
        onClose={onClose}
        catalogNumber={catalogNumber}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </div>
  );
};

export default RFQModal;
