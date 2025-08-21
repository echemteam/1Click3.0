import React, { useEffect, useState } from "react";
import Label from "@components/ui/label/Label";
import Select from "@components/ui/select/Select";
import Input from "@components/ui/input/Input";
import Checkbox from "@components/ui/checkbox/Checkbox";
import Button from "@components/ui/button/Button";
import "./AddEditAddress.scss";
import { useLazyGetAllCitiesQuery, useLazyGetAllCountriesQuery, useLazyGetAllStatesQuery } from 'src/redux/serviceApi/commonAPI';
import { Messages } from '@utils/Messages/Messages';
import ValidationText from '@components/Common/validation/validationText';
import { useAddEditAddressMutation, useLazyGetAddressDetailsByAddressIdQuery, useLazyGetUserAddressByIdQuery, useUSPSAddressValidationMutation } from 'src/redux/serviceApi/addressAPI';
import SwalAlert from 'src/services/swal/SwalService';
import Loading from 'src/app/loading';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidForm, validate } from '@utils/Validations/CommonValidator';
import Iconify from '@components/ui/iconify/Iconify';
import { AddressType } from '@components/Common/Enum/CommonEnum';

const AddEditAddress = ({ editingAddress, onCancel, onSave }) => {
  const { toast, confirm } = SwalAlert();
  const [getShippingAddresses, { data: shippingData, isSuccess: isShippingSuccess, isFetching: isShippingFetching }] = useLazyGetUserAddressByIdQuery();
  const [formData, setFormData] = useState({
    addressTypeId: "",
    addressName: "",
    attandantTo: "",
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    phoneNo: "",
    fax: "",
    isDefault: false,
    country: "",
    state: "",
    city: "",
    PhoneCode: "",
  });
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const [isValidCountry, setIsValidCountry] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState(null);
  const [isCardShow, setCardShow] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [addedAddress, setaddedAddress] = useState(null);
  const [validState, setValidState] = useState({
    isValid: true,
    error: {},
  });
  const [
    uSPSAddressValidation,
    {
      isLoading: isUSPSAddressValidationLoading,
      isSuccess: isUSPSAddressValidationSuccess,
      data: isUSPSAddressValidationData,
    },
  ] = useUSPSAddressValidationMutation();

  const validationrules = {
    addressTypeId: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "Address Type"
        ),
      },
    ],
    addressName: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "Address Name"
        ),
      },
    ],
    attandantTo: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "Attn To"
        ),
      },
    ],
    addressLine1: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "Address Line 1"
        ),
      },
    ],
    zipCode: [
      {
        type: "require",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "Postcode / ZIP"
        ),
      },
      {
        type: "isValidZipCode",
        message: Messages.CommonValidationMessages.zipcodenotValid,
      },
    ],
    phoneNo: [
      {
        type: "phoneinput",
        message: Messages.CommonValidationMessages.FieldRequired.replace(
          "{0}",
          "Phone No"
        ),
      },
    ],
  };

  const [
    getAllCountries,
    {
      isFetching: getAllCountriesFetching,
      isSuccess: getAllCountriesSuccess,
      data: getAllCountriesData,
    },
  ] = useLazyGetAllCountriesQuery();
  const [
    getAllStates,
    {
      isFetching: getAllStatesFetching,
      isSuccess: getAllStatesSuccess,
      data: getAllStatesData,
    },
  ] = useLazyGetAllStatesQuery();
  const [
    getAllCities,
    {
      isFetching: getAllCitiesFetching,
      isSuccess: getAllCitiesSuccess,
      data: getAllCitiesData,
    },
  ] = useLazyGetAllCitiesQuery();
  const [
    addEditAddress,
    {
      isLoading: isAddEditAddressLoading,
      isSuccess: isAddEditAddressSuccess,
      data: isAddEditAddressData,
    },
  ] = useAddEditAddressMutation();
  const [
    getAddressDetailsByAddressId,
    {
      isFetching: isGetAddressDetailsByAddressIdFetching,
      isSuccess: isGetAddressDetailsByAddressIdSuccess,
      data: isGetAddressDetailsByAddressIdData,
    },
  ] = useLazyGetAddressDetailsByAddressIdQuery();

  useEffect(() => {
    if (editingAddress?.addressId) {
      const request = { addressId: editingAddress.addressId };
      getAddressDetailsByAddressId(request);
    }
  }, [editingAddress?.addressId, getAddressDetailsByAddressId]);
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
      if (!formData.country && !editingAddress?.addressId) {
        const defaultCountry = countryList.find(
          (c) => c.label === "United States"
        );
        if (defaultCountry) {
          setFormData((prev) => ({
            ...prev,
            country: defaultCountry.value,
          }));

          // Also fetch states for default country
          getAllStates({ CountryId: defaultCountry.value });
        }
      }
    }
  }, [getAllCountriesFetching, getAllCountriesSuccess, getAllCountriesData]);

  useEffect(() => {
    if (!getAllStatesFetching && getAllStatesSuccess && getAllStatesData) {
      const statesList = getAllStatesData.map((state) => ({
        value: state.stateId,
        label: state.name,
      }));
      setStates(statesList);
    }
  }, [getAllStatesFetching, getAllStatesSuccess, getAllStatesData]);

  useEffect(() => {
    if (!getAllCitiesFetching && getAllCitiesSuccess && getAllCitiesData) {
      const cityList = getAllCitiesData.map((city) => ({
        value: city.cityId,
        label: city.name,
      }));
      setCity(cityList);
    }
  }, [getAllCitiesFetching, getAllCitiesSuccess, getAllCitiesData]);

  useEffect(() => {
    if (
      !isGetAddressDetailsByAddressIdFetching &&
      isGetAddressDetailsByAddressIdSuccess &&
      isGetAddressDetailsByAddressIdData
    ) {
      const phonenumber =
        isGetAddressDetailsByAddressIdData.phoneCode +
        isGetAddressDetailsByAddressIdData.attendantPhoneNo;
      setFormData({
        addressTypeId: isGetAddressDetailsByAddressIdData?.addressTypeId || "",
        addressName: isGetAddressDetailsByAddressIdData?.addressName || "",
        attandantTo: isGetAddressDetailsByAddressIdData?.attendantName || "",
        addressLine1: isGetAddressDetailsByAddressIdData?.addressLine1 || "",
        addressLine2: isGetAddressDetailsByAddressIdData?.addressLine2 || "",
        zipCode: isGetAddressDetailsByAddressIdData?.zipCode || "",
        phoneNo: phonenumber,
        fax: isGetAddressDetailsByAddressIdData?.fax || "",
        isDefault: isGetAddressDetailsByAddressIdData?.isDefault || false,
        country: isGetAddressDetailsByAddressIdData?.countryId || "",
        state: isGetAddressDetailsByAddressIdData?.stateId || "",
        city: isGetAddressDetailsByAddressIdData?.cityId || "",
        //phoneCode: isGetAddressDetailsByAddressIdData?.phoneCode || "",
      });

      if (isGetAddressDetailsByAddressIdData?.countryId) {
        getAllStates({
          CountryId: isGetAddressDetailsByAddressIdData.countryId,
        });
      }

      if (isGetAddressDetailsByAddressIdData?.stateId) {
        getAllCities({ StateId: isGetAddressDetailsByAddressIdData.stateId });
      }
    }
  }, [
    isGetAddressDetailsByAddressIdFetching,
    isGetAddressDetailsByAddressIdSuccess,
    isGetAddressDetailsByAddressIdData,
  ]);

  useEffect(() => {
    const selectedCountryObj = country.find(
      (c) => c.value === formData.country
    );
    const isUS = selectedCountryObj?.label === "United States";

    setIsValidCountry(isUS);
    if (!isUS) {
      setCardShow(false);
    }
  }, [formData.country, country]);

  const Addressestype = [
    { value: 1, label: "Shipping Address" },
    { value: 2, label: "Billing Address" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selectedOption) => {
    const selectedCountryObj = country.find(
      (c) => c.value === selectedOption?.value
    );
    const isUS = selectedCountryObj?.label === "United States";

    setFormData((prev) => ({
      ...prev,
      country: selectedOption?.value,
      countryId: selectedOption?.value,
      state: "",
      city: "",
      PhoneCode: selectedCountryObj?.dialCode,
      phoneNo: selectedCountryObj?.dialCode,
    }));

    setStates([]);
    setCity([]);

    if (selectedOption) {
      getAllStates({ CountryId: selectedOption?.value });
    }

    setIsValidCountry(isUS);
    if (!isUS) {
      setCardShow(false);
    }
  };

  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      state: selectedOption?.value,
      city: "",
    }));
    setCity([]);
    if (selectedOption) {
      getAllCities({ StateId: selectedOption?.value });
    }
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, city: selectedOption.value }));
  };

  const handleCheckboxChange = (e) => {
    let name, value, type;
    if (typeof e === "boolean") {
      name = "isDefault";
      value = e;
    } else {
      ({ name, value, type } = e.target);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? value : value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    const value = selectedOption.value ?? "";
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {

    const data = formData;
    e.preventDefault();
    let localNumber = formData.phoneNo;
    localNumber = localNumber.slice(formData?.PhoneCode.length + 1);
    if (!isValid()) {
      return;
    }
    const checkaddress = async () => {
      if (selectedCard === "valideted") {
        const validaddressrequest = {
          addressTypeId: formData.addressTypeId,
          addressName: formData.addressName,
          attendantName: formData.attandantTo,
          addressLine1: validatedAddress.streetAddress,
          addressLine2: validatedAddress.secondaryAddress ?? "",
          zipCode: validatedAddress.zipCode,
          attendantPhoneNo: localNumber,
          fax: formData.fax,
          isDefault: formData.isDefault,
          countryId: formData.country,
          stateId: formData.state,
          cityId: formData.city,
          phoneCode: formData.PhoneCode,
        };
        if (editingAddress?.addressId) {
          validaddressrequest.addressId = editingAddress.addressId;
        }
        await addEditAddress(validaddressrequest).unwrap();
      } else {
        const request = {
          addressTypeId: formData.addressTypeId,
          addressName: formData.addressName,
          attendantName: formData.attandantTo,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          zipCode: formData.zipCode,
          attendantPhoneNo: localNumber,
          fax: formData.fax,
          isDefault: formData.isDefault,
          countryId: formData.country,
          stateId: formData.state,
          cityId: formData.city,
          phoneCode: formData.PhoneCode,
        };

        if (editingAddress?.addressId) {
          request.addressId = editingAddress.addressId;
        }
        await addEditAddress(request).unwrap();
      }


    };


    if (data.country === 233 && (isEditing ? isAddressChanged : true)) {
      const validationResult = validateAddressBeforeSave(
        data,
        selectedCard,
        validatedAddress
      );

      if (validationResult === false) return;
      if (validationResult === "confirm" || selectedCard === "current") {
        confirm(
          "",
          "Are you sure you want to continue with the current address?",
          "Yes",
          "Cancel"
        ).then((confirmed) => {
          if (confirmed) checkaddress();
        });
        return;
      }
      checkaddress();
    } else {
      checkaddress();
    }

  };

  const resetForm = () => {
    setFormData({
      addressTypeId: "",
      addressName: "",
      attandantTo: "",
      addressLine1: "",
      addressLine2: "",
      zipCode: "",
      phoneNo: "",
      fax: "",
      isDefault: false,
      country: "United States",
      state: "",
      city: "",
    });
  };

  useEffect(() => {
    if (isAddEditAddressSuccess && isAddEditAddressData) {
      if (editingAddress?.addressId) {
        toast("success", "Address updated successfully");
      } else {
        toast("success", "Address added successfully");
      }
      resetForm();
      onSave();
      getShippingAddresses({ AddressTypeId: formData.addressTypeId });
    }
  }, [isAddEditAddressSuccess, isAddEditAddressData]);

  const getSelectedOption = (list, value) =>
    list.find((item) => item.value === value) || null;

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

  const handlePhoneChange = (phone, meta) => {
    setFormData((prev) => ({
      ...prev,
      phoneNo: phone,
      PhoneCode: meta?.country?.dialCode || "",
    }));
  };

  const getStateCode = (fullState) => {
    const lastSpaceIndex = fullState?.lastIndexOf(" ");
    if (lastSpaceIndex === -1) return fullState; // fallback if no space
    return fullState?.substring(lastSpaceIndex + 1);
  };

  const handleCheckValidAddress = () => {
    const data = formData;
    const cities = getSelectedOption(city, data?.city);
    data && setaddedAddress(data);
    const state = getSelectedOption(states, data?.state);

    if (data?.addressLine1 && cities && data?.zipCode && states) {
      const request = {
        addressId: 0,
        streetAddress: data.addressLine1,
        city: cities.label,
        state: getStateCode(state?.label),
        zIPCode: data.zipCode,
        secondaryAddress: data?.addressLine2,
        zIPPlus4: null,
      };
      uSPSAddressValidation(request);
    }
  };

  useEffect(() => {
    if (isUSPSAddressValidationSuccess && isUSPSAddressValidationData) {
      setValidatedAddress(isUSPSAddressValidationData);
      setCardShow(true);
    }
  }, [isUSPSAddressValidationSuccess, isUSPSAddressValidationData]);
  const isDifferent = (current, validated) => {
    const currentStr = (current ?? "").toString().trim();
    const validatedStr = (validated ?? "").toString().trim();
    return currentStr !== validatedStr;
  };

  const renderValidatedAddressSection = () => {
    return validatedAddress.isSuccess === true ? (
      <div>
        <div className="card-header">
          <h5>Validated Address</h5>
          <span className="verified-badge">Verified</span>
          {selectedCard === "validated" && (
            <Iconify icon="mdi:check-circle" className="check-icon" />
          )}
        </div>
        <div className="address-card">
          <span
            className={`label-txt ${isDifferent(
              addedAddress?.addressLine1,
              validatedAddress?.streetAddress
            )
              ? "highlight-diff"
              : ""
              }`}
          >
            {validatedAddress?.streetAddress}
          </span>
          {validatedAddress?.secondaryAddress && (
            <>
              <span
                className={`label-txt ${isDifferent(
                  addedAddress?.addressLine2,
                  validatedAddress?.secondaryAddress
                )
                  ? "highlight-diff"
                  : ""
                  }`}
              >
                {validatedAddress?.secondaryAddress}
              </span>
            </>
          )}
          <span className="label-txt">
            <span
              className={
                isDifferent(city, validatedAddress?.city)
                  ? "highlight-diff"
                  : ""
              }
            >
              {validatedAddress?.city}
            </span>
            ,{" "}
            <span
              className={
                isDifferent(
                  getStateCode(states?.label),
                  validatedAddress?.state
                )
                  ? "highlight-diff"
                  : ""
              }
            >
              {validatedAddress?.state}
            </span>{" "}
            <span
              className={
                isDifferent(addedAddress?.zipCode, validatedAddress?.zipCode)
                  ? "highlight-diff"
                  : ""
              }
            >
              {validatedAddress?.zipCode}
            </span>
          </span>
          <span
            className={`label-txt ${isDifferent(addedAddress?.countryName, validatedAddress?.country)
              ? "highlight-diff"
              : ""
              }`}
          >
            {validatedAddress?.country}
          </span>
        </div>
      </div>
    ) : (
      <div className="validate-address-error">
        <div>
          <strong>Address Validation Failed</strong>
          <p></p>
        </div>
      </div>
    );
  };

  const handleSelectClick = (cardType) => {
    setSelectedCard(cardType);
  };
  const validateAddressBeforeSave = (data, selectedCard, validatedAddress) => {
    if (!validatedAddress) {
      toast("error", "Please validate the address before saving.");
      return false;
    }
    if (data.country === 233) {
      if (!selectedCard) {
        toast(
          "error",
          "Please select either the current or validated address."
        );
        return false;
      }
      if (selectedCard === "current") {
        return "confirm";
      }

      // if ( validatedAddress.isSuccess === false) {
      //   toast("error", "Please select another address.");
      //   return false;
      // }
    }
    return true;
  };

  const isEditing = Boolean(editingAddress?.addressId); // or whatever variable indicates edit mode

  const isAddressChanged =
    formData.addressLine1 !==
    isGetAddressDetailsByAddressIdData?.addressLine1 ||
    formData.addressLine2 !==
    isGetAddressDetailsByAddressIdData?.addressLine2 ||
    formData.zipCode !== isGetAddressDetailsByAddressIdData?.zipCode ||
    formData.state !== isGetAddressDetailsByAddressIdData?.stateId ||
    formData.city !== isGetAddressDetailsByAddressIdData?.cityId;

  return (
    <div className="add-edit-address">
      <div className="add-address-container_form-container">
        <form
          className="add-address-container_form-container_form"
          onSubmit={handleSave}
        >
          <div className="add-address-container_form-container_form_group">
            <Label label="Address Type" isRequired={true} />
            <Select
              options={Addressestype}
              placeholder="Address Type"
              value={formData.addressTypeId}
              // value={Addressestype.find((item) => item.value === parseInt(formData.addressTypeId)) || null}
              onChange={(selected) =>
                handleSelectChange("addressTypeId", selected)
              }
              onBlur={() =>
                validation("addressTypeId", {
                  addressTypeId: formData.addressTypeId,
                })
              }
            />
            <ValidationText errorText={validState.error.addressTypeId} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Address Name" isRequired={true} />
            <Input
              type="text"
              name="addressName"
              placeholder="Address Name"
              value={formData.addressName}
              onChange={handleInputChange}
              onBlur={() =>
                validation("addressName", { addressName: formData.addressName })
              }
              maxLength={100}
            />
            <ValidationText errorText={validState.error.addressName} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Attn To" isRequired={true} />
            <Input
              type="text"
              name="attandantTo"
              placeholder="Attn To"
              value={formData.attandantTo}
              onChange={handleInputChange}
              onBlur={() =>
                validation("attandantTo", { attandantTo: formData.attandantTo })
              }
              maxLength={100}
            />
            <ValidationText errorText={validState.error.attandantTo} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Address Line 1" isRequired={true} />
            <Input
              type="text"
              placeholder="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              onBlur={() =>
                validation("addressLine1", {
                  addressLine1: formData.addressLine1,
                })
              }
              maxLength={150}
            />
            <ValidationText errorText={validState.error.addressLine1} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Address Line 2" />
            <Input
              type="text"
              placeholder="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              maxLength={150}
            />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Country" isRequired={true} />
            <Select
              options={country}
              placeholder="Country"
              value={formData.country}
              onChange={handleCountryChange}
              isSearchable={false}
            />
            <ValidationText errorText={validState.error.country} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="State" isRequired={true} />
            <Select
              options={states}
              placeholder="State"
              value={formData.state}
              onChange={handleStateChange}
              disabled={!formData.country}
              isSearchable={false}
            />
            <ValidationText errorText={validState.error.state} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Town / City" isRequired={true} />
            <Select
              options={city}
              placeholder="City"
              value={formData.city}
              onChange={handleCityChange}
              disabled={!formData.state}
              isSearchable={false}
            />
            <ValidationText errorText={validState.error.city} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Postcode / ZIP" isRequired={true} />
            <Input
              type="text"
              placeholder="Postcode / ZIP"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              onBlur={() => validation("zipCode", formData)}
              maxLength={10}
            />
            <ValidationText errorText={validState.error.zipCode} />
          </div>
          <div className="add-address-container_form-container_form_group">
            <Label label="Phone No" isRequired={true} />
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
          <div className="add-address-container_form-container_form_group">
            <Label label="Fax" />
            <Input
              type="text"
              placeholder="Fax"
              name="fax"
              value={formData.fax}
              onChange={handleInputChange}
              maxLength={20}
            />
          </div>
          <div className="add-address-container_form-container_form_group-full">
            <Checkbox
              name="isDefault"
              label="Is Default Address"
              checked={formData.isDefault}
              onChange={handleCheckboxChange}
            />
          </div>

          {isValidCountry && (isEditing ? isAddressChanged : true) && (
            <div className="address-validation-wrapper">
              <Button
                type="button"
                className="theme-button"
                onClick={handleCheckValidAddress}
                loading={isUSPSAddressValidationLoading}
              >
                Check Valid Address
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5px",
                  flexDirection: "row-reverse",
                  gap: "1rem",
                }}
              >
                {validatedAddress?.isSuccess === false && (
                  <div className="validate-address-error mt-3">
                    <div>
                      <strong>Address Validation Failed</strong>
                      <p>
                        {validatedAddress?.errorMessage ||
                          "Unable to validate address. Please check the information and try again."}
                      </p>
                    </div>
                  </div>
                )}

                {isCardShow && (
                  < >
                    <div
                      className={`address-card-container ${selectedCard === "current" ? "selected" : ""
                        }`}
                      onClick={() => handleSelectClick("current")}
                    >
                      <div className="card-header">
                        <h5>Current Address</h5>
                        {selectedCard === "current" && (
                          <Iconify
                            icon="mdi:check-circle"
                            className="check-icon"
                          />
                        )}
                      </div>
                      {/* <div className="address-card">
                      <span className="label-txt">{addedAddress?.addressLine1}</span>
                      {addedAddress?.addressLine2 && (
                        <>
                          <span className="label-txt">{addedAddress?.addressLine2}</span>
                        </>
                      )}
                      <span className="label-txt">
                          {getSelectedOption(city, formData.city)?.label},{" "}, {getStateCode(states?.label) || getStateCode(states.name)}{' '}
                        {addedAddress?.zipCode}
                      </span>
                      <span className="label-txt">{addedAddress?.countryName}</span>
                    </div> */}

                      <div className="address-card">
                        <span className="label-txt">
                          {addedAddress?.addressLine1}
                        </span>
                        {addedAddress?.addressLine2 && (
                          <span className="label-txt">
                            {addedAddress?.addressLine2}
                          </span>
                        )}
                        <span className="label-txt">
                          {getSelectedOption(city, formData.city)?.label},{" "}
                          {getStateCode(
                            getSelectedOption(states, formData.state)?.label
                          )}{" "}
                          {addedAddress?.zipCode}
                        </span>
                        <span className="label-txt">
                          {getSelectedOption(country, formData.country)?.label}
                        </span>
                      </div>
                    </div>

                    {/* Only show validated card if validation succeeded */}
                    {validatedAddress?.isSuccess === true && (
                      <div
                        className={`address-card-container ${selectedCard === "validated"
                          ? "selected validated"
                          : ""
                          }`}
                        onClick={() => handleSelectClick("validated")}
                      >
                        {renderValidatedAddressSection()}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          <div className="add-address-container_form-container_form_group-full">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isAddEditAddressLoading}
            >
              {isAddEditAddressLoading ? <Loading /> : "Save"}
            </Button>
            <Button variant="contained" color="secondary" onClick={onCancel} type="button">
              Cancel
            </Button>

          </div>
        </form>

      </div>
    </div>
  );
};
export default AddEditAddress;
