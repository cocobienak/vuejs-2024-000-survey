import axios from 'axios'
import store from '../store'
import moment from "moment";

class ExternalCallApiHelper {
    static TypeRequestEnum = {
        REQUEST_GET            : "GET",
        REQUEST_POST           : "POST",
        REQUEST_DELETE         : "DELETE",
        REQUEST_PUT            : "PUT",
        REQUEST_PATCH          : "PATCH"
    }

    static ResponRequestEnum = {
        STATUS_SUCCESS         : "200"
    }

    static handleResponse = (response, callback, isNotify, isLoad) => {
        const {
            responseCode,
            responseMessage
        } = response.data.status;

        let {
            result
        } = response.data.result;

        if (isNotify) {
            const notif = responseCode === this.ResponRequestEnum.STATUS_SUCCESS ? "Success" : "Error";
            notification[notif.toLocaleLowerCase()]({
                message: notif,
                description: responseMessage,
            });
        }

        if (callback) {
            callback(responseCode === this.ResponRequestEnum.STATUS_SUCCESS ? true : false, result, responseMessage);
        }
    }

    static request(method, url, data, callback, isNotify, isLoad) {

        const client = axios.create({
            baseURL: url,
            json: true
        });

        if (isLoad) store.commit("loading", true);

        return client({
                method,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                },
                // timeout: 40000,
                responseType: 'json',
            })
            .then(async response => {
                this.handleResponse({
                    data: {
                        status: {
                            responseCode: "200",
                            responseMessage: response
                        },
                        result: response,
                    }
                }, callback, isNotify, isLoad);
            })
            .catch(async error => {
                this.handleResponse({
                    data: {
                        status: {
                            responseCode: "500",
                            responseMessage: error
                        },
                        result: error,
                    }
                }, callback, isNotify, isLoad);
            });

    }

    static post(url, data, callback, isNotify = false, isLoad = false) {
        this.request(this.TypeRequestEnum.REQUEST_POST, url, data, callback, isNotify, isLoad)
    }

    static put(url, data, callback, isNotify = false, isLoad = false) {
        this.request(this.TypeRequestEnum.REQUEST_PUT, url, data, callback, isNotify, isLoad)
    }

    static patch(url, data, callback, isNotify = false, isLoad = false) {
        this.request(this.TypeRequestEnum.REQUEST_PATCH, url, data, callback, isNotify, isLoad)
    }

    static delete(url, data, callback, isNotify = false, isLoad = false) {
        this.request(this.TypeRequestEnum.REQUEST_DELETE, url, data, callback, isNotify, isLoad)
    }

    static get(url, data, callback, isNotify = false, isLoad = false) {
        this.request(this.TypeRequestEnum.REQUEST_GET, url, data, callback, isNotify, isLoad)
    }
}

export default ExternalCallApiHelper;