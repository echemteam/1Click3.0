"use client"
import Input from '@components/ui/input/Input'
import { useEffect, useState } from "react"
import "./UpdatePassword.scss"
import Image from 'next/image'
import { AppIcons } from '@utils/AppIcons/AppIcons'
import { useUpdatePasswordMutation } from 'src/redux/serviceApi/authAPI'
import SwalAlert from 'src/services/swal/SwalService'
import { Messages } from '@utils/Messages/Messages'
import { isValidForm, validate } from '@utils/Validations/CommonValidator'
import ValidationText from '@components/Common/validation/validationText'
import Loading from 'src/app/loading'
import { useRouter } from 'next/navigation'
import { removeAllCookies } from "@utils/Cookies/CookieHandler";

const UpdatePassword = () => {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [updatePassword, { isLoading: isUpdatePasswordLoading, isSuccess: isUpdatePasswordSuccess, data: isUpdatePasswordData },] = useUpdatePasswordMutation();
    const [formData, setFormData] = useState({
        NewPassword: "",
        ConfirmPassword: "",
    });

    const [validState, setValidState] = useState({
        isValid: true,
        error: {},
    });

    const validationrule =
    {
        NewPassword: [
            {
                type: "require",
                message: Messages.CommonValidationMessages.FieldRequired.replace(
                    "{0}",
                    "new password"
                ),
            },
            {
                type: "password",
                message: Messages.CommonValidationMessages.PasswordNotValid,
            },
        ],
        ConfirmPassword: [
            {
                type: "require",
                message: Messages.CommonValidationMessages.FieldRequired.replace(
                    "{0}",
                    "confirm password"
                ),
            },
            {
                type: "compare",
                compareEle: "NewPassword",
                message: Messages.CommonValidationMessages.ComparePassword,
            },
        ],
    }

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    useEffect(() => {
        if (isUpdatePasswordSuccess && isUpdatePasswordData) {
            setFormData({
                NewPassword: "",
                ConfirmPassword: "",
            });
            setShowPopup(true);
        }
    }, [isUpdatePasswordData, isUpdatePasswordSuccess]);

    const handleClosePopup = () => {
        setShowPopup(false);
        removeAllCookies();
        router.push("/login");
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
    
            if (isValid()) {
                const request = {
                    ...formData,
                };
                updatePassword(request);
            }
        }
      
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

    return (
        <div className="update-password-container">
            <div className="update-password-form">
                <div className="update-password-form__box">
                    <h2 className="update-password-form__box__title">Update Password</h2>
                    <p className="update-password-form__box__subtitle">
                        Enter your new password below to update your credentials.
                    </p>
                    <span className="update-password-form__box__divider"></span>
                    <form className="update-password-form__box__form">
                        <Input
                            type="password"
                            cssClass="update-password-form__box__form_input"
                            onChange={handleChange('NewPassword')}
                            value={formData.NewPassword}
                            placeholder="New Password"
                            onBlur={() => validation("NewPassword", formData)}
                            minLength={8}
                            maxLength={20}
                        />
                        <ValidationText errorText={validState.error.NewPassword} />
                        <Input
                            type="password"
                            cssClass="update-password-form__box__form_input"
                            onChange={handleChange('ConfirmPassword')}
                            value={formData.ConfirmPassword}
                            placeholder="Confirm Password"
                            onBlur={() => validation("ConfirmPassword", formData)}
                            minLength={8}
                            maxLength={20}
                        />
                        <ValidationText errorText={validState.error.ConfirmPassword} />
                        <button
                            type="submit"
                            className="update-password-form__box__form_button"
                            onClick={handleUpdatePassword}
                        >
                            {isUpdatePasswordLoading ? <Loading /> : "Update Password"}


                        </button>


                    </form>
                </div>
            </div>
            <div className="update-password-image">
                <div className="update-password-image_mobile-image">
                    <Image
                        src={AppIcons.MobileImage}
                        alt="no-product-found-image"
                        width={120}
                        height={40}
                    />
                </div>
            </div>
            {showPopup && (
                <div className="update-password-modal">
                    <div className="update-password-modal__content">
                        <h3>Success!</h3>
                        <p>Your password has been updated. <br />
                            Please log in again.</p>
                        <button
                            className="update-password-modal__button"
                            onClick={handleClosePopup}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default UpdatePassword