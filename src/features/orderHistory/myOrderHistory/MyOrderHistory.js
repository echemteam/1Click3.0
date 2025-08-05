import React, { useEffect, useState } from 'react'
import Grid from '@components/ui/grid/Grid';
import "./MyOrderHistory.scss"
import Input from '@components/ui/input/Input';
import { useLazyGetOrderHistoryQuery } from 'src/redux/serviceApi/OrderAPI';
import formatDate from 'src/lib/formatDate';


const MyOrderHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setdata] = useState([]);
  const [OrderBy, setOrderBy] = useState("Asending");
  const [getOrderHistory, { isFetching: isGetOrderHistoryFetching, isSuccess: isGetOrderHistorySuccess, data: isGetOrderHistoryData, },] = useLazyGetOrderHistoryQuery();

  useEffect(() => {
    const request = {
      pageIndex: 1,
      pageSize: 10,
      OrderBy: OrderBy,
      SearchText: searchText,
    }
    getOrderHistory(request);
  }, [OrderBy]);

  useEffect(() => {
    if (!isGetOrderHistoryFetching && isGetOrderHistorySuccess && isGetOrderHistoryData) {
      if (isGetOrderHistoryData) {
        const transformData = isGetOrderHistoryData.data.map((item) => ({
          orderNumber: item.orderNumber,
          date: formatDate(item.createdAt, "MM-DD-YYYY"),
          totalPrice: item.totalPrice?.toFixed(2)
        }));
        setdata(transformData);
      }
    }
  }, [isGetOrderHistoryFetching, isGetOrderHistorySuccess, isGetOrderHistoryData]);

  const columns = [
    { label: 'Order NUMBER', key: 'orderNumber', align: 'left', width: '2fr' },
    { label: 'DATE', key: 'date', align: 'left', width: '2fr' },
    { label: 'TotalPrice', key: 'totalPrice', align: 'left', width: '5fr' },
    { label: 'ACTION', key: 'action', align: 'center', width: '1fr' }
  ];
  // const mockData = [
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     action: <a href="#">View</a>
  //   },
  // ]

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <div className='my-order-history-header'>
        <div className='my-order-history-title'>
          My Order History
        </div>
        <div className='my-order-history-history'>
          <Input issearchable={true} placeholder="Search By Order Number" onChange={handleSearchChange} value={searchText} />
        </div>
      </div>
      <Grid columns={columns} data={data} />
    </div>
  )
}

export default MyOrderHistory