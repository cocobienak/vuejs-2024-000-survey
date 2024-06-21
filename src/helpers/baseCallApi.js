import axios from 'axios';
import store from '../store';
import router from './../router';
import { api } from '../configurations/services';
import moment from "moment";


const TypeRequestEnum = {
    REQUEST_GET            : "GET",
    REQUEST_POST           : "POST",
    REQUEST_DELETE         : "DELETE",
    REQUEST_PUT            : "PUT",
    REQUEST_PATCH          : "PATCH"
}

const ResponRequestEnum = {
    STATUS_SUCCESS         : "200"
}

class baseCallApiHelper {

    static handleResponse = (eventName, response, callback, isNotify, isLoad) => {
        store.commit('set', ['toastsMessage', []]);

        var dataResponse = [{
            eventName : eventName,
            responseCode: response.data.status.responseCode,
            responseMessage: response.data.status.responseMessage
        }];

        let {
            result
        } = response.data;

        if (isLoad) store.commit('set', ['isLoading', false]);

        if (isNotify) {
            if (dataResponse[0]["responseCode"].toString() === ResponRequestEnum.STATUS_SUCCESS) {
                var toastsCount = store.getters.toastsCount + 1;
                var toastsTime = store.getters.toastsTime; 
                dataResponse[0]["toastKey"] = toastsCount;

                if(toastsTime !== null) {
                    if(moment().diff(toastsTime) <= 1000) {
                        var toastsMessageOld = store.getters.toastsMessageOld; 
                        dataResponse = dataResponse.concat(toastsMessageOld);
                    }
                }

                store.commit('set', ['toastsMessage', dataResponse]);
                store.commit('set', ['toastsMessageOld', dataResponse]);
                store.commit('set', ['toastsCount', toastsCount]);
                store.commit('set', ['toastsTime', moment().format('YYYY-MM-DD HH:mm:ss')]);

            } else {
                var toastsCount = store.getters.toastsCount + 1; 
                var toastsTime = store.getters.toastsTime; 
                dataResponse[0]["toastKey"] = toastsCount;

                if(toastsTime !== null) {
                    if(moment().diff(toastsTime) <= 1000) {
                        var toastsMessageOld = store.getters.toastsMessageOld; 
                        dataResponse = dataResponse.concat(toastsMessageOld);
                    }
                }

                for (var x in result) {
                    if(Array.isArray(result[x])){
                        toastsCount = toastsCount + 1;
                        dataResponse.push({
                            eventName : eventName,
                            responseCode: dataResponse[0]["responseCode"],
                            responseMessage: result[x][0],
                            toastKey: toastsCount
                        });
                    }
                } 

                store.commit('set', ['toastsMessage', dataResponse]);
                store.commit('set', ['toastsMessageOld', dataResponse]);
                store.commit('set', ['toastsCount', toastsCount]);
                store.commit('set', ['toastsTime', moment().format('YYYY-MM-DD HH:mm:ss')]);
            }
        }

        if (callback) {
            callback(dataResponse[0]["responseCode"].toString() === ResponRequestEnum.STATUS_SUCCESS ? true : false, result, dataResponse[0]["responseMessage"]);
        }
    }

    static request(eventName, tokenAuth, addHeader, method, url, data, callback, isNotify, isLoad) {
        const client = axios.create({
            baseURL: url,
            json: true
        });

        if (isLoad) store.commit('set', ['isLoading', true]);

        const headers =  {
            "Content-Type": "application/json",
            "Authorization" : tokenAuth
        };

        if(addHeader !== "" &&  addHeader !== null && typeof(addHeader) !== 'undefined' && typeof(addHeader) === 'object') {
            for (const [key, value] of Object.entries(addHeader)) {
                headers[key] = value;
              }
        }
        
        return client({
                method: method,
                data: data,
                headers: headers,
                //timeout: 40000,
                responseType: 'json',
            })
            .then(response => {

                this.handleResponse(eventName, {
                    data: {
                        status: {
                            responseCode: (typeof(response.data.status) !== 'undefined' && response.data !== null) ? response.data.status.response_code : '200',
                            responseMessage: (typeof(response.data.status) !== 'undefined' && response.data !== null) ? response.data.status.response_message : 'Success call API !!'
                        },
                        result: (typeof(response.data) !== 'undefined' && response.data !== null) ? response.data.result : null
                    }
                }, callback, isNotify, isLoad);
            })
            .catch(error => {

                if ((typeof(error.response) !== 'undefined' && error.response !== null)) {

                    this.handleResponse(eventName, {
                        data: {
                            status: {
                                responseCode:  (typeof(error.response.data.status) !== 'undefined' && error.response.data !== null) ? error.response.data.status.response_code : '400',
                                responseMessage: (typeof(error.response.data.status) !== 'undefined' && error.response.data !== null) ? error.response.data.status.response_message : 'Process failed !!'
                            },
                            result: (typeof(error.response.data.result) !== 'undefined' && error.response.data !== null) ? error.response.data.result : null
                        }
                    }, callback, isNotify, isLoad);
                } else {
                    this.handleResponse(eventName, {
                        data: {
                            status: {
                                responseCode: '400',
                                responseMessage: 'Process failed !!'
                            },
                            result: null
                        }
                    }, callback, isNotify, isLoad);                    
                }



            });

    }

    static requestCheck(eventName, addheader, method, url, data, callback, isNotify, isLoad, isNeedAuth) {
        if(isNeedAuth) {
            var tokenAuthExpired = moment(localStorage.getItem('tokenAuthExpired'));
            var tokenRefreshExpired = moment(localStorage.getItem('tokenRefreshExpired')); 

            var now = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

            // console.log("moment diff tokenAuthExpired");
            // console.log(now);
            // console.log(tokenAuthExpired);
            // console.log(now.diff(tokenAuthExpired));
            // console.log("------------------------------------------");

            // check expired token
            if (now.diff(tokenAuthExpired) < 0) {

                this.request(eventName, localStorage.getItem('tokenAuth'), addheader, method, url, data, callback, isNotify, isLoad);
            } else {

                var isTokenValid = true;

                now = moment(moment().format('YYYY-MM-DD HH:mm:ss'));

                // console.log("moment diff tokenAuthExpired");
                // console.log(now.diff(tokenRefreshExpired));
                // console.log("------------------------------------------");

                // if token refresh is not expired
                if (now.diff(tokenRefreshExpired) < 0) {
                    // Call API token refresh
                    const clientRefresh = axios.create({
                        baseURL: api.system_user.loginRefresh.url,
                        json: true
                    });
                    
                    store.commit('set', ['isLoading', true]);

                    return clientRefresh({
                        method: api.system_user.loginRefresh.method,
                        data: {
                            "refresh_token": localStorage.getItem('tokenRefresh'),
                            "access_token": localStorage.getItem('tokenAuth')
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                        responseType: 'json',
                    })
                    .then((response) => {
                        if ((typeof(response.data) !== 'undefined' && response.data !== null)) {
                            store.commit('set', ['isLoading', false]);

                            store.commit('set', ['statusAuth', "success"]);
                            store.commit('set', ['tokenAuth', response.data.result.token_type + ' ' + response.data.result.access_token]);
                            localStorage.setItem('tokenAuth', response.data.result.token_type + ' ' + response.data.result.access_token); // store the token in localstorage
                            localStorage.setItem('tokenAuthExpired', moment().add(response.data.result.access_token_expire_in, 's').format('YYYY-MM-DD HH:mm:ss'));
                            localStorage.setItem('tokenRefresh', response.data.result.refresh_token);
                            localStorage.setItem('tokenRefreshExpired', response.data.result.refresh_token_expire);
                            var toastsCount = store.getters.toastsCount + 1; 
                            var dataResponse = [{
                                responseCode: "200",
                                responseMessage: "Your token is refreshed !!",
                                toastKey: toastsCount
                            }];
                            dataResponse[0]["toastKey"] = toastsCount;
            
                            store.commit('set', ['toastsMessage', dataResponse]);
                            store.commit('set', ['toastsCount', toastsCount]);
                            this.request(eventName, localStorage.getItem('tokenAuth'), addheader, method, url, data, callback, isNotify, isLoad); 
                        } else {
                            isTokenValid = false; 
                        }
          
                    })
                    .catch((error) => {
                        store.commit('set', ['isLoading', false]);

                        store.commit('set', ['statusAuth', ""]);
                        store.commit('set', ['tokenAuth', ""]);
                        localStorage.removeItem('tokenAuth'); // if the request fails, remove any possible user token if possible
                        localStorage.removeItem('tokenAuthExpired');
                        localStorage.removeItem('tokenRefresh');
                        localStorage.removeItem('tokenRefreshExpired');
                        localStorage.removeItem('systemUserId'); 
                        localStorage.removeItem('systemUserName');
                        localStorage.removeItem('systemUserDomainId');  
                        localStorage.removeItem('systemUserDomain'); 
                        localStorage.removeItem('backlinkclient');                         
                        localStorage.removeItem('backlinkNameclient');

                        localStorage.removeItem('accessRoleMenu');

                        var toastsCount = store.getters.toastsCount + 1; 
                        var dataResponse = [{
                            responseCode: "408",
                            responseMessage: "Your token is expired !!",
                            toastKey: toastsCount
                        }];
                        dataResponse[0]["toastKey"] = toastsCount;
        
                        store.commit('set', ['toastsMessage', dataResponse]);
                        store.commit('set', ['toastsCount', toastsCount]);
    
                        router.push('/login');
                    });
                } else {
                    isTokenValid = false;
                }

                if (!isTokenValid) {
                    store.commit('set', ['isLoading', false]);

                    store.commit('set', ['statusAuth', ""]);
                    store.commit('set', ['tokenAuth', ""]);
                    localStorage.removeItem('tokenAuth'); // if the request fails, remove any possible user token if possible
                    localStorage.removeItem('tokenAuthExpired');
                    localStorage.removeItem('tokenRefresh');
                    localStorage.removeItem('tokenRefreshExpired');
                    localStorage.removeItem('systemUserId'); 
                    localStorage.removeItem('systemUserName'); 
                    localStorage.removeItem('systemUserDomainId');  
                    localStorage.removeItem('systemUserDomain');     
                    localStorage.removeItem('backlinkclient');                         
                    localStorage.removeItem('backlinkNameclient');

                    localStorage.removeItem('accessRoleMenu');

                    var toastsCount = store.getters.toastsCount + 1; 
                    var dataResponse = [{
                        responseCode: "408",
                        responseMessage: "Your token is expired !!",
                        toastKey: toastsCount
                    }];
                    dataResponse[0]["toastKey"] = toastsCount;
    
                    store.commit('set', ['toastsMessage', dataResponse]);
                    store.commit('set', ['toastsCount', toastsCount]);

                    router.push('/login');

                    return false;
                } else {

                }
            }
        } else {
            this.request(eventName, "", addheader, method, url, data, callback, isNotify, isLoad);           
        }
    }

    static callApi(eventName = "Process", addheader, method, url, data, callback, isNotify = false, isLoad = false, isNeedAuth = true) {
        this.requestCheck(eventName, addheader, method, url, data, callback, isNotify, isLoad, isNeedAuth)
    }
}

export default baseCallApiHelper;