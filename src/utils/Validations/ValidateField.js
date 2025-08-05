import validator from "validator";
import parsePhoneNumberFromString from "libphonenumber-js";
// validation function
//if field is require
export const required = (value) => {
  if (value === undefined || value === null) {
    return false;
  }
  if (!value.toString().trim().length) {
    return false;
  }
  if (typeof (value) !== 'string') {
    if (value === 0) {
      return false;
    }
  }
  return true;
};

//compare two values
export const compare = (value, compareValue) => {

  if (!(value === compareValue)) {

    return false;
  }
  return true;
};

//password validation 
export const isvalidPassword = (value) => {
  if (value !== undefined && value !== null && value.toString().trim().length) {
    const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!pattern.test(value)) {
      return false;
    }
  }
  return true;
}

export const number = (value) => {
  const re =  /^[+]?[0-9\b]+$/
  if (!re.test(value)) {
    return false;
  }
  else {
    return true;
  }
};

//valid email pattern
export const email = (value) => {
  if (value === undefined || value === null || value.toString() === "") {
    return true;
  }
  if (!validator.isEmail(value)) {
    return false;
  }
  return true;
};

export const minLength = (value, minLen) => {

  if ((value.toString().trim().length >= minLen)) {

    return true;
  }
  return false;
};

export const isValidZipCode = (rule, value) => {
  const patternData = getPostalCodePattern(Number(value?.countryId));
  const zip = (value?.zipCode || '').toString().trim();

  const lengthMessage = patternData.minLength === patternData.maxLength
    ? `${patternData.minLength}`
    : `${patternData.minLength} or ${patternData.maxLength}`;

  let isValid = false;

  if (patternData?.pattern) {

    isValid = patternData.pattern.test(zip);
  } else {
    isValid = zip.length === patternData.minLength || zip.length === patternData.maxLength;
  }

  return {
    isValid,
    customMessage: isValid ? '' : rule.message.replace('{length}', lengthMessage || '')
  };
};

const getPostalCodePattern = (country) => {
  switch (country) {
    case 11: // Argentina: B1234ABC
      return { pattern: /^[A-Za-z]\d{4}[A-Za-z]{3}$/, minLength: 8, maxLength: 8 };
    /**
     * Australia, Switzerland, South Africa, Norway, Denmark, 
     * Belgium, Austria, New Zealand, Hungary, Luxembourg  
     **/
    case 14: case 15: case 22: case 59: case 99:
    case 127: case 158: case 165: case 204: case 214:
      return { pattern: /^\d{4}$/, minLength: 4, maxLength: 4 };
    case 31: // Brazil: 12345-678
      return { pattern: /^\d{5}-\d{3}$/, minLength: 9, maxLength: 9 };
    case 39: // Canada: A1A 1A1
      return { pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, minLength: 6, maxLength: 7 };
    /**
     * France, Germany, Italy, Spain, Mexico, South Korea, 
     * Finland, Turkey, Saudi Arabia, Malaysia, UAE
     **/
    case 75: case 74: case 82: case 107: case 116: case 194:
    case 207: case 225: case 132: case 142: case 231:
      return { pattern: /^\d{5}$/, minLength: 5, maxLength: 5 };
    /**
     * India, Russia, China, Singapore
     **/
    case 45: case 101: case 182: case 199:
      return { pattern: /^\d{6}$/, minLength: 6, maxLength: 6 };
    case 58: // Czech Republic: 123 45
      return { pattern: /^\d{3}\s?\d{2}$/, minLength: 5, maxLength: 6 };
    case 85: // Greece: 123 45
      return { pattern: /^\d{3}\s?\d{2}$/, minLength: 5, maxLength: 6 };
    case 100: // Iceland: 101
      return { pattern: /^\d{3}$/, minLength: 3, maxLength: 3 };
    case 106: // Israel: 12345 or 1234567
      return { pattern: /^\d{5,7}$/, minLength: 5, maxLength: 7 };
    case 109: // Japan: 123-4567
      return { pattern: /^\d{3}-\d{4}$/, minLength: 8, maxLength: 8 };
    case 135: // Malta: ABC 1234
      return { pattern: /^[A-Za-z]{3}\s?\d{4}$/, minLength: 7, maxLength: 8 };
    case 156: // Netherlands: 1234 AB
      return { pattern: /^\d{4}\s?[A-Za-z]{2}$/, minLength: 6, maxLength: 6 };
    case 176: // Poland: 12-345
      return { pattern: /^\d{2}-\d{3}$/, minLength: 6, maxLength: 6 };
    case 177: // Portugal: 1234-567
      return { pattern: /^\d{4}-\d{3}$/, minLength: 8, maxLength: 8 };
    case 213: // Sweden: 123 45
      return { pattern: /^\d{3}\s?\d{2}$/, minLength: 5, maxLength: 6 };
    case 232: // UK: AA9A 9AA
      return { pattern: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\d[A-Za-z]{2}$/, minLength: 6, maxLength: 8 };
    case 233: // US: 12345 or 12345-6789
      return { pattern: /^\d{5}(-\d{4})?$/, minLength: 5, maxLength: 10 };
    default:
      return { pattern: null, minLength: 5, maxLength: 10 };
  }
};

export const phoneinput = (value) =>{
  const stringValue = value.toString().trim();
  if (stringValue.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(stringValue);
    if (!parsed) return false;
    const countryCode = parsed.countryCallingCode;
    const withoutCountryCode = stringValue.replace(`+${countryCode}`, '');
    if (withoutCountryCode === null) {
      return false;
    }
    return true;
  }
}