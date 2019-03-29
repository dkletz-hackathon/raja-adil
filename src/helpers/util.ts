import {baseUrl, id, secretKey} from "../config";

const CryptoJS = require("crypto-js");
const axios = require('axios');
const querystring = require('querystring');

function getPath(url) {
    const pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
    const result = url.match(pathRegex);
    return result && result.length > 1 ? result[1] : '';
}

async function getAuthHeader(httpMethod, requestUrl, requestBody, token) {
    const requestPath = getPath(requestUrl);

    console.log(requestPath);

    if (httpMethod == 'GET' || !requestBody) {
        requestBody = '';
    }

    const timestamp = new Date().toISOString();

    const payload = 'path=' + requestPath + '&verb=' + httpMethod + '&token=Bearer ' + token +
        '&timestamp=' + timestamp + '&body=' + requestBody;

    const signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payload, secretKey));

    return {
        timestamp,
        signature
    }
}

async function getToken() {
    const response = await axios.post(`${baseUrl}/oauth/client_credential/accesstoken?grant_type=client_credentials`, querystring.stringify({
        client_id: id,
        client_secret: secretKey
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).catch(error => console.log(error.message));
    const {access_token} = response.data;
    return access_token;
}

export {
    getToken,
    getAuthHeader
}