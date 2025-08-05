import PaymentCard from '@components/ui/paymentCard/PaymentCard';
import React from 'react';
 

const PaymentCardList = ({ paymentMethods }) => {
    if (!paymentMethods?.length) return <p>No saved cards found.</p>;

    return (
        <div className="payment-card-list">
            {paymentMethods.map((method) => {
                const { card, billing_details, id } = method;
                const brand = card?.brand?.toLowerCase() || 'default';
                const cardNumber = `XXXX XXXX XXXX ${card?.last4 || '0000'}`;
                const name = billing_details?.name || 'Unknown';
                const validTill = `${String(card?.exp_month).padStart(2, '0')}/${String(card?.exp_year).slice(-2)}`;
                const cvv = '***';

                return (
                    <PaymentCard
                        key={id}
                        variant={brand}
                        cardNumber={cardNumber}
                        name={name}
                        validTill={validTill}
                        cvv={cvv}
                        onEdit={() => console.log(`Edit ${id}`)}
                        onDelete={() => console.log(`Delete ${id}`)}
                        checked={false}
                        onCheck={() => console.log(`Toggle ${id}`)}
                    />
                );
            })}
        </div>
    );
};

export default PaymentCardList;
