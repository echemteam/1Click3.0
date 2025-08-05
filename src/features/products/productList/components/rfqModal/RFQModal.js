import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Iconify from "@components/ui/iconify/Iconify";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Button from "@components/ui/button/Button";
import IconButton from "@components/ui/iconButton/IconButton";
import "./RFQModal.scss";
import Input from "@components/ui/input/Input";
import Select from "@components/ui/select/Select";
import { useAddRfqMutation } from "src/redux/serviceApi/rfqAPI";
import SwalAlert from "src/services/swal/SwalService";
import Loading from "src/app/loading";
import ValidationText from "@components/Common/validation/validationText";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import { Messages } from "@utils/Messages/Messages";
import AddQuotationRequest from "@features/products/productDetails/components/AddQuotationRequest";

const RFQModal = ({ onClose, catalogNumber, casNumber, title, mdlNumber }) => {
  const [addRfq, { isLoading: isAddRfqLoading, isSuccess: isAddRfqSuccess, data: isAddRfqData }] =
    useAddRfqMutation();
  const { toast } = SwalAlert();
  const [validState, setValidState] = useState({ isValid: true, error: {} });

  const productsList = useMemo(
    () => [
      {
        imageSrc: "",
        casNumber: casNumber,
        catalogNumber : catalogNumber,
        mdlNumber: mdlNumber,
        mwNumber: "NA",
        title: title,
        availability: true,
      },
    ],
    []
  );

  const unitOptions = [
    { value: 1, label: "MG" },
    { value: 2, label: "G" },
    { value: 3, label: "KG" },
  ];

  const timeFrameOptions = [
    { value: "In 1 week", label: "In 1 week" },
    { value: "In 2 weeks", label: "In 2 weeks" },
    { value: "In 3 weeks", label: "In 3 weeks" },
  ];

  const countryOptions = [
    { value: "option1", label: "India" },
    { value: "option2", label: "Australia" },
    { value: "option3", label: "United States" },
  ];

  const [formData, setFormData] = useState({
    emailAddress: "",
    firstName: "",
    lastName: "",
    companyName: "",
    requestNote: "",
    timeFrame: "",
    country: "",
  });

  const [rfqProducts, setRfqProducts] = useState([
    { package: "", quantity: "", sizeId: null },
  ]);

  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (index) => {
    setImgErrors((prev) => ({
      ...prev,
      [index]: true
    }));
  };

  const validationRules = {
    emailAddress: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "email address"),
      },
      {
        type: "email",
        message: Messages.CommonValidationMessages.EmailAddressNotValid,
      },
    ],
    firstName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "first name"),
      },
    ],
    lastName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "last name"),
      },
    ],
    companyName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "company name"),
      },
    ],

    // Define rules for rfqProducts fields
    package: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "package"),
      },
    ],
    quantity: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "quantity"),
      },
    ],
  };

  const validateField = (key, value, index = null) => {
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
        // For rfqProducts fields, store errors with index
        newError[`${key}_${index}`] = error;
      } else {
        newError[key] = error;
      }
      return { ...prev, error: newError };
    });

    return !error;
  };

  const isValid = () => {
    let isFormValid = true;
    const newError = {};

    // Validate formData fields
    Object.keys(formData).forEach((key) => {
      if (validationRules[key]) {
        const isFieldValid = validateField(key, formData[key]);
        if (!isFieldValid) {
          isFormValid = false;
        }
      }
    });

    // Validate rfqProducts fields
    rfqProducts.forEach((product, index) => {
      const isPackageValid = validateField("package", product.package, index);
      const isQuantityValid = validateField("quantity", product.quantity, index);
      if (!isPackageValid || !isQuantityValid) {
        isFormValid = false;
      }
    });

    setValidState((prev) => ({
      isValid: isFormValid,
      error: { ...prev.error, ...newError },
    }));

    return isFormValid;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handle RFQ product row changes
  const handleProductChange = (index, field, value) => {
    setRfqProducts((prev) =>
      prev.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      )
    );
    validateField(field, value, index);
  };

  // Add a new product row
  const addProductRow = (e) => {
    e.preventDefault();
    setRfqProducts((prev) => [...prev, { package: "", quantity: "", sizeId: null }]);
  };

  // Remove a product row
  const removeProductRow = (index) => {
    setRfqProducts((prev) => prev.filter((_, i) => i !== index));
    // Clear errors for removed row
    setValidState((prev) => {
      const newError = { ...prev.error };
      delete newError[`package_${index}`];
      delete newError[`quantity_${index}`];
      return { ...prev, error: newError };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValid()) {
      const RFQProducts = rfqProducts.map((product) => ({
        quantity: product.quantity,
        sizeId: product.sizeId ?? 0,
        package: product.package,
      }));

      const rfqData = {
        catalogId: catalogNumber,
        emailAddress: formData.emailAddress,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        requestNote: formData.requestNote,
        expectedDeliveryDate: new Date().toISOString(),
        timeFrame: formData.timeFrame,
        RFQProducts,
      };

      try {
        await addRfq(rfqData).unwrap();
      } catch (error) {
        toast("error", "Failed to submit RFQ request. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isAddRfqSuccess && isAddRfqData?.keyValue === "0") {
      toast("warning", isAddRfqData.errorMessage);
    } else if (isAddRfqSuccess && isAddRfqData) {
      toast("success", isAddRfqData.errorMessage);
      onClose();
    }
  }, [isAddRfqSuccess, isAddRfqData]);

  return (
    <div className="rfq-modal">
      {productsList.map((product, index) => {
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
              {availability === true && (
                <div className="rfq-detail-availability-tag green">
                  <div className="product-availability-icon">
                    <Iconify icon="prime:check-circle" width={12} />
                  </div>
                  <div className="product-availability-status-title">In Stock</div>
                </div>
              )}
              {availability === false && (
                <div className="rfq-detail-availability-tag red">
                  <div className="product-availability-icon">
                    <Iconify icon="mingcute:warning-line" width={12} />
                  </div>
                  <div className="product-availability-status-title">Out of Stock</div>
                </div>
              )}

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
                    alt="product-placeholder-image"
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
      {/* <form className="request-form" onSubmit={handleSubmit}>
        <div className="request-form__grid">
          <div className="request-form__group">
            <label className="request-form__label">
              First Name <span className="required">*</span>
            </label>
            <Input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={() => validateField("firstName", formData.firstName)}
            />
            <ValidationText errorText={validState.error.firstName} />
          </div>
          <div className="request-form__group">
            <label className="request-form__label">
              Last Name <span className="required">*</span>
            </label>
            <Input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={() => validateField("lastName", formData.lastName)}
            />
            <ValidationText errorText={validState.error.lastName} />
          </div>
          <div className="request-form__group">
            <label className="request-form__label">
              Company Name <span className="required">*</span>
            </label>
            <Input
              type="text"
              placeholder="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              onBlur={() => validateField("companyName", formData.companyName)}
            />
            <ValidationText errorText={validState.error.companyName} />
          </div>
          <div className="request-form__group">
            <label className="request-form__label">
              Email Address <span className="required">*</span>
            </label>
            <Input
              type="email"
              placeholder="Email Address"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              onBlur={() => validateField("emailAddress", formData.emailAddress)}
            />
            <ValidationText errorText={validState.error.emailAddress} />
          </div>
          <div className="request-form__group">
            <label className="request-form__label">
              Country <span className="required">*</span>
            </label>
            <Select
              options={countryOptions}
              placeholder="Select Country"
              value={formData.country}
              onChange={(option) => handleSelectChange("country", option.value)}
            />
          </div>
          <div className="request-form__group request-form__group--full">
            <label className="request-form__label">Special Request</label>
            <Input
              type="text"
              placeholder="Special Request"
              name="requestNote"
              value={formData.requestNote}
              onChange={handleInputChange}
            />
          </div>
          <div className="request-form__group">
            <label className="request-form__label">Time Frame</label>
            <Select
              options={timeFrameOptions}
              placeholder="Select Time Frame"
              value={formData.timeFrame}
              onChange={(value) => handleSelectChange("timeFrame", value)}
            />
          </div>

          <div className="request-form__packages request-form__group">
            {rfqProducts.map((product, index) => (
              <div key={index} className="request-form__package-row">
                <div className="request-form__group">
                  <label className="request-form__label">
                    Package <span className="required">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Package"
                    value={product.package}
                    onChange={(e) => handleProductChange(index, "package", e.target.value)}
                    onBlur={() => validateField("package", product.package, index)}
                  />
                  <ValidationText errorText={validState.error[`package_${index}`]} />
                </div>
                <div className="request-form__group">
                  <label className="request-form__label">
                    Quantity <span className="required">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    onBlur={() => validateField("quantity", product.quantity, index)}
                  />
                  <ValidationText errorText={validState.error[`quantity_${index}`]} />
                </div>
                <div className="request-form__group">
                  <label className="request-form__label">Unit</label>
                  <Select
                    options={unitOptions}
                    placeholder="Select"
                    value={unitOptions.find((option) => option.value === parseInt(product.sizeId))}
                    onChange={(value) => handleProductChange(index, "sizeId", value)}
                  />
                </div>
                <div
                  className={
                    index === 0 ? "request-form__btn-single" : "request-form__btn-group"
                  }
                >
                  <IconButton
                    variant="contained"
                    icon="ic:round-plus"
                    shape="square"
                    onClick={addProductRow}
                  />
                  {index > 0 && (
                    <IconButton
                      variant="contained"
                      icon="ic:round-minus"
                      shape="square"
                      color="error"
                      onClick={() => removeProductRow(index)}
                    />
                  )}
                </div>
              </div>
            ))}
            <div className="request-form__modal-button">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isAddRfqLoading}
              >
                {isAddRfqLoading ? <Loading /> : "Submit Request"}
              </Button>
            </div>
          </div>
        </div>
      </form> */}
      <AddQuotationRequest onClose={onClose}
        catalogNumber={catalogNumber}
      />
    </div>
  );
};

export default RFQModal;