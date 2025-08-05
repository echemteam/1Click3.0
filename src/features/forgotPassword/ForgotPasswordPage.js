"use client";

import React, { useEffect, useState } from "react";
import Input from "@components/ui/input/Input";
import Link from "next/link";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import "./ForgotPasswordPage.scss";
import { useForgotPasswordMutation } from "src/redux/serviceApi/authAPI";
import SwalAlert from "src/services/swal/SwalService";
import { useRouter } from "next/navigation";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import ValidationText from "@components/Common/validation/validationText";
import { Messages } from "@utils/Messages/Messages";

const ForgotPasswordPage = () => {
  const { toast } = SwalAlert();
  const router = useRouter();

  const [
    forgotPassword,
    {
      isLoading: isForgotPasswordLoading,
      isSuccess: isForgotPasswordSuccess,
      data: isForgotPasswordData,
    },
  ] = useForgotPasswordMutation();
  const [formData, setFormData] = useState({
    emailAddress: "",
  });
  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });
  const validationrules = {
    emailAddress: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "email"
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
  };

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isForgotPasswordSuccess) {
      if (isForgotPasswordData > 0) {
        toast("success", "We Send you an email.");
        setFormData({
          emailAddress: "",
        });
        router.push("/login");
      } else {
        toast("error", "Failed.");
      }
    }
  }, [isForgotPasswordSuccess, isForgotPasswordData]);

  const handleforgotPassword = (e) => {
    e.preventDefault();
    if (isValid()) {
      const request = {
        ...formData,
      };
      forgotPassword(request);
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
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <div className="forgot-password-form__box">
          <h2 className="forgot-password-form__box__title">Forgot Password</h2>
          <p className="forgot-password-form__box__subtitle">
            Enter your registered email address below and we&apos;ll send you a
            link to reset your password.
          </p>
          <span className="forgot-password-form__box__divider"></span>
          <form className="forgot-password-form__box__form">
            <div className="forgot-password-form__box__form_form-field">
              <Input
                type="EMAIL"
                cssClass="forgot-password-form__box__form_form-field_input"
                // onChange={() => { }}
                onChange={handleChange("emailAddress")}
                value={formData.emailAddress}
                placeholder="Email"
                onBlur={() => validation("emailAddress", formData)}
              />
              <ValidationText errorText={validState.error.emailAddress} />
            </div>
            <button
              type="submit"
              className="forgot-password-form__box__form_button"
              onClick={handleforgotPassword}
              disabled={isForgotPasswordLoading}
            >
              Send Reset Password Link
            </button>
            <span className="forgot-password-form__box__form_signup">
              Back to <Link href="/login">Login</Link>
            </span>
          </form>
        </div>
      </div>

      <div className="forgot-password-image">
        <div className="forgot-password-image_mobile-image">
          <Image
            src={AppIcons.MobileImage}
            alt="no-product-found-image"
            width={120}
            height={40}
          />
        </div>
        <div className="forgot-password-image_shape"></div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
