import CryptoJS from 'crypto-js';
import moment from "moment";

class globalFunctions {

// Function Crypto Standard -------------------------------------------------------- {


    static decryptOurBoard(chiperText, saltKey = "adhityaprabowogantengsekaliadhityaprabowohandsomeboyadhityaprabowokeren") {
        var keyHex = CryptoJS.enc.Utf8.parse(saltKey);
        var ivHex = CryptoJS.enc.Utf8.parse("00224488");
        var decrypted = CryptoJS.TripleDES.decrypt(chiperText, keyHex, {
          iv: ivHex,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    
    static encryptOurBoard(text, saltKey = "adhityaprabowogantengsekaliadhityaprabowohandsomeboyadhityaprabowokeren") {
        var keyHex = CryptoJS.enc.Utf8.parse(saltKey);
        var ivHex = CryptoJS.enc.Utf8.parse("00224488");
        var encrypted = CryptoJS.TripleDES.encrypt(text, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    static hashOurBoard(text) {
        return "";
    }
    // } Function Crypto Standard ------------------------------------------------------

// Function parse/map/fetch list table standard ------------------------------------ {

    static mapFields(fields) {
        let arrayFields = [];
        fields.forEach(element => {
                if (element.isFields) arrayFields.push(element.key);
            }
        );

        return arrayFields;
    }

    static togglePrevious100k(object, event) {
        object.pageDataBase = object.pageDataBase - 1;
        event();
    }

    static toggleNext100k(object, event) {
        object.pageDataBase = object.pageDataBase + 1;
        event();
    }

    static toggleDeleteModal (object, item = null, show = false, labelName = "-", fieldNameModal = "showDeleteModal", fieldNameID = "itemDeleteID", fieldNameLabel = 'labelDeleteModal', fieldID = 'id', fieldIDValue = null) {
        object[fieldNameModal] = show;
        if (show) {
            if (fieldIDValue !== null) {
                object[fieldNameID] = fieldIDValue;
                object[fieldNameLabel] = "Are you sure to delete this data : " + labelName + " !!";
            } else {
                object[fieldNameID] = item[fieldID];
                object[fieldNameLabel] = "Are you sure to delete this data : id(" + item[fieldID] + ") / " + labelName + " !!";
            }
        }
    }

    static changeDataPerPage (event, object, functionNameRefreshList, fieldNameDataPerPage) {
        object[fieldNameDataPerPage] = event.target.value;
        object[functionNameRefreshList]();        
    }

    static getBadgeIsActive (status) {
        switch (status) {
            case 1: return 'success' 
            default: return 'secondary'
        }
    }

    static getLabelIsActive (status) {
        switch (status) {
            case 1: return 'Active'
            default: return 'Inactive'
          }
    }
    // } Function parse/map/fetch list table standard ----------------------------------

    static openInNewTab(url) {
        var win = window.open(url, '_blank');
    }

// Function validation form standard ----------------------------------------------- {

    static processCheckFieldForm(object, fieldFormName, fieldName, state = 0) {
        if (state  <= 1) {
            let resultValidationField = this.checkValidationField(
                object,
                fieldFormName,
                object[fieldFormName][fieldName].value, 
                object[fieldFormName][fieldName].validationRules,
                state
            );

            if(resultValidationField.check) {
                object[fieldFormName][fieldName].invalidFeedback = "";
                object[fieldFormName][fieldName].isValid = true;
            } else {
                object[fieldFormName][fieldName].invalidFeedback = object[fieldFormName][fieldName].prefixInvalidFeedback + " : (" + resultValidationField.validationLabel.join(", ") + ")";
                object[fieldFormName][fieldName].isValid = false;
            }
        }
    }

    static getIsValidfield(object, fieldFormName, fieldName) {
        return object[fieldFormName][fieldName].isValid;
    }

    static getInvalidFeedback(object, fieldFormName, fieldName) {
          return object[fieldFormName][fieldName].invalidFeedback;
    }

    static checkValidationField(object, fieldFormName, valueField, validationRules, state){    
        let validationLabel = [];
        let check = true;
        if (validationRules) {
            validationRules.forEach((item) => {
                let valType = item.split(".");
                switch (valType[0]) {
                    case "required": 
                       
                        if (Array.isArray(valueField) === 1) {
                            if(valueField.length === 0){
                                validationLabel.push("Required");
                                check = false;
                            }
                        } else {
                            if(String(valueField).trim() === '' || valueField === null || typeof(valueField) === 'undefined'){
                                validationLabel.push("Required");
                                check = false;
                            }
                        }
                        break;
                    case "min":
                        if(String(valueField).length < parseInt(valType[1])){
                            validationLabel.push(`Min length ${valType[1]}`);
                            check = false;
                        }                            
                        break;
                    case "max":
                        if(String(valueField).length > parseInt(valType[1])){
                            validationLabel.push(`Max length ${valType[1]}`);
                            check = false;
                        }  
                        break;
                    case "len":
                        if(String(valueField).length != parseInt(valType[1])){
                            validationLabel.push(`Equal length ${valType[1]}`);
                            check = false;
                        }  
                        break;
                    case "same" :
                        this.processCheckFieldForm(object, fieldFormName, valType[1], state+1);                           
                        if(valueField != object[fieldFormName][valType[1]].value){
                            validationLabel.push(`not same with ${valType[1]}`);
                            check = false;
                        }                    
                        break
                    case "greater_than_datetime" :
                        if(valueField !== '' && valueField !== null && typeof(valueField) !== 'undefined' &&
                        object[fieldFormName][valType[1]].value !== '' && 
                        object[fieldFormName][valType[1]].value !== null && 
                        typeof(object[fieldFormName][valType[1]].value) !== 'undefined') {
                        this.processCheckFieldForm(object, fieldFormName, valType[1], state+1)                        
                            if(!moment(valueField).isAfter(object[fieldFormName][valType[1]].value, 'minute')){
                                validationLabel.push(`greater than with ${valType[1]}`);
                                check = false;
                            }  
                        }                  
                        break
                    case "less_than_datetime" :
                        if(valueField !== '' && valueField !== null && typeof(valueField) !== 'undefined' &&
                        object[fieldFormName][valType[1]].value !== '' && 
                        object[fieldFormName][valType[1]].value !== null && 
                        typeof(object[fieldFormName][valType[1]].value) !== 'undefined') {
                            this.processCheckFieldForm(object, fieldFormName, valType[1], state+1)                        
                            if(!moment(valueField).isBefore(object[fieldFormName][valType[1]].value, 'minute')){
                                validationLabel.push(`less than with ${valType[1]}`);
                                check = false;
                            }   
                        }                 
                        break
                    case "greater_than" :
                        this.processCheckFieldForm(object, fieldFormName, valType[1], state+1)                        
                        if(valueField > object[fieldFormName][valType[1]].value){
                            validationLabel.push(`greater than with ${valType[1]}`);
                            check = false;
                        }                    
                        break
                    case "less_than" :
                        this.processCheckFieldForm(object, fieldFormName, valType[1], state+1)                        
                        if(valueField < object[fieldFormName][valType[1]].value){
                            validationLabel.push(`less than with ${valType[1]}`);
                            check = false;
                        }                    
                        break                                                                                                   
                    case "pattern":
                        if(String(valueField).trim() !== '' && valueField !== null && typeof(valueField) !== 'undefined') {
                            if (valType[1] == "email") { 
                                var pattern = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Email`);
                                    check = false;                                    
                                }
                            }
                            else if (valType[1] == "password") { 
                                var pattern = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Combination alphabet upper & lower case and number`);
                                    check = false;                                    
                                }
                            }
                            else if (valType[1] == "alpha") { 
                                var pattern = new RegExp("^[A-Za-z ]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Alphabet`);
                                    check = false;                                    
                                }
                            }
                            else if (valType[1] == "phonenumber") {
                                var pattern = new RegExp("^[+]?[0-9]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Phone Number`);
                                    check = false;                                    
                                } 
                            }
                            else if (valType[1] == "alphanumber") {
                                var pattern = new RegExp("^[A-Za-z0-9 ]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Alphabet or Number`);
                                    check = false;                                    
                                } 
                            }
                            else if (valType[1] == "name") {
                                var pattern = new RegExp("^[A-Za-z0-9 '-.]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Alphabet or ' - .`);
                                    check = false;                                    
                                }                                 
                            }
                            else if (valType[1] == "number") {
                                var pattern = new RegExp("^[0-9]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Number`);
                                    check = false;                                    
                                }                                
                            }
                            else if (valType[1] == "lowerspace") {
                                var pattern = new RegExp("^[a-z0-9]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Lowercase and without space`);
                                    check = false;                                    
                                } 
                            }
                            else if (valType[1] == "lowercase") {
                                var pattern = new RegExp("^[a-z0-9 ]*$");
                                if(!pattern.test(valueField)) {
                                    validationLabel.push(`Lowercase`);
                                    check = false;                                    
                                }                                 
                            };
                        }
                        break;
                    default:
                }
            })
        }

        return {
            check,
            validationLabel
        };
    }

    static validationForm(object, fieldFormName) {
        var check = true;

        for (var key in object[fieldFormName]) {
            if(object[fieldFormName][key].isValid === null || !object[fieldFormName][key].isValid) {
                this.processCheckFieldForm(object, fieldFormName, key);
            }

            if(!object[fieldFormName][key].isValid) {
                check = false; 
            }

        }
        return check;
    }

    // } Function validation form standard -----------------------------------------------

// Function helper form standard ------------------------------------ {
    
    static formatDatePickerShow (date) {
        return moment(date).format('dddd, YYYY MMMM DD');
    }

    static formatDatePickerInput (date) {
        return moment(date).format('YYYY-MM-DD');
    }

    static onInputFileChange(object, e, fieldFormName, fieldName, fieldTitle = 'title') {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
            if (fieldTitle in object[fieldFormName])
                object[fieldFormName][fieldTitle].value = files[0].name;
        
            var reader = new FileReader();

        reader.onload = (e) => {
            object[fieldFormName][fieldName].value = e.target.result;
            this.processCheckFieldForm(object, fieldFormName, fieldName);
        };
        
        reader.readAsDataURL(files[0]);
    }   
 
    static removeInputFile (object, fieldFormName, fieldName) {
        object[fieldFormName][fieldName].value = '';
    }

    static configurationTypeData(typeData, metaData) {
        // ['integer','bigint','floating','double','boolean','text','json','array','date','time','datetime','timestamp']
        switch (typeData) {
            case 'integer': return parseInt(metaData);
            case "floating" : return parseFloat(metaData);            
            case 'array': return metaData.replaceAll('["','').replaceAll('"]','').replaceAll("['",'').replaceAll("']",'').replaceAll("','",',').replaceAll('","',',').split(',');            
            case 'json': return JSON.parse(metaData);            
            default: return metaData
        }

    }

    static reloadAddNew(router, path) {
        window.location = router.options.base + path;
    }

    static createDateRange (momentStart, momentEnd) {
        var dateRange = [];

        var start = momentStart.toDate();
        var end = momentEnd.toDate();

        while(start <= end){
            dateRange.push(moment(start).format('YYYY-MM-DD'));
            var newDate = start.setDate(start.getDate() + 1);
            start = new Date(newDate);  
         }

        return dateRange;
    }

    // } Function helper form standard -----------------------------------------------

}

export default globalFunctions;