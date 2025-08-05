import React, { useEffect, useState } from "react";
import "./Addresses.scss";
import Button from "@components/ui/button/Button";
import AddEditAddress from "./components/addEditAddress/AddEditAddress";
import IconButton from "@components/ui/iconButton/IconButton";
import {
  useDeleteAddressMutation,
  useLazyGetAddressListByUserIdQuery,
} from "src/redux/serviceApi/addressAPI";
import SwalAlert from "src/services/swal/SwalService";
import Iconify from "@components/ui/iconify/Iconify";
import { useSelector } from "react-redux";

const Addresses = () => {
  const { toast, confirm } = SwalAlert();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = add, object = edit
  const [addresses, setAddresses] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const isAuthenticated = useSelector(state => state.auth.userId);

  const [
    getAddressListByUserId,
    {
      isFetching: isGetAddressListByUserIdFetching,
      isSuccess: isGetAddressListByUserIdSuccess,
      data: isGetAddressListByUserIdData,
    },
  ] = useLazyGetAddressListByUserIdQuery();
  const [
    deleteAddress,
    { isSuccess: isDeleteAddressSuccess, data: isDeleteAddressData },
  ] = useDeleteAddressMutation();

  useEffect(() => {
    if(isAuthenticated){
      const request = {
        userId : isAuthenticated
      }
      getAddressListByUserId(request);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !isGetAddressListByUserIdFetching &&
      isGetAddressListByUserIdSuccess &&
      isGetAddressListByUserIdData
    ) {
      if (isGetAddressListByUserIdData) {
        setAddresses(isGetAddressListByUserIdData);
      }
    }
  }, [
    isGetAddressListByUserIdFetching,
    isGetAddressListByUserIdSuccess,
    isGetAddressListByUserIdData,
  ]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setIsEdit(false);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingAddress(null);
    getAddressListByUserId();
  };
  
  const handleDelete = (id) => {
    confirm(
      "Delete Address?",
      "Are you sure you want to delete this address?",
      "Yes, Delete",
      "Cancel",
      true
    ).then((result) => {
      if (result) {
      const request = {
        addressId: id,
      };
      deleteAddress(request);
    }})
  };

  useEffect(() => {
    if (isDeleteAddressSuccess && isDeleteAddressData) {
      if (isDeleteAddressData > 0) {
        toast("success", "Address deleted successfully");
        getAddressListByUserId();
      } else {
        toast("error", "Failed.");
      }
    }
  }, [isDeleteAddressSuccess, isDeleteAddressData]);

  return (
    <div className="add-address-container">
      <div className="add-title-sec">
        <div>
          <h2 className="add-address-container_title-sec_title">Addresses</h2>
          <p className="add-address-container_title-sec_content">
            The following addresses will be used on the checkout page by
            default.
          </p>
        </div>
        {!showForm && (
          <Button
            variant="contained"
            startIcon="material-symbols:add-rounded"
            color="primary"
            onClick={handleAddAddress}
          >
            Add Address
          </Button>
        )}
      </div>

      {showForm ? (
        <AddEditAddress
          address={editingAddress}
          onCancel={handleCancel}
          onSave={() => handleSave()}
          editingAddress={editingAddress}
        />
      ) : (
        // <div className="address-container_list-sec">
        // {addresses.length > 0 ?
        //   addresses.map((address) => (
        //     <div key={address.addressId}>
        //       <div className="address-container_list-sec_item_title">
        //       {address.addressTypeId === 1 ? 'Billing Address' : 'Shipping Address'}
        //       </div>
        //       <div className="address-container_list-sec_item">
        //         <div className="address-container_list-sec_item_content">
        //           <div className="address-line-1">{address.addressLine1}</div>
        //           {address.addressLine2 && (
        //             <div className="address-line-2">{address.addressLine2}</div>
        //           )}
        //           <div className="address-container">
        //             <div className="address-city">{address.cityName},&nbsp;</div>
        //             <div className="address-state">{address.stateName},&nbsp;</div>
        //             <div className="address-zip">{address.zipCode}</div>
        //           </div>
        //           <div className="address-line-country">{address.countryName}</div>
        //           <div className="address-phone-no">
        //             <div className="address-phone-no-title">Phone No:</div>
        //             <div className="address-phone-no-value">
        //             +{address.phoneCode} {address.attendantPhoneNo}
        //             </div>
        //           </div>
        //           <div className="address-container_list-sec_item_content_actions">
        //             <Button
        //               variant="contained"
        //               startIcon="mdi:edit"
        //               color="secondary"
        //               onClick={() => handleEditAddress(address)}
        //             >
        //               Edit {address.adressId}
        //             </Button>
        //             <IconButton
        //               icon="mdi:delete"
        //               color="error"
        //               onClick={() => handleDelete(address.addressId)}
        //             />
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   ))

        // :
        // <div className="no-records-found">No records found</div>
        // }
        // </div>
        
        <div className="list-sec">
          {[1, 2].map((type) => {
            const filtered = addresses.filter((a) => a.addressTypeId === type);
            if (!filtered.length) return null;

            return (
              <div key={type} className="address-card-container">
                <div className="title">
                  {type === 1 ? "Billing Address" : "Shipping Address"}
                </div>
                <div className="item">
                  {filtered.map((address) => (
                    <div key={address.addressId} className="address-card">
                      <div className="content">
                        <div className="adress-wrapper">
                          <div className="icon">
                            <Iconify icon="weui:location-outlined" width={20} />
                          </div>
                          <div className="address">
                            <div className="address-line-1">
                              {address.addressLine1}
                            </div>
                            {address.addressLine2 && (
                              <div className="address-line-2">
                                {address.addressLine2}
                              </div>
                            )}
                            <div className="address-container">
                              <div className="address-city">
                                {address.cityName},&nbsp;
                              </div>
                              <div className="address-state">
                                {address.stateName},&nbsp;
                              </div>
                              <div className="address-zip">
                                {address.zipCode}
                              </div>
                            </div>
                            <div className="address-line-country">
                              {address.countryName}
                            </div>
                          </div>
                        </div>

                        <div className="address-phone-no">
                          <div className="icon">
                            <Iconify icon="proicons:call" width={20} />
                          </div>
                          <div className="address-phone-no-title">
                            Phone No:
                          </div>
                          <div className="address-phone-no-value">
                            +{address.phoneCode} {address.attendantPhoneNo}
                          </div>
                        </div>
                      </div>
                      <div className="actions">
                        <IconButton
                          icon="mdi:edit"
                          variant="text"
                          color="secondary"
                          shape="round"
                          onClick={() => handleEditAddress(address)}
                        />
                        <IconButton
                          icon="mdi:delete"
                          variant="text"
                          color="error"
                          shape="round"
                          onClick={() => handleDelete(address.addressId)}
                        />
                      </div>
                     
                    </div>
                  ))
                  }
                </div>
              </div>
            );
          })}
        </div>
        
      )}
       
    </div>
  );
};

export default Addresses;
