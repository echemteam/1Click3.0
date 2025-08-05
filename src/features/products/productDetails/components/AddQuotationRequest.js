import React, { useEffect, useState } from "react";
// import "./BulkQuotationRequest.scss";
import Input from "@components/ui/input/Input";
import Select from "@components/ui/select/Select";
import IconButton from "@components/ui/iconButton/IconButton";
import Button from "@components/ui/button/Button";
import { useAddRfqMutation } from "src/redux/serviceApi/rfqAPI";
import SwalAlert from "src/services/swal/SwalService";
import { Messages } from "@utils/Messages/Messages";
import ValidationText from "@components/Common/validation/validationText";
import { useLazyGetAllCountriesQuery } from "src/redux/serviceApi/commonAPI";
import Loading from "src/app/loading";
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";


const AddQuotationRequest = ({ onClose, catalogNumber, isBulkQuotationRequest }) => {

    const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
    const user = useSelector((state) => state.auth.authData);
    const [addRfq, { isLoading: isAddRfqLoading, isSuccess: isAddRfqSuccess, data: isAddRfqData }] = useAddRfqMutation();
    const { toast } = SwalAlert();
    const [validState, setValidState] = useState({ isValid: true, error: {} });
    const [country, setCountry] = useState([]);
    const [isValidateCaptcha, setIsValidateCaptcha] = useState()
    const [getAllCountries, { isFetching: getAllCountriesFetching, isSuccess: getAllCountriesSuccess, data: getAllCountriesData }] = useLazyGetAllCountriesQuery();

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",

                emailAddress: user.emailAddress || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        getAllCountries();
    }, [])

    useEffect(() => {
        if (!getAllCountriesFetching && getAllCountriesSuccess && getAllCountriesData) {
            const countryList = getAllCountriesData.map((country) => ({
                value: country.countryId,
                label: country.countryName,
            }));
            setCountry(countryList);
        }
    }, [getAllCountriesFetching, getAllCountriesSuccess, getAllCountriesData]);

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
            {
                type: "minValue",
                value: 1,
                message: "Quantity must be greater than 0",
            },
        ],
        country: [
            {
                type: "require",
                message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "country"),
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
            if (rule.type === "minValue" && !isNaN(value) && Number(value) < rule.value) {
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
        const currentIndex = rfqProducts.length - 1;
        const currentProduct = rfqProducts[currentIndex];
        const isPackageValid = validateField("package", currentProduct.package, currentIndex);
        const isQuantityValid = validateField("quantity", currentProduct.quantity, currentIndex);
        if (!isPackageValid || !isQuantityValid) return;
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

        if (!isValidateCaptcha) {
            toast("warning", "Please verify you are not a robot.");
        }
        if (isValid() && isValidateCaptcha) {
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
                countryId: formData.country,
                RFQProducts,
            };

            try {
                await addRfq(rfqData).unwrap();
            } catch (error) {
                toast("error", "Failed to submit RFQ request. Please try again.");
            }
        }
    };
    const resetForm = () => {

        setFormData(prev => ({
            ...prev,
            companyName: "",
            requestNote: "",
            timeFrame: null,
            country: null,
        }));

        setRfqProducts([{ package: "", quantity: "", sizeId: null }]);
        setValidState({ isValid: true, error: {} });
    };

    useEffect(() => {
        if (isAddRfqSuccess && isAddRfqData?.keyValue === "0") {
            toast("warning", "'RFQ request already exists with the same details.");
        } else if (isAddRfqSuccess && isAddRfqData) {

            toast("success", "RFQ added successfully");
            if (onClose) onClose();
            resetForm();
            setIsValidateCaptcha();
        }
    }, [isAddRfqSuccess, isAddRfqData]);

    const handleCountryChange = (selected) => {
        setFormData((prev) => ({
            ...prev,
            country: selected,
        }));
        validateField("country", selected);
    };


    const handleCaptchaChange = (data) => {
        setIsValidateCaptcha(data)
    }
    return (

        <div className="bulk-quotation-request">
            <form className="bulk-quotation-request-form" onSubmit={handleSubmit}>
                <div className="bulk-quotation-request-form__grid">
                    <div className="bulk-quotation-request-form__group">
                        <label className="bulk-quotation-request-form__label">
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
                    <div className="bulk-quotation-request-form__group">
                        <label className="bulk-quotation-request-form__label">
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
                    <div className="bulk-quotation-request-form__group">
                        <label className="bulk-quotation-request-form__label">
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
                    <div className="bulk-quotation-request-form__group">
                        <label className="bulk-quotation-request-form__label">
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
                    <div className="bulk-quotation-request-form__group">
                        <label className="bulk-quotation-request-form__label">
                            Country <span className="required">*</span>
                        </label>
                        <Select
                            options={country}
                            placeholder="Select Country"
                            // value={formData.country} 
                            value={country.find((option) => option.value === formData.country) || null}
                            onChange={handleCountryChange}
                        />
                        <ValidationText errorText={validState.error.country} />
                    </div>
                    <div className="bulk-quotation-request-form__group bulk-quotation-request-form__group--full">
                        <label className="bulk-quotation-request-form__label">Special Request</label>
                        <Input
                            type="text"
                            placeholder="Special Request"
                            name="requestNote"
                            value={formData.requestNote}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="bulk-quotation-request-form__group">
                        <label className="bulk-quotation-request-form__label">Time Frame</label>
                        <Select
                            options={timeFrameOptions}
                            placeholder="Select Time Frame"
                            value={timeFrameOptions.find((option) => option.value === formData.timeFrame) || null}
                            onChange={(value) => handleSelectChange("timeFrame", value)}
                        />
                    </div>

                    <div className="bulk-quotation-request-form__packages bulk-quotation-request-form__group">
                        {rfqProducts.map((product, index) => (
                            <div key={index} className="bulk-quotation-request-form__package-row">
                                <div className="bulk-quotation-request-form__group">
                                    <label className="bulk-quotation-request-form__label">
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
                                <div className="bulk-quotation-request-form__group">
                                    <label className="bulk-quotation-request-form__label">
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
                                <div className="bulk-quotation-request-form__group">
                                    <label className="bulk-quotation-request-form__label">Unit</label>
                                    <Select
                                        options={unitOptions}
                                        placeholder="Select"
                                        // value={unitOptions.find((option) => option.value === parseInt(product.sizeId))}
                                        value={unitOptions.find((option) => option.value === product.sizeId) || null}

                                        onChange={(value) => handleProductChange(index, "sizeId", value)}
                                    />
                                </div>
                                <div
                                    className={
                                        index === 0 ? "bulk-quotation-request-form__btn-single" : "bulk-quotation-request-form__btn-group"
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

                        <div>
                            <ReCAPTCHA
                                sitekey={siteKey}
                                onChange={handleCaptchaChange}
                            />
                        </div>
                        <div className="bulk-quotation-request-form__modal-button">
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
            </form>
        </div>
    );
};

export default AddQuotationRequest;
