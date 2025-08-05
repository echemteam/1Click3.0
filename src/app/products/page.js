// // app/products/page.js
// 'use client'
// import React, { useEffect, useMemo, useState } from 'react';
// import ProductView from '@features/products/ProductsPage'; // Import the ProductView component
// import { useRouter } from 'next/navigation';

// const ProductPage = () => {
//   const [getUserDetails, { isLoading: isUserDetailsLoading, isSuccess: isSuccessUserDetails, data: UserDetails }] = useLazyGetUserDetailsQuery();

//   const router = useRouter();

//   const [dataSource, setDataSource] = useState();

//   const productsList = useMemo(() => [
//     { application_id: 1, app_name: 'Product C' },
//     { application_id: 2, app_name: 'Product D' },
//   ], []);

//   useEffect(() => {
//     setDataSource(productsList);
//   }, [productsList]);

//   useEffect(() => {
//     // getAllApplication();
//     // const request = {
//     //   pageNumber: 1,
//     //   pageSize: 10,
//     //   orderby: null
//     // };
//     // getUserslist(request);
//     getUserDetails(3);
//   }, []);

//   useEffect(() => {
//     if (isSuccessUserDetails && UserDetails) {
//       // setDataSource(data)
//     }
//   }, [isSuccessUserDetails, UserDetails]);

//   const handleNavigation = (product) => {
//     router.push(`/products/${product.application_id}`);
//   };

//   return (
//     <div>
//       <h1>Product List</h1> {/* You can add any page-specific headings or content here */}
//       <ProductView products={dataSource} onProductClick={handleNavigation} /> {/* Render the ProductList component here */}
//     </div>
//   );
// };

// export default ProductPage;

import React from 'react';
import ProductListPage from '@features/products/productList/ProductListPage';

export default function Page() {
  return <ProductListPage />;
}