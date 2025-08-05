import React from 'react'
import Image from 'next/image'
import Iconify from '@components/ui/iconify/Iconify'
import { AppIcons } from '@utils/AppIcons/AppIcons'
import PropTypes from 'prop-types'
import "./PaymentCard.scss"

const cardConfigs = {
    mastercard: {
        bgColor: '#000000',
        logo: AppIcons.MasterCardLogo,
        label: 'Master Card',
    },
    visa: {
        bgColor: '#8B0000',
        logo: AppIcons.VisaCardLogo,
        label: 'Visa Gold',
    },
    discover: {
        bgColor: '#505050',
        logo: AppIcons.DiscoverCardLogo,
        label: 'Discover',
    },
    amex: {
        bgColor: '#1f7bc1',
        logo: AppIcons.AmexCardLogo,
        label: 'American Express',
    },
    default: {
        bgColor: '#2c2c2c',
        logo: AppIcons.DefaultCardLogo,
        label: 'Default Card',
    }
}

const PaymentCard = ({
    variant = 'default',
    onEdit = () => {},
    onDelete = () => {},
    checked = false,
    onCheck = () => {},
    cardNumber = 'XXXX XXXX XXXX XXXX',
    name = 'John Doe',
    validTill = 'MM/YY',
    cvv = 'XXX'
}) => {
    const { bgColor, logo, label } = cardConfigs[variant] || cardConfigs.default;

    return (
        <div className={`payment-card`} style={{ backgroundColor: bgColor }}>
            <header>
                <span className="logo">
                    <Image src={logo} alt={label} />
                    <h5>{label}</h5>
                </span>
                <div className='action-btns'>
                    {/* <button onClick={onEdit}>
                        <Iconify icon="material-symbols:edit" />
                    </button> */}
                    <button onClick={onDelete} disabled = {checked}>
                        <Iconify icon="material-symbols:delete" />
                    </button>
                </div>
            </header>

            <div className='payment-card__checkbox'>
                <input 
                    type="checkbox" 
                    id={`card-${cardNumber}`}
                    checked={checked} 
                    onChange={onCheck}
                />
                <div className="custom-check"></div>
            </div>

            <div className="chip-container">
                <Image src={AppIcons.CardChip} alt={`${label} Chip`} />
            </div>

            <div className='card-number'>
                <h6>Card Number</h6>
                <h5 className="number">{cardNumber}</h5>
            </div>

            <div className="card-details">
                <div className="name-number">
                    <h5 className="name">{name}</h5>
                </div>
                <div className="valid-date">
                    <h6>Valid Till</h6>
                    <h5>{validTill}</h5>
                </div>
                <div className="valid-date">
                    <h6>CVV</h6>
                    <h5>{cvv}</h5>
                </div>
            </div>
        </div>
    )
}

PaymentCard.propTypes = {
    variant: PropTypes.oneOf(['mastercard', 'visa', 'discover', 'amex']),
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    checked: PropTypes.bool,
    onCheck: PropTypes.func
}

export default PaymentCard
