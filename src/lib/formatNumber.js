

// Utility function to format a money value
export const formatMoney = (value, currencySymbol = '$', decimalPlaces = 2, thousandSeparator = ',') => {
    

    if (isNaN(value)) {
        return 'Invalid value'; // Handle non-numeric input
      }
    // Check if the value is a valid number
    if (typeof value !== 'number') {
      value = Number(value);
    }
  
    // Round the value to the specified number of decimal places
    const roundedValue = value.toFixed(decimalPlaces);
  
    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = roundedValue.split('.');
  
    // Add thousand separators to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
    // Combine the integer and decimal parts with the currency symbol
    const formattedValue = `${currencySymbol}${formattedIntegerPart}.${decimalPart}`;
  
    return formattedValue;
  };
  
  // Utility function to round a number to a specified number of decimal places
  export const roundNumber = (number, decimalPlaces = 2) => {
    if (typeof number !== 'number') {
      return NaN; // Return NaN for non-numeric input
    }
  
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
  };
  
