import { encryptAES, encryptHistoryAES } from "src/services/crypto/CryptoService";

const isEncryptionEnabled = false;

export const transformRequest = (data) => {
  if (isEncryptionEnabled) {
    return encryptAES(data)
  }
  return data;
}

export const transformHistoryRequest = (data) => {
  if (isEncryptionEnabled) {
    return encryptHistoryAES(data)
  }
  return data;
}

export const encryptQueryString = (url) => {

  if (isEncryptionEnabled) {
    const urlParts = url.split("?");
    if (urlParts.length === 2) {
      const queryString = urlParts[1];
      const encryptedQueryString = encryptAES(queryString); // Replace with your encryption logic
      return `${urlParts[0]}?${encryptedQueryString}`;
    }
  }
  // If the URL doesn't contain query parameters or is in an invalid format, return the original URL.
  return url;
}
