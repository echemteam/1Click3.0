// import { IsTestMode } from "src/redux/lib/defaultBaseQuery"
// const liveStripeKey = process.env.NEXT_PUBLIC_LIVESTRIPKEY
const testStripeKey = process.env.NEXT_PUBLIC_TESTSTRIPKEY

export const AddressType= { 
    SHIPPING : 1,
    BILLING : 2,
  }

  export const Constants = {
    StripeKey: testStripeKey,
}

  export const carrierOptions = [
    { value: 'FedEx', label: 'FedEx' },
    { value: 'DHL', label: 'DHL' },
    { value: 'UPS', label: 'UPS' },
  ];