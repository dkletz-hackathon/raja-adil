import {baseUrl, id, secretKey} from "../config";
import * as moment from "moment-timezone";
import * as qs from "querystring";
const axios = require('axios');
const CryptoJS = require("crypto-js");

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
  const response = await axios.post(
    `${baseUrl}/oauth/client_credential/accesstoken?grant_type=client_credentials`,
    qs.stringify({
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

async function getSaldo(accountNumber) {
  const method = 'GET';
  const requestUrl = `${baseUrl}/sandbox/v1/inquiry`;
  const requestBody = '';
  const token = await getToken();

  const {timestamp, signature} = await getAuthHeader(method, requestUrl, requestBody, token);

  console.log(token, timestamp, signature);

  const response = await axios.get(`${requestUrl}/${accountNumber}`, {
    headers: {
      'BRI-Timestamp': timestamp,
      'BRI-Signature': signature,
      'Authorization': `Bearer ${token}`,
    }
  }).catch(error => console.log(error.message));
  return response.data;
}

async function getTransactionStatus(noReferral) {
  const method = 'GET';
  const requestUrl = `${baseUrl}/sandbox/v2/transfer/internal`;
  const requestBody = '';
  const token = await getToken();

  const {timestamp, signature} = await getAuthHeader(method, requestUrl, requestBody, token);

  const response = await axios.get(`${requestUrl}?NoReferral=${noReferral}`, {
    headers: {
      'BRI-Timestamp': timestamp,
      'BRI-Signature': signature,
      'Authorization': `Bearer ${token}`,
    }
  }).catch(error => console.log(error.message));
  return response.data;
}

async function getMutation(accountNumber, startDate, endDate) {
  const method = 'GET';
  const requestUrl = `${baseUrl}/sandbox/v1/statement`;
  const requestBody = '';
  const token = await getToken();

  const {timestamp, signature} = await getAuthHeader(method, requestUrl, requestBody, token);

  const response = await axios.get(`${requestUrl}/${accountNumber}/${startDate}/${endDate}`, {
    headers: {
      'BRI-Timestamp': timestamp,
      'BRI-Signature': signature,
      'Authorization': `Bearer ${token}`,
    }
  }).catch(error => console.log(error.message));
  console.log(response.data);
  return response.data;
}

async function transfer(sourceAccount, destAccount, amount, referral) {
  const method = 'POST';
  const requestUrl = `${baseUrl}/sandbox/v2/transfer/internal`;

  const body = {
    "NoReferral": referral,
    "sourceAccount": sourceAccount,
    "beneficiaryAccount": destAccount,
    "Amount": amount,
    "FeeType": "OUR",
    "transactionDateTime": moment(new Date()).tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm:ss"),
    "remark": "Payment"
  };

  const token = await getToken();

  const {timestamp, signature} = await getAuthHeader(method, requestUrl, JSON.stringify(body), token);

  const response = await axios.post(requestUrl, body, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "BRI-Signature": signature,
      "BRI-Timestamp": timestamp,
      "Content-Type": "application/json"
    }
  }).catch(error => console.log(error.message));
  return response.data;
}

export {
  transfer, getMutation, getTransactionStatus, getSaldo
}
