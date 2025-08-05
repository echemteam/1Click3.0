import React, { useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AppIcons } from '@utils/AppIcons/AppIcons'
import Iconify from '@components/ui/iconify/Iconify'
import "./HeaderCart.scss"
import Button from '@components/ui/button/Button'
import Counter from '@components/ui/counter/Counter'
import { useLazyGetShoppingCartByIdQuery, useUpdateShoppingCartByIdMutation } from 'src/redux/serviceApi/shoppingCartAPI'
import { useRouter } from 'next/navigation';
import SwalAlert from 'src/services/swal/SwalService'
import { useLazyGetTotalCountByUseIdQuery } from 'src/redux/serviceApi/commonAPI'
import { encryptUrlData } from 'src/services/crypto/CryptoService'
import NoProductFound from '@components/ui/noProductFound/NoProductFound'
import { TabContext } from '@features/context/TabContext'


const HeaderCart = ({ closemodal }) => {

  const router = useRouter();
  const { confirm, toast } = SwalAlert();
  const { setActiveTab } = useContext(TabContext);
  const [shoppingCartData, setShoppingCartData] = useState([]);
  const [getShoppingCartById, { isSuccess: isGetShoppingCartByIdSuccess, data: isGetShoppingCartByIdData }] = useLazyGetShoppingCartByIdQuery();
  const [updateShoppingCartById, { isSuccess: isUpdateSuccess }] = useUpdateShoppingCartByIdMutation();
  const [getTotalCountByUseId] = useLazyGetTotalCountByUseIdQuery();

  useEffect(() => {
    getShoppingCartById();
  }, []);

  useEffect(() => {
    if (isGetShoppingCartByIdSuccess && isGetShoppingCartByIdData) {
      const cartWithSelection = isGetShoppingCartByIdData.map((product) => ({
        ...product,
        selected: false,
      }));
      setShoppingCartData(cartWithSelection);
    }
  }, [isGetShoppingCartByIdSuccess, isGetShoppingCartByIdData]);

  useEffect(() => {
    if (isUpdateSuccess) {
      getShoppingCartById();
      toast("success", "Product Removed From Your Cart.");
    }
  }, [isUpdateSuccess, getShoppingCartById]);

  const handleviewcart = () => {
    router.push('/cart')
    closemodal();
  }

  const handleQuantityChange = (index, newQuantity) => {
    setShoppingCartData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalPrice = useMemo(() => {
    const total = shoppingCartData
      .reduce((sum, product) => sum + product.price * product.quantity, 0);
    return total?.toFixed(2);
  }, [shoppingCartData]);

  const handleremoveproductfromcart = async (shopppingCartProductId) => {
    const userconfirm = await confirm("Confirm?", "Are you sure you want to remove this product?", "Yes", "Cancel");
    if (userconfirm !== true) return;
    const id = (typeof shopppingCartProductId === "number" || typeof shopppingCartProductId === "string")
      ? shopppingCartProductId.toString().trim()
      : null;
    updateShoppingCartById({ ShoppingCartProductIds: id });
    getTotalCountByUseId();
  };

  const handleNavigation = (productId) => {
    const productIds = encryptUrlData(productId);
    router.push(`/products/${productIds}`);
    closemodal();
  };

  const handlecheckout = () => {
    closemodal();
    setActiveTab(2);
    router.push('/cart')
  };

  return (
    <div className='shopping-cart-section'>
      {shoppingCartData.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>
          <NoProductFound />
        </h3>
      ) : (
        <>
          <div className="title-desc-top">
            <div className="left-title">{shoppingCartData.length} Items</div>
            <button className="right-desc" onClick={handleviewcart}>View Cart</button>
          </div>

          <div className="product-lists">
            {shoppingCartData.map((product, index) => {
              return (
                <div className="cart-lists-item" key={product.shopppingCartProductId || index}>
                  <div className="left-section">
                    <div className="product-item-image-container">
                      <Image src={AppIcons.ProductDummyImage} alt="Product" width={100} height={100} className="product-image" />
                    </div>
                    <div className="product-status">
                      <div className="product-status-tag red">
                        <div className="product-status-icon">
                          <Iconify icon="mingcute:warning-line" width={12} />
                        </div>
                        <div className="product-status-title">
                          Out of Stock
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="middle-section">
                    <div className="top">
                      <div className='product-name'>
                        {product.productName}
                      </div>
                    </div>
                    <div className="middle">
                      <div className='product-details'>
                        <div className='product-title'>
                          Catalog :
                        </div>
                        <div className='product-value'>
                          {product.catalogId}
                        </div>
                      </div>
                      <div className='product-details'>
                        <div className='product-title'>
                          Cas No :
                        </div>
                        <div className='product-value'>
                          {product.casNo}
                        </div>
                      </div>
                      <div className='product-details'>
                        <div className='product-title'>
                          MDL No :
                        </div>
                        <div className='product-value'>
                          {product.mdlNo}
                        </div>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className='cart-actions'>
                        <div className="actions-counter">
                          <Counter
                            counts={product.quantity}
                            onChange={(newQuantity) => handleQuantityChange(index, newQuantity)} />
                        </div>
                        <Button variant="contained" color="tertiary" onClick={() => handleNavigation(product.productId)}>
                          Quick View
                        </Button>
                        <div className='product-price'>
                          ${product.price?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right-section">
                    <Button variant="outlined" color="error" onClick={() => handleremoveproductfromcart(product.shopppingCartProductId)}>
                      <Iconify icon="mingcute:delete-line" width={20} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='cart-summary'>
            <div className="left-summary">
              <div className="summary-label">
                No. of Products :
              </div>
              <div className="summary-value">
                {shoppingCartData.length}
              </div>
            </div>
            <div className="right-summary">
              <div className="summary-label">
                Total Price :
              </div>
              <div className="summary-value">
                ${totalPrice}
              </div>
            </div>
          </div>

          <div className="bottom-navigation">
            <Button variant="contained" color="secondary" endIcon="solar:arrow-right-outline" onClick={handlecheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )
      }
    </div >
  )
}
export default HeaderCart;
