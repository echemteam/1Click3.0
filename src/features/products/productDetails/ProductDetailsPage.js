"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./ProductDetailsPage.scss";
import Tabs from "@components/ui/tabs/Tabs";
import Iconify from "@components/ui/iconify/Iconify";
import { AppIcons } from "@utils/AppIcons/AppIcons";
import Image from "next/image";
import Button from "@components/ui/button/Button";
import BulkQuotationRequest from "./components/pricingAndQuoteTabs/bulkQuotationRequest/BulkQuotationRequest";
import PricingAvailability from "./components/pricingAndQuoteTabs/pricingAvailability/PricingAvailability";
import AvailabilityAndStocks from "./components/productInfoTabs/availabilityAndStocks/AvailabilityAndStocks";
import ProductProperties from "./components/productInfoTabs/productProperties/ProductProperties";
import ChemicalDescription from "./components/productInfoTabs/chemicalDescription/ChemicalDescription";
import HealthAndSafety from "./components/productInfoTabs/healthAndSafety/HealthAndSafety";
import SwiperSlider from "@components/ui/swiperSlider/SwiperSlider";
import ProductDetailCard from "@components/ui/productDetailCard/ProductDetailCard";
import { useLazyGetProductByProductIdQuery, useLazyGetSimilarProductsByCatalogIdQuery } from "src/redux/serviceApi/productAPI";
import { useParams } from "next/navigation";
import SwalAlert from "src/services/swal/SwalService";
import { decryptUrlData } from "src/services/crypto/CryptoService";
import { isAuthorized } from "src/lib/authenticationLibrary";
import { useCreateRecentViewMutation } from "src/redux/serviceApi/recentViewManagementAPI";
import DataLoader from "@components/Common/Loader/DataLoader";
import { useDispatch } from "react-redux";
import { setBreadcrumbCatalogId } from "src/redux/slice/productSearchSlice";
import { useLazyGetRenderImagebychemProductIdAndInchikeyQuery } from "src/redux/serviceApi/ImageAPI";
import Loading from "src/app/loading";

const pricingAndQuoteTabs = [
  {
    label: "Pricing & Availability",
    value: "Pricing & Availability",
    content: (catalogId) => (
      <div>
        <PricingAvailability catalogId={catalogId} />
      </div>
    ),
  },
  {
    label: "Bulk Quotation Request",
    value: "Bulk Quotation Request",
    content: (catalogId) => (
      <div>
        <BulkQuotationRequest catalogNumber={catalogId} />
      </div>
    ),
  },
];
const productInfoTabs = [
  {
    label: "Product Properties",
    value: "Product Properties",
    content: (catalogId) => (
      <div>
        <ProductProperties catalogId={catalogId} />
      </div>
    ),
  },
  {
    label: "Health & Safety",
    value: "Health & Safety",
    content: (
      <div>
        <HealthAndSafety />
      </div>
    ),
  },
  {
    label: "Chemical Description",
    value: "Chemical Description",
    content: (
      <div>
        <ChemicalDescription />
      </div>
    ),
  },
  {
    label: "Availability & Stocks",
    value: "Availability & Stocks",
    content: (catalogId) => (
      <div>
        <AvailabilityAndStocks catalogId={catalogId} />
      </div>
    ),
  },
];



const ProductDetailsPage = () => {
  const [getProductByProductId, { isLoading, isFetching, isSuccess, data }] = useLazyGetProductByProductIdQuery();
  const [createRecentView] = useCreateRecentViewMutation();
  const [getSimilarProductsByCatalogId, { isLoading: isGetSimilarProductsByCatalogIdLoading, isSuccess: isGetSimilarProductsByCatalogIdSuccess, data: getSimilarProductsByCatalogIdData }] = useLazyGetSimilarProductsByCatalogIdQuery();
  const [product, setProduct] = useState(null);
  const [slidesData, setSlidesData] = useState([]);
  const { toast } = SwalAlert();
  const params = useParams();
  const dispatch = useDispatch();
  const isAuthenticate = isAuthorized();
  const [imgErrors, setImgErrors] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const [
    getRenderImagebychemProductIdAndInchikey,
    {
      isLoading: isGetRenderImagebychemProductIdAndInchikeyLoading,
      isSuccess: isGetRenderImagebychemProductIdAndInchikeySucess,
      data: imageBlob,
    },
  ] = useLazyGetRenderImagebychemProductIdAndInchikeyQuery();

  useEffect(() => {
    if (product?.inChikey) {
      getRenderImagebychemProductIdAndInchikey({
        chemProductID: "",
        inChIKey: product.inChikey,
      });
    }
  }, [product?.inChikey]);

  useEffect(() => {
    if (isGetRenderImagebychemProductIdAndInchikeySucess && imageBlob instanceof Blob) {
      const objectUrl = URL.createObjectURL(imageBlob);
      setImageSrc(objectUrl);
      setImgErrors(false);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [imageBlob, isGetRenderImagebychemProductIdAndInchikeySucess]);

  const productId = useMemo(() => {
    if (!params?.productId) return null;
    try {
      const decoded = decodeURIComponent(params.productId);
      return decryptUrlData(decoded);
    } catch (error) {
      toast("error", "Invalid product identifier");
      return null;
    }
  }, [params]);


  useEffect(() => {
    if (productId) {
      const id = parseInt(productId);
      if (isNaN(id) || id <= 0) {
        toast("error", "Invalid product ID.");
        return;
      }

      getProductByProductId({ Id: id }).unwrap();
    }
  }, [productId]);



  useEffect(() => {
    if (!isFetching && isSuccess && data) {
      const transformedData = {
        application_id: data.productId,
        title: data.productName,
        catalogNumber: data.catalogId,
        casNumber: data.casNo,
        mdlNumber: data.mdlNo,
        purity: data.purity,
        imageSrc: "",
        availabilityType: data?.availabilityType,
        inChikey: data?.inChiKey
      }

      setProduct(transformedData);
      dispatch(setBreadcrumbCatalogId(transformedData.catalogNumber))

      if (isAuthenticate && transformedData.catalogNumber) {
        const catalogId = transformedData.catalogNumber;
        createRecentView({ catalogId });
      }
    }
  }, [isFetching, isSuccess, data])

  useEffect(() => {
    if (product?.catalogNumber) {
      getSimilarProductsByCatalogId({ catalogId: product.catalogNumber }).unwrap();
    }
  }, [product?.catalogNumber]);


  useEffect(() => {
    if (isGetSimilarProductsByCatalogIdSuccess && getSimilarProductsByCatalogIdData) {
      if (getSimilarProductsByCatalogIdData) {
        const transformedData = getSimilarProductsByCatalogIdData.map((product) => ({
          application_id: product.productId,
          title: product.productName,
          catalogNumber: product.catalogId,
          casNumber: product.casNo,
          mdlNumber: product.mdlNo,
          price: product.price

        }));

        setSlidesData(transformedData)
      }
    }
  }, [isGetSimilarProductsByCatalogIdSuccess, getSimilarProductsByCatalogIdData])



  const handleImageError = (index) => {
    setImgErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const slides = slidesData.map((item, index) => (
    <div className="slide-card" key={index}>
      <ProductDetailCard {...item} />
    </div>
  ));
  return (
    <div className="product-detail">
      {isLoading ? <DataLoader /> :
        <div className="product-detail-page-container">
          <div className="product-detail-page-container__image-container">
            {product?.availabilityType === "In Stock" && (
              <div className="product-detail-availability-tag green">
                <div className="product-availability-icon">
                  <Iconify icon="prime:check-circle" width={16} />
                </div>
                <div className="product-availability-status-title">
                  {product.availabilityType}
                </div>
              </div>
            )}
            {/* {!product?.availability  && (
              <div className="product-detail-availability-tag red">
                <div className="product-availability-icon">
                  <Iconify icon="mingcute:warning-line" width={16} />
                </div>
                <div className="product-availability-status-title">
                  Out of Stock
                </div>
              </div>
            )} */}

            {isGetRenderImagebychemProductIdAndInchikeyLoading ? (
              <Loading />
            ) : imageSrc && !imgErrors ? (
              <div className="product-detail-image">
                <Image
                  src={imageSrc}
                  alt="product-image"
                  width={0}
                  height={0}
                  onError={() => setImgErrors(true)}
                />
              </div>
            ) : (
              <div className="product-detail-image-placeholder">
                <Image
                  src={AppIcons.ProductDetailCardPlaceholder}
                  alt="product-placeholder-image"
                  width={0}
                  height={0}
                />
              </div>
            )}
          </div>

          <div className="product-detail-page-container__detail">
            <div className="product-detail-page-detail-title">
              <div className="product_title">{product?.title}</div>
            </div>
            <div className="product-detail-page-detail-info">
              {product?.casNumber && (
                <div className="product_info_number">
                  <span className="key">Cas No. :</span>
                  <span className="value">{product.casNumber}</span>
                </div>
              )}
              {product?.catalogNumber && (
                <div className="product_info_number">
                  <span className="key">Catalog :</span>
                  <span className="value">{product.catalogNumber}</span>
                </div>
              )}
              {product?.mdlNumber && (
                <div className="product_info_number">
                  <span className="key">MDL :</span>{" "}
                  <span className="value">{product.mdlNumber}</span>
                </div>
              )}
              {product?.purity && (
                <div className="product_info_number">
                  <span className="key">Purity :</span>
                  <span className="value">{product.purity}</span>
                </div>
              )}
            </div>
            <div className="pricing-and-quote">
              <div className="pricing-and-quote_tab">
                {product?.catalogNumber && (
                  <Tabs
                    tabs={pricingAndQuoteTabs.map((tab) => ({
                      ...tab,
                      content:
                        typeof tab.content === "function"
                          ? tab.content(product.catalogNumber)
                          : tab.content,
                    }))}
                  />
                )}
              </div>
              <div className="pricing-and-quote_safety-data-sheet-btn">
                <Button
                  variant="outlined"
                  startIcon="material-symbols:download-rounded"
                >
                  Safety Data Sheet (SDS)
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="product-info-container">
        {product?.catalogNumber && (
          <Tabs tabs={productInfoTabs.map((tab) => ({
            ...tab,
            content:
              typeof tab.content === "function"
                ? tab.content(product.catalogNumber)
                : tab.content,
          }))} />
        )}
      </div>

      <div className="similar-product-container">
        <h3 className="similar-product-container_title">
          Similar Products
        </h3>
        {isGetSimilarProductsByCatalogIdLoading ?
          <DataLoader /> :
          <SwiperSlider slides={slides} slidesResponsive={true} />
        }
      </div>
    </div>
  );
};

export default ProductDetailsPage;
