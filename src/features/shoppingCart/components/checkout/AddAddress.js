import React, { useState, useEffect } from 'react';
import Label from '@components/ui/label/Label';
import Input from '@components/ui/input/Input';
import Button from '@components/ui/button/Button';
import Select from '@components/ui/select/Select';
import { useAddEditAddressMutation } from 'src/redux/serviceApi/addressAPI';
import SwalAlert from 'src/services/swal/SwalService';
import ValidationText from '@components/Common/validation/validationText';
import { Messages } from '@utils/Messages/Messages';
import { isValidForm, validate } from '@utils/Validations/CommonValidator';
import { useLazyGetAllCitiesQuery, useLazyGetAllCountriesQuery, useLazyGetAllStatesQuery } from 'src/redux/serviceApi/commonAPI';

const AddAddress = ({ onClose, addressTypeId, getShippingAddresses }) => {
    const { toast } = SwalAlert();
    const [addEditAddress, { isSuccess: isSuccessaddEditAddress, data: isDataaddEditAddress }] = useAddEditAddressMutation();
    const [getAllCountries, { isFetching: getAllCountriesFetching, isSuccess: getAllCountriesSuccess, data: getAllCountriesData }] = useLazyGetAllCountriesQuery();
    const [getAllStates, { isFetching: getAllStatesFetching, isSuccess: getAllStatesSuccess, data: getAllStatesData }] = useLazyGetAllStatesQuery();
    const [getAllCities, { isFetching: getAllCitiesFetching, isSuccess: getAllCitiesSuccess, data: getAllCitiesData }] = useLazyGetAllCitiesQuery();
    const [formData, setFormData] = useState({
        addressId: 0,
        addressName: '',
        attendantName: '',
        attendantPhoneNo: '',
        country: "",
        state: "",
        city: "",
        zipCode: '',
        landmark: '',
        addressLine1: '',
        addressLine2: '',
        fax: '',
        isDefault: false,
        phonecode: '',
    });
    const [validState, setValidState] = useState({ isValid: true, error: {} });

    const validationRules = {
        addressName: [
            {
                type: 'require',
                message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'Address Name'),
            },
        ],
        addressLine1: [
            {
                type: 'require',
                message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'Address Line 1'),
            },
        ],
        attendantName: [
            {
                type: 'require',
                message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'Attend To'),
            },
        ],
        attendantPhoneNo: [
            {
                type: 'require',
                message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'Phone No'),
            },
            // {
            //     type: 'minLength',
            //     minLength: 7,
            //     message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', '7 digit phone number'),
            // },
        ],
        // countryId: [
        //     {
        //         type: 'require',
        //         message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'Country'),
        //     },
        // ],
        // stateId: [
        //     {
        //         type: 'require',
        //         message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'State'),
        //     },
        // ],
        // cityId: [
        //     {
        //         type: 'require',
        //         message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'City'),
        //     },
        // ],
        zipCode: [
            {
                type: 'require',
                message: Messages.CommonValidationMessages.FieldRequired.replace('{0}', 'ZIP Code'),
            },
            {
                type: 'isValidZipCode',
                message: Messages.CommonValidationMessages.zipcodenotValid, 
              }
        ],
    };

    const isValid = () => {
        const returnValidState = isValidForm(formData, validationRules, validState);
        setValidState(returnValidState);
        return returnValidState.isValid;
    };
    const validation = (key, object) => {
        const validRules = { ...validationRules };
        const vaildStates = { ...validState };
        const returnValidState = validate(key, object, validRules, vaildStates);
        setValidState(returnValidState);
    };


    useEffect(() => {
        getAllCountries();
    }, [])

    const [country, setCountry] = useState([]);
    const [states, setStates] = useState([]);
    const [city, setCity] = useState([]);

    useEffect(() => {
        if (!getAllCountriesFetching && getAllCountriesSuccess && getAllCountriesData) {
            const countryList = getAllCountriesData.map((country) => ({
                value: country.countryId,
                label: country.countryName,
            }));
            setCountry(countryList);
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
        if (isSuccessaddEditAddress && isDataaddEditAddress) {
            if (isDataaddEditAddress) {
                toast('success', 'Address details added');
                onClose?.();
                getShippingAddresses({ AddressTypeId: addressTypeId });

            }
        }
    }, [isSuccessaddEditAddress, isDataaddEditAddress]);

    const handleCountryChange = (selected) => {
        setFormData(prev => ({
            ...prev,
            country: selected?.value,
            countryId: selected?.value,
            state: null,
            city: null,
        }));
        setStates([]);
        setCity([]);
        if (selected) getAllStates({ CountryId: selected?.value });
    };

    const handleStateChange = (selected) => {
        setFormData(prev => ({
            ...prev,
            state: selected?.value,
            city: null,
        }));
        setCity([]);
        if (selected) getAllCities({ StateId: selected?.value });
    };

    const handleCityChange = (selected) => {
        setFormData(prev => ({
            ...prev,
            city: selected?.value,
        }));
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = () => {
        if (!isValid()) return;
        const request = {
            ...formData,
            countryId: Number(formData.country),
            stateId: Number(formData.state),
            cityId: Number(formData.city),
            addressTypeId: addressTypeId
        };
        addEditAddress(request);

    };

    return (
        <div className='addeditcarddetails-container'>
            <div className='addeditcarddetails-container_form'>
                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Address Name" isRequired />
                    <Input
                        name="addressName"
                        placeholder="Address Name"
                        value={formData.addressName}
                        onBlur={() => validation("addressName", formData)}
                        onChange={handleChange}
                    />
                    <ValidationText errorText={validState.error.addressName} />
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Attend To" isRequired />
                    <Input
                        name="attendantName"
                        placeholder="Attend To"
                        value={formData.attendantName}
                        onBlur={() => validation("attendantName", formData)}
                        onChange={handleChange}
                    />
                    <ValidationText errorText={validState.error.attendantName} />
                </div>



                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Address Line 1" isRequired />
                    <Input
                        name="addressLine1"
                        placeholder="Address Line 1"
                        value={formData.addressLine1}
                        onBlur={() => validation("addressLine1", formData)}
                        onChange={handleChange}
                    />
                    <ValidationText errorText={validState.error.addressLine1} />
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Address Line 2" />
                    <Input
                        name="addressLine2"
                        placeholder="Address Line 2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                    />
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Country" isRequired={true} />
                    <Select options={country} value={formData.country} onChange={handleCountryChange}  
                    // onBlur={() => validation("country", formData)} 
                    />
                    {/* <ValidationText errorText={validState.error.country}  */}
                    {/* /> */}
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="State" isRequired={true} />
                    <Select options={states} value={formData.state} onChange={handleStateChange} 
                    // onBlur={() => validation("city", formData)}
                    />
                    {/* <ValidationText errorText={validState.error.state}  */}
                    {/* /> */}
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Town / City" isRequired={true} />
                    <Select options={city} value={formData.city} onChange={handleCityChange} 
                    // onBlur={() => validation("city", formData.city)}
                    />
                    {/* <ValidationText errorText={validState.error.city} /> */}
                </div>


                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Postcode / ZIP" isRequired />
                    <Input
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onBlur={() => validation("zipCode", formData)}
                        onChange={handleChange}
                        maxLength ={10}
                    />
                    <ValidationText errorText={validState.error.zipCode} />
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Phone No" isRequired />
                    <Input
                        name="attendantPhoneNo"
                        type="number"
                        maxLength={15}
                        placeholder="Phone No"
                        value={formData.attendantPhoneNo}
                        onBlur={() => validation("attendantPhoneNo", formData)}
                        onChange={handleChange}
                    />
                    <ValidationText errorText={validState.error.attendantPhoneNo} />
                </div>

                <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Fax" />
                    <Input
                        name="fax"
                        placeholder="Fax"
                        value={formData.fax}
                        onChange={handleChange}
                    />
                </div>

                {/* <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Landmark" />
                    <Input
                        name="landmark"
                        placeholder="Landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                    />
                </div> */}

                {/* <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Is Default" />
                    <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                    />
                </div> */}

                {/* <div className="myprofile-container_main-container_edit-profile-form_group">
                    <Label label="Phone Code" />
                    <Input
                        name="phonecode"
                        placeholder="Phone Code"
                        value={formData.phonecode}
                        onChange={handleChange}
                    />
                </div> */}

                <div className='addeditcarddetails-container_form_actions'>
                    <Button variant="outlined" color="primary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>



    );
};

export default AddAddress;
