//*** Lib */
import { decryptStorageData, encryptSotrageData } from 'src/services/crypto/CryptoService';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const createCookie = (props) => {
    let cookieValue = encryptSotrageData(props.cookieValue);
    let cookieName = props.cookieName;
    cookies.set(cookieName, cookieValue,
        {
            path: props.path,
            maxAge: props.expirationTime * 60,
        });
};

//Store cookie
export const setCookie = (props) => {
    let cookieValue = encryptSotrageData(props.cookieValue);
    let cookieName = props.cookieName;
    cookies.set(cookieName, cookieValue);
}

export function getCookie(cookieName, doNotParse = false) {
    const cookieValue = cookies.get(cookieName, { doNotParse: doNotParse })
    if (cookieValue) {
        return decryptStorageData(cookieValue);
    }
    else {
        return null;
    }
}

export const getAllCookies = (doNotParse = false) => {
    const cookieValue = cookies.getAll({ doNotParse: doNotParse });
    return decryptStorageData(cookieValue);
};

export const removeCookie = (cookieName, options = {}) => {
    cookies.remove(cookieName, options);
};

export const removeAllCookies = () => {
    Object.keys(cookies.cookies).forEach(element => {
        cookies.remove(element, {});
    });
};

//Check cookie exist or not
export const isCookieExist = (cookieName) => {
    const cookieDetail = getCookie(cookieName);
    if (cookieDetail) {
        return true;
    }
    return false;
}