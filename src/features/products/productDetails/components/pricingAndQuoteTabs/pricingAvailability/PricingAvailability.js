import React, { useEffect, useMemo, useState } from "react";
import "./PricingAvailability.scss";
import Counter from "@components/ui/counter/Counter";
import Grid from "@components/ui/grid/Grid";
import IconButton from "@components/ui/iconButton/IconButton";
import { useLazyGetPricesByCatalogIdQuery } from "src/redux/serviceApi/productAPI";
import SwalAlert from "src/services/swal/SwalService";
import { useAddProductInShoppingCartMutation } from "src/redux/serviceApi/shoppingCartAPI";
import Link from "next/link";
import { isAuthorized } from "src/lib/authenticationLibrary";
import Tooltip from "../../../../../../components/ui/tooltip/Tooltip";
import { useLazyGetTotalCountByUseIdQuery } from "src/redux/serviceApi/commonAPI";

const PricingAvailability = ({ catalogId }) => {
  const { toast } = SwalAlert();
  const [getPricesByCatalogId, { data, isSuccess, isLoading, isFetching }] = useLazyGetPricesByCatalogIdQuery();
  const [addProductInShoppingCart, { isSuccess: isAddProductInShoppingCartSuccess, data: isAddProductInShoppingCartData }] = useAddProductInShoppingCartMutation();
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [lastAddedPriceId, setLastAddedPriceId] = useState(null); 
  const [getTotalCountByUseId] = useLazyGetTotalCountByUseIdQuery();

  const isAuthenticate = isAuthorized();

  useEffect(() => {
    if (catalogId) {
      if (!catalogId || typeof catalogId !== "string" || catalogId.trim() === "") {
        toast("error", "Invalid catalog ID.");
        return;
      }
      getPricesByCatalogId({ CatalogId: catalogId }).unwrap();
    } else {
      toast("error", "No catalog ID provided.");
    }
  }, [getPricesByCatalogId, catalogId]);

  useEffect(() => {
    if (isSuccess && data) {
      const newQuantities = {};
      const newCartItems = {};

      data.forEach((item) => {
        if (newQuantities[item.priceId] === undefined) {
          newQuantities[item.priceId] = 1;
        }

        if (item.isAlreadyInCart) {
          newCartItems[item.priceId] = true;
        }
      });

      setQuantities(newQuantities);
      setCartItems(newCartItems); 
    }
  }, [isSuccess, data]);

  const handleCountChange = (priceId, newCount) => {
    setQuantities((prev) => ({
      ...prev,
      [priceId]: newCount,
    }));
  };

  const handleAddToCart = async (sizeId, packSize, productId, priceId) => {
    const quantity = quantities[priceId] || 1;

    const request = {
      catalogId,
      sizeId,
      packSize,
      quantity,
      priceId,
      productId
    };

    setLastAddedPriceId(priceId); 
    await addProductInShoppingCart(request);
    getTotalCountByUseId();
  };

  useEffect(() => {
    if (isAddProductInShoppingCartSuccess && isAddProductInShoppingCartData) {
      const { keyValue, priceId } = isAddProductInShoppingCartData;
      const PriceId = priceId || lastAddedPriceId;

      if (keyValue === 0) {
        toast("warning", "Product already added to cart");
      } else {
        toast("success", "Product added to cart");
      }
      setCartItems((prev) => ({
        ...prev,
        [PriceId]: true,
      }));
    }
  }, [isAddProductInShoppingCartSuccess, isAddProductInShoppingCartData, lastAddedPriceId]);

  const columns = useMemo(() => {
    const baseColumns = [
      { label: "SKU-Pack Size", key: "skuPackSize", align: "left", width: "2fr" },
      { label: "Price (USD)", key: "price", align: "left", width: "2fr" },
      { label: "Quantity", key: "quantity", align: "center", width: "4fr" },
    ];

    if (isAuthenticate) {
      baseColumns.push({
        label: "ACTION",
        key: "action",
        align: "center",
        width: "1fr",
      });
    }

    return baseColumns;
  }, [isAuthenticate]);

  const priceData = useMemo(() => {
    if (isSuccess && data) {
      return data.map((item) => {
        let unitLabel = "";
        switch (item.sizeId) {
          case 1:
            unitLabel = "MG";
            break;
          case 2:
            unitLabel = "G";
            break;
          case 3:
            unitLabel = "KG";
            break;
          default:
            unitLabel = "";
        }

        const isItemInCart = cartItems[item.priceId] || false;

        return {
          skuPackSize: item.packSize ? `${item.packSize} ${unitLabel}` : "N/A",
          price: isAuthenticate ? (
            item.price ? `$${item.price.toFixed(2)}` : "N/A"
          ) : (
            <Link href="/login" style={{ color: "darkgray" }}>
              Please Log In
            </Link>
          ),
          quantity: (
            <Counter
              counts={quantities[item.priceId] || 1}
              onChange={(newCount) => handleCountChange(item.priceId, newCount)}
              disabled={!isAuthenticate}
            />
          ),
          action:
            <Tooltip label={isItemInCart ? "Already Added" : "Add to Cart"}>
              <IconButton
                variant="text"
                icon="famicons:cart-outline"
                shape="square"
                onClick={() => handleAddToCart(item.sizeId, item.packSize, item.productId, item.priceId)}
                disabled={isItemInCart}
              />
            </Tooltip>
        };
      });
    }
    return [];
  }, [isSuccess, data, quantities, cartItems, isAuthenticate]);

  return (
    <div className="pricing-availability-container">
      {isLoading || isFetching ? (
        <div>Loading prices...</div>
      ) : priceData.length === 0 ? (
        <div>No prices available.</div>
      ) : (
        <Grid columns={columns} data={priceData} showPagination={false} />
      )}
    </div>
  );
};

export default PricingAvailability;