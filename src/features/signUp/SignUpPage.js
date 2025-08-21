"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Input from "@components/ui/input/Input";
import Link from "next/link";
import Select from "@components/ui/select/Select";
import "./SignUpPage.scss";
import { useAddUserMutation } from "src/redux/serviceApi/userAPI";
import Loading from "src/app/loading";
import SwalAlert from "src/services/swal/SwalService";
import { useRouter } from "next/navigation";
import Label from "@components/ui/label/Label";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import ValidationText from "@components/Common/validation/validationText";
import { Messages } from "@utils/Messages/Messages";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useLazyGetAllCountriesQuery } from "src/redux/serviceApi/commonAPI";

const SignUpPage = () => {
  const { toast } = SwalAlert();
  const [
    addUser,
    { isLoading: isAddLoading, isSuccess: isAddSuccess, data: isAddData },
  ] = useAddUserMutation();
  const [
    getAllCountries,
    {
      isFetching: getAllCountriesFetching,
      isSuccess: getAllCountriesSuccess,
      data: getAllCountriesData,
    },
  ] = useLazyGetAllCountriesQuery();
  const router = useRouter();
  const [phoneInputKey, setPhoneInputKey] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [country, setCountry] = useState([]);
  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryId: "",
    companyName: "",
    phoneNo: "",
    emailAddress: "",
    designation: "",
    PhoneCode: "",
  });

  const handleChange = (field) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validationrules = {
    firstName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "first Name"
        ),
      },
    ],
    lastName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "last Name"
        ),
      },
    ],
    // countryId: [
    //   {
    //     type: "require",
    //     message: Messages.CommonValidationMessages.FieldRequired.replace(
    //       "{0}",
    //       "country"
    //     ),
    //   },
    // ],
    companyName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "company Name"
        ),
      },
    ],
    phoneNo: [
      {
        type: "phoneinput",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "phone No"
        ),
      },
    ],
    emailAddress: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "email Address"
        ),
      },
      {
        type: "email",
        message: Messages.CommonValidationMessages.EmailAddressNotValid.replace(
          "{0}",
          "email address"
        ),
      },
    ],
    designation: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "designation"
        ),
      },
    ],
  };
  const handleAddUser = (e) => {
    e.preventDefault();
    const dialCode = formData.PhoneCode;
    let localNumber = formData.phoneNo;
    localNumber = localNumber.slice(dialCode.length + 1);
    if (isValid()) {
      const request = {
        ...formData,
        countryId: formData.countryId,
        phoneNo: localNumber,
        PhoneCode: dialCode,
      };
      addUser(request);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (
      !getAllCountriesFetching &&
      getAllCountriesSuccess &&
      getAllCountriesData
    ) {
      const countryList = getAllCountriesData.map((country) => ({
        value: country.countryId,
        label: country.countryName,
        dialCode: `+${country.phoneCode}`,
      }));
      setCountry(countryList);
    }
  }, [getAllCountriesFetching, getAllCountriesSuccess, getAllCountriesData]);

  useEffect(() => {
    if (isAddSuccess) {
      if (isAddData.response === 0) {
        toast(
          "warning",
          "This email address is already registered. Please log in or use a different email."
        );
      } else if (!isAddData.emailSent) {
        toast("error", "Email could not be sent");
      } else if (isAddData.response > 0) {
        setFormData({
          firstName: "",
          lastName: "",
          countryId: "",
          companyName: "",
          phoneNo: "",
          emailAddress: "",
          designation: "",
          isCompany: false,
          PhoneCode: "",
        });
        setPhoneInputKey((prev) => prev + 1);
        setShowPopup(true);
      } else {
        toast("error", "User creation failed.");
      }
    }
  }, [isAddSuccess, isAddData]);

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push("/login");
  };

  const handlePhoneChange = (phone, meta) => {
    setFormData((prev) => ({
      ...prev,
      phoneNo: phone,
      PhoneCode: meta?.country?.dialCode || "",
    }));
  };

  const handleDropdownChange = (selectedValue) => {
  const selectedCountry = country.find(c => c.value === selectedValue?.value);
  if (selectedCountry) {
    setFormData((prev) => ({
      ...prev,
      countryId: selectedCountry.value,
      PhoneCode: selectedCountry.dialCode,
      phoneNo: selectedCountry.dialCode, 
    }));
    setPhoneInputKey(prev => prev + 1); 
  }
};

  const isValid = () => {
    const returnValidState = isValidForm(formData, validationrules, validState);
    setValidState(returnValidState);
    return returnValidState.isValid;
  };
  const validation = (key, object) => {
    const validRules = { ...validationrules };
    const vaildStates = { ...validState };
    const returnValidState = validate(key, object, validRules, vaildStates);
    setValidState(returnValidState);
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="signup-form__box">
          <h2 className="signup-form__box__title">Sign Up</h2>
          <p className="signup-form__box__subtitle">Welcome back! Sign Up</p>
          <span className="signup-form__box__divider"></span>
          <form onSubmit={handleAddUser} className="signup-form__box__form">
            <div className="signup-form__box__form_form-field">
              <Input
                type="text"
                cssClass="signup-form__box__form_form-field_input"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                onBlur={() => validation("firstName", formData)}
                placeholder="First Name"
                maxLength={64}
              />
              <ValidationText errorText={validState.error.firstName} />
            </div>
            <div className="signup-form__box__form_form-field">
              <Input
                type="text"
                cssClass="signup-form__box__form_form-field_input"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                onBlur={() => validation("lastName", formData)}
                placeholder="Last Name"
                maxLength={64}
              />
              <ValidationText errorText={validState.error.lastName} />
            </div>
            <div className="signup-form__box__form_form-field">
              <Select
                options={country}
                placeholder="Country"
                value={formData.countryId}
                onChange={handleDropdownChange}
                onBlur={() => validation("countryId", formData)}
                isSearchable={false}
              />
              {/* <ValidationText errorText={validState.error.countryId} /> */}
            </div>
            <div className="signup-form__box__form_form-field">
              <Input
                type="text"
                cssClass="signup-form__box__form_form-field_input"
                onChange={handleChange("companyName")}
                onBlur={() => validation("companyName", formData)}
                value={formData.companyName}
                placeholder="Company"
                maxLength={200}
              />
              <ValidationText errorText={validState.error.companyName} />
            </div>
            <div className="signup-form__box__form_form-field">
              <PhoneInput
                key={phoneInputKey}
                defaultCountry="us"
                value={formData.phoneNo}
                onChange={handlePhoneChange}
                onBlur={() => validation("phoneNo", formData)}
                placeholder="Phone Number"
                maxLength={20}
              />
              <ValidationText errorText={validState.error.phoneNo} />
            </div>
            <div className="signup-form__box__form_form-field">
              <Input
                type="EMAIL"
                cssClass="signup-form__box__form_form-field_input"
                onChange={handleChange("emailAddress")}
                onBlur={() => validation("emailAddress", formData)}
                value={formData.emailAddress}
                placeholder="Email"
                maxLength={50}
              />
              <ValidationText errorText={validState.error.emailAddress} />
            </div>
            <div className="signup-form__box__form_form-field">
              <Input
                type="text"
                cssClass="signup-form__box__form_form-field_input"
                onChange={handleChange("designation")}
                onBlur={() => validation("designation", formData)}
                value={formData.designation}
                placeholder="designation"
                maxLength={64}
              />
              <ValidationText errorText={validState.error.designation} />
            </div>
            <button
              className="signup-form__box__form_form-field_button"
              disabled={isAddLoading}
            >
              {isAddLoading ? <Loading /> : "Sign Up"}
            </button>
            <span className="signup-form__box__form_form-field_signup">
              You have an account? <Link href="/login">Sign in</Link>
            </span>
          </form>
        </div>
      </div>

      <div className="signup-image">
        <div className="signup-image_mobile-image">
          <Image
            src={AppIcons.MobileImage}
            alt="no-product-found-image"
            width={120}
            height={40}
          />
        </div>
        <div className="signup-image_shape"></div>
      </div>

      {showPopup && (
        <div className="signup-modal">
          <div className="signup-modal__content">
            <h3>Success!</h3>
            <p>
              You have signed up successfully, please check your email for
              password!
            </p>
            <button className="signup-modal__button" onClick={handleClosePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
