"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./RfqDetailHistory.scss";
import Input from "@components/ui/input/Input";
import { useLazyGetRfqDetilsByRfqIdQuery } from "src/redux/serviceApi/rfqAPI";
import { useParams } from "next/navigation";
import { decryptUrlData } from "src/services/crypto/CryptoService";
import SwalAlert from "src/services/swal/SwalService";

export default function RfqDetailHistory() {
    const { toast } = SwalAlert();
    const params = useParams();
    const [rfqData, setRfqData] = useState(null);
    const [getRfqDetilsByRfqId, {isLoading, isSuccess, data}] = useLazyGetRfqDetilsByRfqIdQuery();
    
    const rfqId = useMemo(() => {
      if (!params?.rfqId) return null;
      try {
          return params.rfqId;
      } catch (error) {
        toast("error", "Invalid product identifier");
        return null;
      }
    }, [params]);

    useEffect(() => {
      getRfqDetilsByRfqId(rfqId);
    }, [rfqId]);

    useEffect(() => {
        if (!isLoading && isSuccess && data) {
        setRfqData(data);
      }
    }, [isLoading, isSuccess, data]);

   return (
     <div className={styles.page}>
       <div className={styles.card}>
         {/* Header */}
         <div className={styles.headerRow}>
           <h2>
             Expected Delivery By :{" "}
             <span>{rfqData?.expectedDeliveryDate || "N/A"}</span>
           </h2>
           <button className={styles.backButton}>Back to History</button>
         </div>
         <hr />

         {/* RFQ Quantities */}
         <div className={styles.section}>
           <h3>Package & Quantity</h3>
           {rfqData?.rfqProductQuantities?.length > 0 ? (
             <table>
               <thead>
                 <tr>
                   <th>Package</th>
                   <th>Quantity</th>
                 </tr>
               </thead>
               <tbody>
                 {rfqData?.rfqProductQuantities.map((q, idx) => (
                   <tr key={idx}>
                     <td>{q.package} {q.size}</td>
                     <td>{q.quantity}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : (
             <p>No package details available.</p>
           )}
         </div>

         {/* Special Request */}
         <div className={styles.section}>
           <h3>Special Request</h3>
           <div className={styles.requestBox}>
             {rfqData?.requestNote || "No special request provided."}
           </div>
         </div>

         {/* Company Details */}
         <div className={styles.section}>
           <h3>Company Details</h3>
           <div className={styles.companyGrid}>
             <div>
               <label>Email address</label>
               <Input type="text" value={rfqData?.emailAddress} isreadonly={true} />
             </div>
             <div>
               <label>Company name</label>
               <Input type="text" value={rfqData?.companyName} isreadonly={true} />
             </div>
             <div>
               <label>Name</label>
               <Input
                 type="text"
                 value={`${rfqData?.firstName} ${rfqData?.lastName}`}
                 isreadonly={true}
               />
             </div>
             <div>
               <label>Country</label>
               <Input type="text" value={rfqData?.countryName} isreadonly={true} />
             </div>
           </div>
         </div>

         {/* Product Information */}
         <div className={styles.section}>
           <h3>Products</h3>
           {rfqData?.rfqProducts?.length > 1 ? (
             <ul>
               {rfqData.rfqProducts.map((prod, idx) => (
                 <li key={idx}>{prod.catalogId}</li>
               ))}
             </ul>
           ) : (
             rfqData?.rfqProducts?.map((prod, idx) => (
               <div key={idx}>
                 <p>
                   <strong>Catalog:</strong> {prod.catalogId}
                 </p>
                 <p>
                   <strong>Name:</strong> {prod.productName}
                 </p>
                 <p>
                   <strong>CAS:</strong> {prod.casNo}
                 </p>
                 <p>
                   <strong>MDL:</strong> {prod.mdlNo}
                 </p>
               </div>
             ))
           )}
         </div>
       </div>
     </div>
   );
}
