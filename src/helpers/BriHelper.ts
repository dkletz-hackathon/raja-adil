import { getToken, getAuthHeader } from "./util";
import {baseUrl} from "../config";
const axios = require('axios');

async function getSaldo(accountNumber) {
    const method = 'GET';
    const requestUrl = `${baseUrl}/sandbox/v1/inquiry`;
    const requestBody = '';
    const token = await getToken();

    const { timestamp, signature } = await getAuthHeader(method, requestUrl, requestBody, token);

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

    const { timestamp, signature } = await getAuthHeader(method, requestUrl, requestBody, token);

    const response = await axios.get(`${requestUrl}?NoReferral=${noReferral}`, {
        headers: {
            'BRI-Timestamp': timestamp,
            'BRI-Signature': signature,
            'Authorization': `Bearer ${token}`,
        }
    }).catch(error => console.log(error.message));
    console.log(response.data);
    return response.data;
}

async function getMutation(accountNumber, startDate, endDate) {
    const method = 'GET';
    const requestUrl = `${baseUrl}/sandbox/v1/statement`;
    const requestBody = '';
    const token = await getToken();

    const { timestamp, signature } = await getAuthHeader(method, requestUrl, requestBody, token);

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

getTransactionStatus('20190329006JE');