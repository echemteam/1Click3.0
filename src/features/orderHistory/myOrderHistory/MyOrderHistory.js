"use client";
import React, { useEffect, useState } from "react";
import Grid from "@components/ui/grid/Grid";
import "./MyOrderHistory.scss";
import Input from "@components/ui/input/Input";
import { useLazyGetOrderHistoryQuery } from "src/redux/serviceApi/OrderAPI";
import formatDate from "src/lib/formatDate";
import DataLoader from "@components/Common/Loader/DataLoader";
import { useRouter } from "next/navigation";
import Iconify from "@components/ui/iconify/Iconify";

const MyOrderHistory = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [data, setdata] = useState([]);
  const [count, setCount] = useState(0);
  const [OrderBy, setOrderBy] = useState("Asending");
  const [
    getOrderHistory,
    {
      isLoading: isGetOrderHistoryLoading,
      isFetching: isGetOrderHistoryFetching,
      isSuccess: isGetOrderHistorySuccess,
      data: isGetOrderHistoryData,
    },
  ] = useLazyGetOrderHistoryQuery();

  useEffect(() => {
    const request = {
      pageIndex: 1,
      pageSize: 10,
      OrderBy: OrderBy,
      SearchText: searchText,
    };
    getOrderHistory(request);
  }, [OrderBy, searchText]);

   const handlePageChange = (page) => {
     const request = {
       pageIndex: page,
       pageSize: 10,
       OrderBy: OrderBy,
       SearchText: searchText,
     };
    getOrderHistory(request);
   };

  const handleViewHistory = (orderId) => {
    // const rfqId = encryptUrlData(rfqNumber);
    router.push(`./myOrderDetailHistory/${orderId}`);
  };

  useEffect(() => {
    if (
      !isGetOrderHistoryFetching &&
      isGetOrderHistorySuccess &&
      isGetOrderHistoryData
    ) {
      if (isGetOrderHistoryData) {
        const transformData = isGetOrderHistoryData.data.map((item) => ({
          orderNumber: item.orderNumber,
          date: formatDate(item.createdAt, "MM-DD-YYYY"),
          totalPrice: item.totalPrice?.toFixed(2),
          action: (
            <Iconify
              icon="mdi-light:eye"
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => handleViewHistory(item.orderId)}
            />
          ),
        }));
        setCount(isGetOrderHistoryData.count);
        setdata(transformData);
      }
    }
  }, [
    isGetOrderHistoryFetching,
    isGetOrderHistorySuccess,
    isGetOrderHistoryData,
  ]);

  const columns = [
    { label: "Order NUMBER", key: "orderNumber", align: "left", width: "2fr" },
    { label: "DATE", key: "date", align: "left", width: "2fr" },
    { label: "TotalPrice", key: "totalPrice", align: "left", width: "5fr" },
    { label: "ACTION", key: "action", align: "center", width: "1fr" },
  ];

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <div className="my-order-history-header">
        <div className="my-order-history-title">My Order History</div>
        <div className="my-order-history-history">
          <Input
            issearchable={true}
            placeholder="Search By Order Number"
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>
      </div>
      {isGetOrderHistoryLoading ? (
        <DataLoader />
      ) : (
        <Grid
          columns={columns}
          data={data}
          isAction={true}
          showPagination={true}
          pageSize={10}
          count={count}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MyOrderHistory;
