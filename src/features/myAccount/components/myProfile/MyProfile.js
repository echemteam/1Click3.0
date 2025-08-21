import React, { useState, useEffect } from "react";
import "./MyProfile.scss";
import Label from "@components/ui/label/Label";
import Input from "@components/ui/input/Input";
import Select from "@components/ui/select/Select";
import Button from "@components/ui/button/Button";
import { useLazyGetUserByIdQuery } from "src/redux/serviceApi/userAPI";
import { useUpdateUserPasswordMutation } from "src/redux/serviceApi/authAPI";
import { useUpdateUserMutation } from "src/redux/serviceApi/userAPI";
import { getAuthProps, isAuthorized } from "src/lib/authenticationLibrary";
import SwalAlert from "src/services/swal/SwalService";
import { Messages } from "@utils/Messages/Messages";
import { isValidForm, validate } from "@utils/Validations/CommonValidator";
import ValidationText from '@components/Common/validation/validationText'
import Loading from "src/app/loading";
import { useLazyGetAllCountriesQuery } from "src/redux/serviceApi/commonAPI";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const MyProfile = () => {
  const { toast, error } = SwalAlert();
  const userId = isAuthorized() ? getAuthProps().userId : 0;
  const [getUserById, { isSuccess: isGetUserByIdSuccess, data: isGetUserByIdData },] = useLazyGetUserByIdQuery();
  const [updateUser, { isLoading: isUpdateUserLoading, isSuccess: isUpdateUserSuccess, data: isUpdateUserData },] = useUpdateUserMutation();
  const [getAllCountries, { isFetching: getAllCountriesFetching, isSuccess: getAllCountriesSuccess, data: getAllCountriesData }] = useLazyGetAllCountriesQuery();
  const [updateUserPassword, { isLoading: isUpdateUserPasswordLoding, isSuccess: isUpdateUserPasswordSuccess, data: isUpdateUserPasswordData }] = useUpdateUserPasswordMutation();
  const list = [
    { value: 1, label: "USA" },
    { value: 2, label: "India" },
    { value: 3, label: "UK" },
  ];
  useEffect(() => {
    if (userId) {
      getUserById(userId);
    }
  }, [userId]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryId: '',
    companyName: '',
    phoneNo: '',
    emailAddress: '',
    designation: '',
    PhoneCode: '',
  });
  const [country, setCountry] = useState([]);

  const [UpdatePassword, setUpdatePassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });

  const [validUpdatepasswordState, setValidUpdatepasswordState] = useState({
    isValid: true,
    error: {},
  });

  const validationruleforuserdetails =
  {
    firstName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "firstName"
        ),
      },
    ],
    lastName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "lastName"
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
    designation: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "designation"
        ),
      },
    ],
    phoneNo: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "phoneNo"
        ),
      },
      {
        type: "number",
        message: Messages.CommonValidationMessages.FieldRequired.replace("{0}", "valid attendant phone no."),
      },
      {
        type: 'minLength',
        message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', '7 digit phone number'),
        minLength: 7
      }
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
  }
  const validateruleforupdatepassword =
  {
    oldPassword: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "oldPassword"
        ),
      },
      {
        type: "password",
        message: Messages.CommonValidationMessages.PasswordNotValid,
      },
    ],
    newPassword: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "newPassword"
        ),
      },
      {
        type: "password",
        message: Messages.CommonValidationMessages.PasswordNotValid,
      },
    ],
    confirmPassword: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "repeatNewPassword"
        ),
      },
      {
        type: "compare",
        compareEle: "newPassword",
        message: Messages.CommonValidationMessages.ComparePassword,
      },
    ],
  }

  const handlePhoneChange = (phone, meta) => {
    setFormData((prev) => ({
      ...prev,
      phoneNo: phone,
      PhoneCode: meta?.country?.dialCode || "",
    }));
  };

  const fullname = `${formData.firstName} ${formData.lastName}`.trim();
  useEffect(() => {
    if (isGetUserByIdSuccess && isGetUserByIdData) {
      const phonenumber = isGetUserByIdData.phoneCode + isGetUserByIdData.phoneNo;
      setFormData({
        firstName: isGetUserByIdData.firstName || '',
        lastName: isGetUserByIdData.lastName || '',
        countryId: isGetUserByIdData.countryId || '',
        companyName: isGetUserByIdData.companyName || '',
        phoneNo: phonenumber,
        emailAddress: isGetUserByIdData.emailAddress || '',
        designation: isGetUserByIdData.designation || '',
      });
    }
  }, [isGetUserByIdSuccess, isGetUserByIdData]);

  useEffect(() => {
    if (isUpdateUserSuccess && isUpdateUserData) {
      toast("success", "UserDetails Updated Sucsessfully.");
    }
  }, [isUpdateUserData, isUpdateUserSuccess]);

  useEffect(() => {
    if (isUpdateUserPasswordSuccess && isUpdateUserPasswordData) {
      if (isUpdateUserPasswordData === -1) {
        error(Messages.CommonErrorMessages.oldpassword.replace("{0}", "OldPassword"))
      }
      else {
        toast("success", "Password Updated Sucsessfully.");
        setUpdatePassword({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    }
  }, [isUpdateUserPasswordData, isUpdateUserPasswordSuccess]);

  useEffect(() => {
    getAllCountries();
  }, [])

  useEffect(() => {
    if (!getAllCountriesFetching && getAllCountriesSuccess && getAllCountriesData) {
      const countryList = getAllCountriesData.map((country) => ({
        value: country.countryId,
        label: country.countryName,
        dialCode: `+${country.phoneCode}`,
      }));
      setCountry(countryList);
    }
  }, [getAllCountriesFetching, getAllCountriesSuccess, getAllCountriesData]);



  const isValidUserdetails = () => {
    const returnValidState = isValidForm(formData, validationruleforuserdetails, validState);
    setValidState(returnValidState);
    return returnValidState.isValid;
  };

  const isvalidupdatepassword = () => {
    const returnValidState = isValidForm(UpdatePassword, validateruleforupdatepassword, validUpdatepasswordState);
    setValidUpdatepasswordState(returnValidState);
    return returnValidState.isValid;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleinputUpdatePassword = (e) => {
    const { name, value } = e.target;
    setUpdatePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (selectedValue) => {
    const selectedCountry = country.find(c => c.value === selectedValue);
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        countryId: selectedCountry.value,
        PhoneCode: selectedCountry.dialCode,
        phoneNo: selectedCountry.dialCode,
      }));
    }
  };

  const handleupdate = (e) => {
    e.preventDefault();


    if (isValidUserdetails()) {
      let localNumber = formData.phoneNo;
      localNumber = localNumber.slice(formData.PhoneCode.length + 1);
      let request = {
        ...formData,
        UserId: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        countryId: formData.countryId,
        companyName: formData.companyName,
        phoneNo: localNumber,
        emailAddress: formData.emailAddress,
        designation: formData.designation,
        phoneCode: formData.PhoneCode,
      };
      updateUser(request);
    }
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (isvalidupdatepassword()) {
      let request = {
        ...UpdatePassword,
        oldPassword: UpdatePassword.oldPassword,
        newPassword: UpdatePassword.newPassword,
        confirmPassword: UpdatePassword.confirmPassword,
        emailAddress: formData.emailAddress,
      };
      updateUserPassword(request);
    }
  }



  const validation = (key, object) => {
    const validRules = { ...validationruleforuserdetails };
    const vaildStates = { ...validState };
    const returnValidState = validate(key, object, validRules, vaildStates);
    setValidState(returnValidState);
  };

  const validationUpdatePassword = (key, object) => {
    const validRules = { ...validateruleforupdatepassword };
    const vaildStates = { ...validUpdatepasswordState };
    const returnValidState = validate(key, object, validRules, vaildStates);
    setValidUpdatepasswordState(returnValidState);
  };



  return (
    <div className="myprofile-container">
      <div className="myprofile-container_main-container">
        <h2 className="myprofile-container_main-container_title">My Profile</h2>
        <form className="myprofile-container_main-container_edit-profile-form" onSubmit={handleupdate}>
          <div className="myprofile-container_main-container_edit-profile-form_group">
            <Label label="First Name" isRequired={true} />
            <Input
              type="text"
              placeholder="First Name"
              name="firstName"
              maxLength={50}
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={() => validation("firstName", formData)}
            />
            <ValidationText errorText={validState.error.firstName} />
          </div>
          <div className="myprofile-container_main-container_edit-profile-form_group">
            <Label label="Last Name" isRequired={true} />
            <Input
              type="text"
              placeholder="Last Name"
              name="lastName"
              maxLength={50}
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={() => validation("lastName", formData)}
            />
            <ValidationText errorText={validState.error.lastName} />
          </div>
          <div className="myprofile-container_main-container_edit-profile-form_group">
            <Label label="Email Address" isRequired={true} />
            <Input
              type="text"
              placeholder="Email Address"
              name="emailAddress"
              isdisable="true"
              maxLength={200}
              value={formData.emailAddress}
              onChange={handleInputChange}
            />
          </div>
          <div className="myprofile-container_main-container_edit-profile-form_group">
            <Label label="User Display Name" isRequired={true} />
            <Input
              type="text"
              placeholder="User Display Name"
              isdisable="true"
              name="User Display Name"
              maxLength={101}
              value={fullname}
            />
          </div>
          <div className="myprofile-container_main-container_edit-profile-form_full-group">
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="Country" isRequired={true} />
              <Select
                options={country}
                placeholder="Country"
                value={formData.countryId}
                onChange={handleDropdownChange}
                isSearchable={false}
              />
              {/* <ValidationText errorText={validState.error.countryId} /> */}
            </div>
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="Company Name" isRequired={true} />
              <Input
                type="text"
                placeholder="Company Name"
                name="companyName"
                maxLength={200}
                value={formData.companyName}
                onChange={handleInputChange}
                onBlur={() => validation("companyName", formData)}
              />
              <ValidationText errorText={validState.error.companyName} />
            </div>
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="Phone Number " isRequired={true} />
              <PhoneInput
                defaultCountry="us"
                value={formData.phoneNo}
                onChange={handlePhoneChange}
                onBlur={() => validation("phoneNo", formData)}
                placeholder="Phone Number"
                maxLength={20}
              />
              <ValidationText errorText={validState.error.phoneNo} />
            </div>
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="Designation " isRequired={true} />
              <Input
                type="text"
                placeholder="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                onBlur={() => validation("designation", formData)}
              />
              <ValidationText errorText={validState.error.designation} />
            </div>
          </div>

          <div className="myprofile-container_main-container_edit-profile-form_full-group">
            <div className="save-btn">
              <Button variant="contained" color="primary" disabled={isUpdateUserLoading}>
                {isUpdateUserLoading ? <Loading /> : "SAVE"}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="myprofile-container_main-container">
        <h2 className="myprofile-container_main-container_title">
          Password & Security
        </h2>
        <form className="myprofile-container_main-container_edit-profile-form" onSubmit={handleUpdatePassword} >
          <div className="myprofile-container_main-container_edit-profile-form_full-group">
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="Old Password" isRequired={true} />
              <Input
                type="password"
                placeholder="Old Password"
                name="oldPassword"
                minLength={8}
                maxLength={20}
                value={UpdatePassword.oldPassword}
                onChange={handleinputUpdatePassword}
                onBlur={() => validationUpdatePassword("oldPassword", UpdatePassword)}
              />
              <ValidationText errorText={validUpdatepasswordState.error.oldPassword} />
            </div>
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="New Password" isRequired={true} />
              <Input
                type="password"
                placeholder="New Password"
                name="newPassword"
                minLength={8}
                maxLength={20}
                value={UpdatePassword.newPassword}
                onChange={handleinputUpdatePassword}
                onBlur={() => validationUpdatePassword("newPassword", UpdatePassword)}
              />
              <ValidationText errorText={validUpdatepasswordState.error.newPassword} />
            </div>
            <div className="myprofile-container_main-container_edit-profile-form_group">
              <Label label="Repeat New Password" isRequired={true} />
              <Input
                type="password"
                placeholder="Repeat New Password"
                name="confirmPassword"
                minLength={8}
                maxLength={20}
                value={UpdatePassword.confirmPassword}
                onChange={handleinputUpdatePassword}
                onBlur={() => validationUpdatePassword("confirmPassword", UpdatePassword)}
              />
              <ValidationText errorText={validUpdatepasswordState.error.confirmPassword} />
            </div>
          </div>
          <div className="myprofile-container_main-container_edit-profile-form_full-group">
            <div className="save-btn">
              <Button variant="contained" color="primary" disabled={isUpdateUserPasswordLoding}>
                {isUpdateUserLoading ? <Loading /> : " UPDATE PASSWORD"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
