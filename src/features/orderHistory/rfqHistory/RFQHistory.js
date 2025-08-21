"use client";
import Grid from "@components/ui/grid/Grid";
import "./RFQHistory.scss";
import Input from "@components/ui/input/Input";
import { useLazyGetRFQHistoryQuery } from "src/redux/serviceApi/rfqAPI";
import formatDate from "src/lib/formatDate";
import DataLoader from "@components/Common/Loader/DataLoader";
import Iconify from "@components/ui/iconify/Iconify";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { encryptUrlData } from "src/services/crypto/CryptoService";

const RFQHistory = () => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchTextList, setSearchTextList] = useState([]);

  const [
    getRFQHistory,
    {
      isLoading: isGetRFQHistoryLoading,
      isFetching: isGetRFQHistoryFetching,
      isSuccess: isGetRFQHistorySuccess,
      data: isGetRFQHistoryData,
    },
  ] = useLazyGetRFQHistoryQuery();

  useEffect(() => {
    const request = {
      searchText: searchText,
      pageIndex: 1,
      pageSize: 10,
    };
    getRFQHistory(request);
  }, [searchText]);

  const handleViewHistory = (rfqId) => {
    // const rfqId = encryptUrlData(rfqNumber);
    router.push(`./rfqDetailHistory/${rfqId}`);
  };

  const handlePageChange = (page) => {
     const request = {
       searchText: searchText,
       pageIndex: page,
       pageSize: 10,
     };
     getRFQHistory(request);
  }

  useEffect(() => {
    if (
      !isGetRFQHistoryFetching &&
      isGetRFQHistorySuccess &&
      isGetRFQHistoryData
    ) {
      if (isGetRFQHistoryData) {
        const transformData = isGetRFQHistoryData.data.map((item) => ({
          rfqNumber: item.rfqNumber,
          date: formatDate(item.createdAt, "MM-DD-YYYY"),
          catalog: item.catalogId,
          action: (
            <Iconify
              icon="mdi-light:eye"
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => handleViewHistory(item.rfqId)}
            />
          ),
        }));
        setCount(isGetRFQHistoryData.count);
        setSearchTextList(transformData);
      }
    }
  }, [isGetRFQHistoryFetching, isGetRFQHistoryData, isGetRFQHistorySuccess]);

  const columns = [
    { label: "RFQ NUMBER", key: "rfqNumber", align: "left", width: "2fr" },
    { label: "DATE", key: "date", align: "left", width: "2fr" },
    { label: "CATALOG", key: "catalog", align: "center", width: "15fr" },
    { label: "ACTION", key: "action", align: "center", width: "1fr" },
  ];

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <div className="rfq-history-header">
        <div className="rfq-history-title">RFQ History</div>
        <div className="rfq-history-history">
          <Input
            type="text"
            issearchable={true}
            placeholder="Search By RFQ Number & Catalog"
            onChange={handleSearchChange}
            value={searchText}
          />
        </div>
      </div>

      {isGetRFQHistoryLoading ? (
        <DataLoader />
      ) : (
        <Grid
          columns={columns}
          data={searchTextList}
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

export default RFQHistory;
