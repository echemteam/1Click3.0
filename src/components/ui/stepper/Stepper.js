// Stepper component is left to be completed

/*const CartPage = ({ onNext }) => (
  <div>
    <h2>Cart Page</h2>
    <button onClick={onNext}>Next</button>
  </div>
);

const BillingPage = ({ onNext, onBack }) => (
  <div>
    <h2>Billing Page</h2>
    <button onClick={onBack}>Back</button>
    <button onClick={onNext}>Next</button>
  </div>
);

const ShippingPage = ({ onNext, onBack }) => (
  <div>
    <h2>Shipping Page</h2>
    <button onClick={onBack}>Back</button>
    <button onClick={onNext}>Next</button>
  </div>
);

const PaymentPage = ({ onBack }) => (
  <div>
    <h2>Payment Page</h2>
    <button onClick={onBack}>Back</button>
  </div>
);

const steps = [
  { label: 'Cart', component: CartPage },
  { label: 'Billing', component: BillingPage },
  { label: 'Shipping', component: ShippingPage },
  { label: 'Payment', component: PaymentPage },
];

const HomePage = () => {
  return (
    <Stepper steps={steps} allowStepClick={false} />
  );
}; */

import React, { useState } from 'react';
import './Stepper.scss';

const Stepper = ({ steps, allowStepClick = false }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleStepClick = (index) => {
    if (allowStepClick && index <= currentStep + 1) {
      setCurrentStep(index);
    }
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
            onClick={() => handleStepClick(index)}
            style={{ cursor: allowStepClick ? 'pointer' : 'default' }}
          >
            <div className="circle">
              {index < currentStep ? '✔' : index === currentStep ? '✓' : '✔'}
            </div>
            <span className="label">{step.label}</span>
            {index < steps.length - 1 && <div className="arrow" />}
          </div>
        ))}
      </div>
      <div className="step-content">
        <CurrentComponent onNext={goNext} onBack={goBack} />
      </div>
    </div>
  );
};

export default Stepper;
