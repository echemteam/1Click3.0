import React, { useEffect, useState } from 'react'
import Grid from '@components/ui/grid/Grid';
import "./RFQHistory.scss"
import Input from '@components/ui/input/Input';
import { useLazyGetRFQHistoryQuery } from 'src/redux/serviceApi/rfqAPI';
import formatDate from 'src/lib/formatDate';

const RFQHistory = () => {
  const [searchText, setSearchText] = useState('')
  const [searchTextList,setSearchTextList]=useState([])
  const [getRFQHistory, { isFetching: isGetRFQHistoryFetching, isSuccess: isGetRFQHistorySuccess, data: isGetRFQHistoryData, },] = useLazyGetRFQHistoryQuery();

  useEffect(() => {
    const request={
      searchText: searchText,
      pageIndex: 1,
      pageSize: 10,
    }
    getRFQHistory(request)
  }, [])

  useEffect(() => {
    if (!isGetRFQHistoryFetching && isGetRFQHistorySuccess && isGetRFQHistoryData) {

      if (isGetRFQHistoryData) {
  
        const transformData = isGetRFQHistoryData.data.map((item) => ({
          rfqNumber: item.rfqNumber,
          date: formatDate(item.createdAt, "MM-DD-YYYY"),
          catalog: item.catalogId
        }));
        setSearchTextList(transformData);
      }
      
    }
  }, [isGetRFQHistoryFetching, isGetRFQHistoryData, isGetRFQHistorySuccess])

  const columns = [
    { label: 'RFQ NUMBER', key: 'rfqNumber', align: 'left', width: '2fr' },
    { label: 'DATE', key: 'date', align: 'left', width: '2fr' },
    { label: 'CATALOG', key: 'catalog', align: 'left', width: '5fr' },
     { label: 'ACTION', key: 'action', align: 'center', width: '1fr' }
  ];
  // const mockData = [
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //    // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  //   {
  //     rfqNumber: "CL2025253998",
  //     date: "02-12-2025 10:56",
  //     catalog: "1C37850, 4C72276, IC71277, 6C17gon 3C15136, IC48797",
  //     // action: <a href="#">View</a>
  //   },
  // ]
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <div className='rfq-history-header'>
        <div className='rfq-history-title'>
          RFQ History
        </div>
        <div className='rfq-history-history'>
          <Input type='text' issearchable={true} placeholder="Search By RFQ Number" onClick={handleSearchChange} value={searchText} />
        </div>
      </div>
      
      <Grid columns={columns} data={searchTextList} isAction={true}/>
    </div>
  )
}

export default RFQHistory