import React from "react";
import "./BulkQuotationRequest.scss";
import Input from "@components/ui/input/Input";
import Select from "@components/ui/select/Select";
import IconButton from "@components/ui/iconButton/IconButton";
import Button from "@components/ui/button/Button";
import AddQuotationRequest from "../../AddQuotationRequest";

const BulkQuotationRequest = (catalogNumber) => {
  const unitOptions = [
    { value: "option1", label: "MG" },
    { value: "option2", label: "G" },
    { value: "option3", label: "KG" },
  ];
  const countryOptions = [
    { value: "option1", label: "India" },
    { value: "option2", label: "Australia" },
    { value: "option3", label: "United States" },
  ];
  return (
    // <div className="bulk-quotation-request">
    //   <form className="bulk-quotation-request-form">
    //     <div className="bulk-quotation-request-form__grid">
    //       <div className="bulk-quotation-request-form__group">
    //         <label className="bulk-quotation-request-form__label">
    //           Name <span className="required">*</span>
    //         </label>
    //         <Input type="text" placeholder="Name" />
    //       </div>
    //       <div className="bulk-quotation-request-form__group">
    //         <label className="bulk-quotation-request-form__label">
    //           Company Name <span className="required">*</span>
    //         </label>
    //         <Input type="text" placeholder="Company Name" />
    //       </div>
    //       <div className="bulk-quotation-request-form__group">
    //         <label className="bulk-quotation-request-form__label">
    //           Email Address <span className="required">*</span>
    //         </label>
    //         <Input type="email" placeholder="Email Address" />
    //       </div>
    //       <div className="bulk-quotation-request-form__group">
    //         <label className="bulk-quotation-request-form__label">
    //           Country <span className="required">*</span>
    //         </label>
    //         <Select
    //           options={countryOptions}
    //           placeholder="Select Country"
    //           onChange={(value) => console.log("Selected:", value)}
    //         />
    //       </div>
    //       <div className="bulk-quotation-request-form__group bulk-quotation-request-form__group--full">
    //         <label className="bulk-quotation-request-form__label">Special Request</label>
    //         <Input type="text" placeholder="Special Request" />
    //       </div>
    //       <div className="bulk-quotation-request-form__group">
    //         <label className="bulk-quotation-request-form__label">Time Frame</label>
    //         <Select
    //           options={unitOptions}
    //           placeholder="Select Time Frame"
    //           onChange={(value) => console.log("Selected:", value)}
    //         />
    //       </div>

    //       <div className="bulk-quotation-request-form__packages bulk-quotation-request-form__group">
    //         <div className="bulk-quotation-request-form__package-row">
    //           <div className="bulk-quotation-request-form__group">
    //             <label className="bulk-quotation-request-form__label">Package</label>
    //             <Input type="text" placeholder="Package" />
    //           </div>
    //           <div className="bulk-quotation-request-form__group">
    //             <label className="bulk-quotation-request-form__label">Size</label>
    //             <Input type="text" placeholder="Quantity" />
    //           </div>
    //           <div className="bulk-quotation-request-form__group">
    //             <label className="bulk-quotation-request-form__label">Unit</label>
    //             <Select
    //               options={unitOptions}
    //               placeholder="Select"
    //               onChange={(value) => console.log("Selected:", value)}
    //             />
    //           </div>
    //           <div className="bulk-quotation-request-form__btn-single">
    //             <IconButton
    //               variant="contained"
    //               icon="ic:round-plus"
    //               shape="square"
    //               onClick={() => alert("Add Item")}
    //             />
    //           </div>
    //         </div>
    //         {/* <div className="bulk-quotation-bulk-quotation-request-form__package-row">
    //           <div className="bulk-quotation-bulk-quotation-request-form__group">
    //             <label className="bulk-quotation-bulk-quotation-request-form__label">Package</label>
    //             <Input type="text" placeholder="Package" />
    //           </div>
    //           <div className="bulk-quotation-bulk-quotation-request-form__group">
    //             <label className="bulk-quotation-bulk-quotation-request-form__label">Size</label>
    //             <Input type="text" placeholder="Quantity" />
    //           </div>
    //           <div className="bulk-quotation-bulk-quotation-request-form__group">
    //             <label className="bulk-quotation-bulk-quotation-request-form__label">Unit</label>
    //             <Select
    //               options={unitOptions}
    //               placeholder="Select"
    //               onChange={(value) => console.log("Selected:", value)}
    //             />
    //           </div>
    //           <div className="bulk-quotation-bulk-quotation-request-form__btn-group">
    //             <IconButton
    //               variant="contained"
    //               icon="ic:round-plus"
    //               shape="square"
    //               onClick={() => alert("Add Item")}
    //               className=""
    //             />
    //             <IconButton
    //               variant="contained"
    //               icon="ic:round-minus"
    //               shape="square"
    //               color="error"
    //               onClick={() => alert("Remove Item")}
    //             />
    //           </div>
    //         </div> */}
            <>
            <AddQuotationRequest  
              catalogNumber={catalogNumber.catalogNumber}
               isBulkQuotationRequest={true}
            />
           </>
    //     </div>
    //   </form>
    // </div>
  );
};

export default BulkQuotationRequest;
