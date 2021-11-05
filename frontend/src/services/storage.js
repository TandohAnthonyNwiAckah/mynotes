/**
 * Manage the how Access User Login data and Auth Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to sessionStorage or localStorage
**/

const TOKEN_KEY = 'token';
const LOCALE_KEY = 'locale';
export const StorageService = {
    setLocale(locale) {
        localStorage.setItem(LOCALE_KEY, locale);
    },
    getLocale() {
        return localStorage.getItem(LOCALE_KEY);
    },
    getToken() {
        return sessionStorage.getItem(TOKEN_KEY)  || localStorage.getItem(TOKEN_KEY);
    },
    saveLoginData(loginData, remember) {
        let token = loginData.token;
        if(remember){
            localStorage.setItem(TOKEN_KEY, token);
        }
        else{
            sessionStorage.setItem(TOKEN_KEY, token);
        }
    },
    removeLoginData() {
        sessionStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY);

        //remove language locale
        localStorage.removeItem(LOCALE_KEY);
    },
}