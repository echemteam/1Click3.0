"use client";

import React, { useEffect, useState } from "react";
import "./LoginPage.scss";
import Image from "next/image";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Input from "@components/ui/input/Input";
import Link from "next/link";
import Checkbox from "@components/ui/checkbox/Checkbox";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useUserLoginMutation } from "src/redux/serviceApi/authAPI";
import { authentication } from "src/redux/slice/authSlice";
import Loading from "src/app/loading";
import SwalAlert from "src/services/swal/SwalService";
import { validate, isValidForm } from "@utils/Validations/CommonValidator";
import ValidationText from "@components/Common/validation/validationText";
import { Messages } from "@utils/Messages/Messages";

export function LoginPage() {
  const router = useRouter();
  const { toast } = SwalAlert();
  const dispatch = useDispatch();

  const [userLogin, { isLoading, isSuccess, data: authData }] = useUserLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });

  const [showPopup, setShowPopup] = useState(false);

  const validationrule = {
    email: [
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
    password: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "password"
      ),
      },
    ],
  };

  const handleChange = (e) => {
    let name, value, type;
    if (typeof e === "boolean") {
      name = "rememberMe";
      value = e;
    } else {
      ({ name, value, type } = e.target);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? value : value,
    }));

    setValidState((prev) => ({
      ...prev,
      error: { ...prev.error, [name]: "" },
    }));
  };

  const validation = (key, object) => {
    const validRules = { ...validationrule };
    const vaildStates = { ...validState };
    const returnValidState = validate(key, object, validRules, vaildStates);
    setValidState(returnValidState);
  };

  const isValid = () => {
    const returnValidState = isValidForm(formData, validationrule, validState);
    setValidState(returnValidState);
    return returnValidState.isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    const request = {
      EmailAddress: formData.email,
      Password: formData.password,
    };

    userLogin(request);
  };

  useEffect(() => {
    if (isSuccess && authData) {
      if (authData.isAuthenticated === false) {
        toast("error", authData.message || "An error occurred during login. Please try again.");
      } else if (authData.isResetPassword === false && authData.isAuthenticated) {
        dispatch(authentication(authData));
        toast("success", "User logged in successfully!");
        router.push("/");
      } else if (authData.isResetPassword === true && authData.isAuthenticated) {
        dispatch(authentication(authData));
        setFormData({ email: "", password: "" });
        setShowPopup(true);
      }
    }
  }, [isSuccess, authData]);

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push("/update-password");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-form__box">
          <h2 className="login-form__box__title">Log in to your Account</h2>
          <p className="login-form__box__subtitle">
            Welcome back! Log in to your Account
          </p>
          <span className="login-form__box__divider"></span>
          <form onSubmit={handleLogin} className="login-form__box__form">
            <div  className="login-form__box__form_form-field">
              <Input
                type="email"
                name="email"
                cssClass="login-form__box__form_form-field_input"
                onChange={handleChange}
                onBlur={() => validation("email", formData)}
                value={formData.email}
                placeholder="Email"
              />
              <ValidationText errorText={validState.error.email} />
            </div>
            <div  className="login-form__box__form_form-field">
              <Input
                type="password"
                name="password"
                cssClass="login-form__box__form_form-field_input"
                onChange={handleChange}
                onBlur={() => validation("password", formData)}
                value={formData.password}
                placeholder="Password"
              />
              <ValidationText errorText={validState.error.password} />
            </div>
            <div className="login-form__box__form_form-field_group">
              <label>
                <Checkbox
                  name="rememberMe"
                  label="Remember Me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  color="secondary"
                />
              </label>
              <Link href="/forgot-password" className="login-form__box__form_form-field_forgot-password">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="login-form__box__form_form-field_button"
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : "Log in"}
            </button>
            <span className="login-form__box__form_form-field_signup">
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </span>
          </form>
        </div>
      </div>
      <div className="login-image">
        <div className="login-image_mobile-image">
          <Image
            src={AppIcons.MobileImage}
            alt="no-product-image"
            width={120}
            height={40}
          />
        </div>
        <div className="login-image_shape"></div>
      </div>

      {showPopup && (
        <div className="login-modal">
          <div className="login-modal__content">
            <h3>Welcome!</h3>
            <p>
              You&apos;ve logged in with a temporary password. Please update your password to secure your account.
            </p>
            <button className="login-modal__button" onClick={handleClosePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
