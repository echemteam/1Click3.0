'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AppIcons } from '@utils/AppIcons/AppIcons'
import Iconify from '@components/ui/iconify/Iconify'
import Label from '@components/ui/label/Label'
import Input from '@components/ui/input/Input'
import "./ContactUsPage.scss"
import Textarea from '@components/ui/textarea/Textarea'
import Button from '@components/ui/button/Button'
import { useAddContactUsMutation } from 'src/redux/serviceApi/contactUsAPI'
import SwalAlert from 'src/services/swal/SwalService'
import { Messages } from '@utils/Messages/Messages'
import { isValidForm, validate } from '@utils/Validations/CommonValidator'
import ValidationText from '@components/Common/validation/validationText'
import Loading from 'src/app/loading'
import ReCAPTCHA from 'react-google-recaptcha'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css';
import parsePhoneNumberFromString from 'libphonenumber-js'


const ContactUsPage = () => {
  const captchaRef = useRef();
  const siteKey= process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
  const { toast } = SwalAlert();
  const [phoneInputKey, setPhoneInputKey] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    productName: "",
    message: "",
    PhoneCode:""
  });
  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });
  const [isValidateCaptcha,setIsValidateCaptcha]=useState()
  const validationrules =
  {
    name: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "name"
        ),
      },
    ],
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
    companyName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "companyName"
        ),
      },
    ],
    phoneNumber: [
      {
        type: "phoneinput",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "phoneNumber"
        ),
      },
    ],
    productName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "productName"
        ),
      },
    ],
    message: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "message"
        ),
      },
    ],
  }
  const [addContactUs, { isLoading: isAddContactUsLoading, isSuccess: isAddContactUsSuccess, data: isAddContactUsData },] = useAddContactUsMutation();

  const handleContactUsSave = (e) => {
    e.preventDefault();
    if(!isValidateCaptcha){
      toast("warning", "Please verify you are not a robot.");
  }
    if (isValid() && isValidateCaptcha) {
      const phoneNumberObj = parsePhoneNumberFromString(formData.phoneNumber);
      const request = {
        name: formData?.name,
        emailAddress: formData?.email,
        companyName: formData?.companyName,
        phoneNumber: phoneNumberObj.nationalNumber,
        productName: formData?.productName,
        message: formData?.message,
        countryId: 0,
        PhoneCode: phoneNumberObj.countryCallingCode
      }
      addContactUs(request)
    }
  }
  const handleChange = (e) => {

    let { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlePhoneChange = (phone, meta) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: phone,
      PhoneCode: meta?.country?.dialCode || "",
    }));
  };



  useEffect(() => {
   if(!isAddContactUsSuccess) return;
    if (isAddContactUsSuccess && isAddContactUsData)
      if (isAddContactUsData > 0) {
        toast("success", "Contact Detail added successfully");
        if (captchaRef.current) {
          captchaRef.current.reset(); 
        }
        setIsValidateCaptcha();
        setFormData({
          name: "",
          email: "",
          companyName: "",
          phoneNumber: "",
          productName: "",
          message: ""
        })
        setPhoneInputKey(prev => prev + 1);
      } else {
        toast("error", "Failed.");
      }

  }, [isAddContactUsSuccess && isAddContactUsData])

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

  const handleCaptchaChange=(data)=>{
    setIsValidateCaptcha(data)
}

  
  return (
    <div className="contact-us">
      <div className="contact-us__container">
        <div className='contact-us__container__bg-image'>
          <Image src={AppIcons.ContactUsBGImage} alt="contact-us-bg-image" width={0} height={0} />
        </div>
        <div className='contact-us__container__content'>
          <div className="contact-us__container__content__title">
            Contact Us
          </div>
          <div className="contact-us__container__content__text">
            Any question? We would be happy to help you!
          </div>
          <div className='contact-us__container__info'>
            <div className="contact-us__container__info__card">
              <Iconify icon="mdi:phone-outline" width={20} height={20} />
              <div className="contact-us__container__info__card__text">
                +1 888-600-0442
              </div>
            </div>
            <div className="contact-us__container__info__card">
              <Iconify icon="mdi:email-outline" width={20} height={20} />
              <div className="contact-us__container__info__card__text">
                sales@1clickchemistry.com
              </div>
            </div>
            <div className="contact-us__container__info__card">
              <Iconify icon="mdi:email-outline" width={20} height={20} />
              <div className="contact-us__container__info__card__text">
                accounting@1clickchemistry.com
              </div>
            </div>
            <div className="contact-us__container__info__card">
              <Iconify icon="mdi:map-marker-outline" width={20} height={20} />
              <div className="contact-us__container__info__card__text">
                1ClickChemistry, Inc. PO BOX 1638  Allen,TX 75013, USA
              </div>
            </div>
          </div>
          <div className='contact-us__container__divider'></div>
          <form className='contact-us__container__form' onSubmit={handleContactUsSave}>
            <div className='contact-us__container__form__group'>
              <Label label="Name" isRequired={true} />
              <Input
                type="text"
                placeholder="Name"
                name="name"
                maxLength={50}
                value={formData.name}
                onChange={handleChange}
                onBlur={() => validation("name", formData)}
              />
              <ValidationText errorText={validState.error.name} />
            </div>
            <div className='contact-us__container__form__group'>
              <Label label="Email Address" isRequired={true} />
              <Input
                type="email"
                placeholder="Email"
                name="email"
                maxLength={100}
                value={formData.email}
                onChange={handleChange}
                onBlur={() => validation("email", formData)}
              />
              <ValidationText errorText={validState.error.email} />
            </div>
            <div className='contact-us__container__form__group'>
              <Label label="Company Name" isRequired={true} />
              <Input
                type="text"
                placeholder="Company Name"
                name="companyName"
                maxLength={50}
                value={formData.companyName}
                onChange={handleChange}
                onBlur={() => validation("companyName", formData)}
              />
              <ValidationText errorText={validState.error.companyName} />
            </div>
            <div className='contact-us__container__form__group'>
              <Label label="Phone Number" isRequired={true} />
              <PhoneInput
                key={phoneInputKey} 
                defaultCountry="us"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                onBlur={() => validation("phoneNumber", formData)}
                placeholder="Phone Number"
                maxLength={20}
              />
              <ValidationText errorText={validState.error.phoneNumber} />
            </div>
            <div className='contact-us__container__form__group-product'>
              <Label label="Product Name" isRequired={true} />
              <Input
                type="text"
                placeholder="Product Name"
                name="productName"
                maxLength={100}
                value={formData.productName}
                onChange={handleChange}
                onBlur={() => validation("productName", formData)}
              />
              <ValidationText errorText={validState.error.productName} />
            </div>
            <div className='contact-us__container__form__group-message'>
              <Label label="Message" isRequired={true} />
              <Textarea
                placeholder="Message"
                name="message"
                maxLength={1500}
                value={formData.message}
                onChange={handleChange}
                onBlur={() => validation("message", formData)}
              />
              <ValidationText errorText={validState.error.message} />
            </div>
            <div>
                        <ReCAPTCHA
                         sitekey={siteKey}
                        onChange={handleCaptchaChange}
                        ref={captchaRef}
                 />
                        </div>
            <div className='contact-us__container__form__button'>
              <Button type="submit" variant="contained" color="primary" disabled={isAddContactUsLoading}>
                {isAddContactUsLoading ? <Loading /> : "Submit"}
              </Button>
            </div>
          </form>

        </div>
      </div>
      <div className='contact-us__container__footer'>
        <div className='contact-us__container__footer__group'>
          <div className='contact-us__container__footer__group__title'>
            General Inquiries/Support
          </div>
          <div className='contact-us__container__footer__group__text'>
            For general questions or information about our products, please email us at :
          </div>
          <div className='contact-us__container__footer__group__card'>
            <Iconify icon="mdi:email-outline" width={20} height={20} />
            <div className="contact-us__container__footer__group__card__text">
              sales@1clickchemistry.com
            </div>
          </div>
        </div>
        <div className='contact-us__container__footer__group'>
          <div className='contact-us__container__footer__group__title'>
            Phone Support
          </div>
          <div className='contact-us__container__footer__group__text'>
            We encourage you to give us a call. Our friendly team is available to assist you during the following hours :
          </div>
          <div className='contact-us__container__footer__group__hours'>
            <div className='contact-us__container__footer__group__hours__title'>
              Monday - Friday
            </div>
            <div className='contact-us__container__footer__group__hours__text'>
              9:00 AM - 6:00 PM (EST)
            </div>
          </div>
          <div className='contact-us__container__footer__group__card'>
            <Iconify icon="mdi:phone-outline" width={20} height={20} />
            <div className="contact-us__container__footer__group__card__text">
              (+1) 888-600-0442
            </div>
          </div>
          <div className='contact-us__container__footer__group__text'>
            Feel free to call us within these hours. We&apos;re here to help answer your questions and provide the support you need.
          </div>
        </div>
        <div className='contact-us__container__footer__group'>
          <div className='contact-us__container__footer__group__title'>
            Vendor Registration
          </div>
          <div className='contact-us__container__footer__group__text'>
            We are happy to be your vendor. Please send do required documents/forms or links to email below.
          </div>
          <div className='contact-us__container__footer__group__hours'>
            <div className='contact-us__container__footer__group__hours__title'>
              Monday - Friday
            </div>
            <div className='contact-us__container__footer__group__hours__text'>
              9:00 AM - 6:00 PM (EST)
            </div>
          </div>
          <div className='contact-us__container__footer__group__card'>
            <Iconify icon="mdi:email-outline" width={20} height={20} />
            <div className="contact-us__container__footer__group__card__text">
              accounting@1clickchemistry.com
            </div>
          </div>
          <div className='contact-us__container__footer__group__text'>
            Feel free to call us within these hours. We&apos;re here to help answer your questions and provide the support you need.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUsPage