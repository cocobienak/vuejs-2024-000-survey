<template>
  <div class="c-app">
    <!-- :header="'Code : ' + toast.responseCode" -->
    <CToaster :autohide="3000">
      <template>
        <CToast 
          v-for="toast in $store.getters.toastsMessage" :key="'toast' + toast.toastKey"
          :show="true"
          :header="toast.eventName"
        >
          {{toast.responseMessage}}.
        </CToast>
      </template>
    </CToaster>
    <div v-if="nextTickForm" :style="styleBody"
      style="position: relative; width: 100%;"
    >
      <div
        style="
              display:block;
              position: absolute; 
              top: 0; 
              bottom: 0;
              left: 0; 
              right: 0;
              border-radius: 16px;
              height: fit-content;
              margin: auto;
          "
      >
        <div v-if="showPageInfo"
          v-html="textPageInfo"
          style="
                background: rgba(187, 187, 187, 0.6);
                border-radius: 16px;
                margin: 0px auto 20px;
                max-width: 900px;
                width:100%; 
                padding: 32px;
            "
          
        >
        </div>
        <div v-for="(surveyPage, indexPage) in  fieldForm.form_json.value.pages" 
              :key="indexPage">
          <div v-if="showPage == indexPage" :style="styePage[indexPage]"
            style="
                border-radius: 16px;
                margin: auto;
                max-width: 900px;
                width:100%; 
                min-height:100px;
                height: 80%;
                padding: 32px 32px 60px;
            "
          >
          <div v-if="surveyPage.show_title">
            <h3>{{ surveyPage.title }}</h3>
          </div>
            <div v-for="(surveyPageField, indexField) in  fieldForm.form_json.value.pages[indexPage].fields" :key="indexField">
              <div v-if="surveyPageField.type == 'description'">
                <div v-if="surveyPageField.show_label">
                  <h3>{{ surveyPageField.label }}</h3>
                </div>
                <div v-if="surveyPageField.options.information !== ''">
                  <p>{{ surveyPageField.options.information }}</p>
                </div>
              </div>
              <div v-if="surveyPageField.show_label">
                <h3>{{ surveyPageField.label }}</h3>
              </div>
              <div v-if="surveyPageField.description !== ''">
                <span>{{ surveyPageField.description }}</span>
              </div>
              <div v-if="surveyPageField.type == 'text'">
                <CRow>
                  <CCol sm="12">
                    <CInput
                      :name="surveyPageField.id"
                      v-model="fieldFormSurvey[surveyPageField.id].value"
                      placeholder=""              
                    />
                  </CCol>
                </CRow>
              </div>
              <div v-if="surveyPageField.type == 'textarea'">
                <div>
                  <CTextarea
                    :name="surveyPageField.id"
                    v-model="fieldFormSurvey[surveyPageField.id].value"
                    placeholder=""
                  />
                </div>
              </div>
              <div v-if="surveyPageField.type == 'radio'">
                <div>
                  <div v-for="(option, indexOption) in surveyPageField.options.option_list" :key="indexOption">
                    <input :name="surveyPageField.id" type="radio" 
                    v-model="fieldFormSurvey[surveyPageField.id].value" 
                    :value="option.value" :id="option.value" />
                      <label class="ml-10" :for="option.value">{{ option.label }}</label>
                  </div>
                </div>
              </div>
              <div v-if="surveyPageField.type == 'checkbox'">
                <div>
                  <div v-for="(option, indexOption) in surveyPageField.options.option_list" :key="indexOption">
                    <input type="checkbox" 
                    v-model="fieldFormSurvey[surveyPageField.id].value" 
                    :value="option.value" :id="option.value" />
                      <label class="ml-10" :for="option.value">{{ option.label }}</label>
                  </div>
                </div>
              </div>
              <div v-if="surveyPageField.type == 'select'">
                <div>
                  <select :name="surveyPageField.id " 
                  v-model="fieldFormSurvey[surveyPageField.id].value">
                    <option v-for="(option, indexOption) in surveyPageField.options.option_list" :key="indexOption" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
              </div>
              <div v-if="surveyPageField.type == 'rating'">
                <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content: flex-start;">
                  <div v-for="(option, indexOption) in parseInt(surveyPageField.options.total_star)">
                    <input :name="surveyPageField.id" type="radio" 
                    v-model="fieldFormSurvey[surveyPageField.id].value" 
                    :value="indexOption+1" :id="indexOption" />
                      <label class="ml-10" :for="indexOption">{{ indexOption+1 }}</label>
                  </div>
                </div>
              </div>
              <div v-if="surveyPageField.type == 'datepicker'">
                <CRow>
                  <CCol sm="12">
                    <datepicker 
                      :name="surveyPageField.id"
                      input-class="form-control"
                      v-model="fieldFormSurvey[surveyPageField.id].value"
                      placeholder="Date ..."
                      :format="globalFunctions.formatDatePickerShow"
                    >              
                    </datepicker>
                  </CCol>
                </CRow>
              </div>

              

              
            </div>
            
            <div
              style="
                  display:block;
                  position: absolute; 
                  bottom: 10px;
                  left: 0; 
                  right: 0;
                  margin: auto ;
                  width:100%; 
                  text-align: center;
              "
            >
              <CButton color="warning" square size="sm" style="margin-right: 10px;margin-left: 10px;"
                v-if="showPage > 0"
                @click="showPage=showPage-1 ">
                  Previous Page
              </CButton>
              <CButton color="primary" square size="sm" style="margin-right: 10px;margin-left: 10px;"
                v-if="showPage == fieldForm.form_json.value.pages.length - 1"
                @click="processFormFormSurvey()">
                  Submit
              </CButton>
              <CButton color="warning" square size="sm" style="margin-right: 10px;margin-left: 10px;"
                v-if="showPage < fieldForm.form_json.value.pages.length - 1"
                @click="showPage=showPage+1 ">
                  Next Page
              </CButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @import '../../assets/scss/page_form';
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"></style>

<script>
import router from '../../router';
import store from '../../store';
import Multiselect from 'vue-multiselect';
import VueCtkDateTimePicker, { f } from 'vue-ctk-date-time-picker';
import Datepicker from 'vuejs-datepicker';
import { uuid } from 'vue-uuid';

import ModalAddImageEditor from '../../components/ModalAddImageEditor.vue';

import moment from "moment";
import { api } from '../../configurations/services';

import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

import axios from 'axios';
import { ref } from 'vue';
export default {
  name: 'Form',
  components: {     
    Multiselect,
    VueCtkDateTimePicker,
    ModalAddImageEditor,
    Datepicker
  },
  
  data () {
    return  {
      
      store,
      moment,
      globalFunctions,
      vm : this,
      showForm: true,
      idEncrypted : "",
      idSurvey : "",
      aaaaa:null,
      showPageInfo : false,
      textPageInfo : "",
      nextTickForm : true,
      showPage : 0,
      styleBody: {
        background: '#fff'
      },
      styePage: [
        {
          background: '#fff'
        }
      ],

      tokenAuth : "",
      fieldForm: {
        id : {
          value : null,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null          
        },
        survey_name : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.500'],
          isValid : null        
        },
        background_color : {
          value : "#ffffff",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        background_url : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        form_json : {
          value : {
            pages: [
              {
                title: "new page",
                show_title : false,
                background_color : "#bbbbbb99",
                fields : [
                  {
                    id : uuid.v1(),
                    label : 'Label Description',
                    show_label : true,
                    description : 'Description',
                    type : 'description',
                    default_value : '',
                    require : false,
                    options : {
                      information : ""
                    }
                  }
                ]
              }
            ]
          },
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        participant_limit : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        }, 
        participant_type : {
          value : "free",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.20'],
          isValid : null        
        },
        survey_start : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['less_than_datetime.survey_end'],
          isValid : null        
        }, 
        survey_end : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['greater_than_datetime.survey_start'],
          isValid : null        
        },
        survey_open : {
          value : 0,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        domain_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        su_oauth_clients_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null       
        }        
      },
      fieldFormSurvey: {
      }
    }
  },
  created () {
    document.querySelector("body").style.overflow = "hidden";
    const params = new URLSearchParams(window.location.search);
    if (params.has('dd')) {
      this.idEncrypted = globalFunctions.decryptOurBoard(params.get('dd')).split('||');
      if (this.idEncrypted.length > 1) {
        this.idSurvey = this.idEncrypted[1];
        if (this.idSurvey !== "") {
          const dataLogin = {
            username		: "visitor.request",
            password    : globalFunctions.encryptOurBoard("Password1234!@"),
            is_survey_form : true
          };

          baseCallApiHelper.callApi(
            "Validasi Web",
            null,
            api.system_user.login.method,
            api.system_user.login.url, 
            dataLogin, 
            (status, data, message) => {
              if(data.access_token !== null && data.access_token !== "") {
                // console.log("Login Expired");
                // console.log(moment().add(data.access_token_expire_in, 's').format('YYYY-MM-DD HH:mm:ss'));
                // console.log("------------------------------------------");

                this.tokenAuth = data.token_type + ' ' + data.access_token;

                this.processGetFormSurveyDetail();
              } else {
                // console.log("Login Expired");
                // console.log(moment().add(data.access_token_expire_in, 's').format('YYYY-MM-DD HH:mm:ss'));
                // console.log("------------------------------------------");
              }
            }, 
            false, 
            false,
            false
          ); 
        }
      }
    }
  },
  mounted(){
  },
  methods:{
    processGetFormSurveyDetail: function () {
      const dataSurveyDetail = {
      };

      const client = axios.create({
        baseURL: api.form_survey.read.url + '/' + this.idSurvey,
        json: true
      });

      const headers =  {
          "Content-Type": "application/json",
          "Authorization" : this.tokenAuth
      };

      client({
          method: api.form_survey.read.method,
          data: dataSurveyDetail,
          headers: headers,
          //timeout: 40000,
          responseType: 'json',
      })
      .then(response => {
        if(response.status === 200) {
            var result = response.data.result.data;
            this.fieldForm.id.value = result.id;
            this.fieldForm.domain_id.value = result.domain_id;
            this.fieldForm.survey_name.value = result.survey_name;
            this.fieldForm.background_url.value = result.background_url;
            this.fieldForm.background_color.value = result.background_color;
            this.fieldForm.participant_limit.value = result.participant_limit;
            this.fieldForm.participant_type.value = result.participant_type;
            this.fieldForm.survey_start.value = result.survey_start;
            this.fieldForm.survey_end.value = result.survey_end;

            if (typeof(result.background_url) !== 'undefined' && result.background_url !== null
            && result.background_url !== "") {
              this.styleBody.background = "url(" + result.background_url + ") no-repeat center center fixed";
              this.styleBody.webkitBackgroundSize = "cover";
              this.styleBody.mozBackgroundSize = "cover";
              this.styleBody.oBackgroundSize = "cover";
              this.styleBody.backgroundSize = "cover";
            } else {
              console.log(result.background_color);
              this.styleBody.background = result.background_color;
            }

            var form_jsonTemp = JSON.parse(result.form_json);
            form_jsonTemp.pages.forEach((page, indexPage) => {
        
              this.styePage[indexPage] = {
                background: page.background_color,
                color: page.font_color
              };

              page.fields.forEach((field, indexField) => {
                this.fieldFormSurvey[field.id] = {
                  id : field.id,
                  label : field.label,
                  show_label : field.show_label,
                  value : field.default_value,
                  type : field.type,
                  prefixInvalidFeedback : "This field must be",
                  invalidFeedback : "This field must be check !!!",
                  validationRules : [],
                  isValid : null        
                };

                if (field.type == 'checkbox') {
                  this.fieldFormSurvey[field.id].value = [];
                }
                
                if(field.require) {
                  this.fieldFormSurvey[field.id].validationRules.push('required');
                }

                if (field.type == 'text' || field.type == 'textarea') {
                  if (typeof(field.options.minimal_characters) !== 'undefined' && field.options.minimal_characters !== null
                  && parseInt(field.options.minimal_characters) !== 0) {
                    this.fieldFormSurvey[field.id].validationRules.push('min.' + field.options.minimal_characters);
                  }
                  if (typeof(field.options.maximal_characters) !== 'undefined' && field.options.maximal_characters !== null
                  && parseInt(field.options.maximal_characters) !== 0) {
                    this.fieldFormSurvey[field.id].validationRules.push('max.' + field.options.maximal_characters);
                  }
                }



              });
            });
            this.fieldForm.form_json.value = form_jsonTemp;

            this.nextTickForm = false;
            
            this.$nextTick(() => {
              this.nextTickForm = true;

            });
        } else {
          alert("Something went wrong, please call the administrator !!!")
        }
      })
      .catch(error => {
        console.log(error);
        // if (typeof(error.response.data.status) !== 'undefined' && error.response.data !== null) {
        //   alert(error.response.data.status.response_message);
        // } else {
        //   alert("Something went wrong, please call the administrator !!!")
        // }
      });
    },
    processFormFormSurvey: function (e) {

      if (globalFunctions.validationForm(this, 'fieldFormSurvey')) {
        var respondJson = [];
        Object.entries(this.fieldFormSurvey).forEach(entry => {
          const [key, field] = entry;
        
          if (field.type == 'datepicker') {
            field.value = (field.value !== "" && field.value !== null) 
                            ? globalFunctions.formatDatePickerInput(field.value) : null;
          }
          
          var respondJsonTemp = {
            id : field.id,
            label : field.label,
            value : field.value      
          };  

          respondJson.push(respondJsonTemp);
        });

        const dataSurveyCreate = {
          domain_id : this.fieldForm.domain_id.value,
          form_survey_id : this.fieldForm.id.value,
          respond_json : JSON.stringify(respondJson)
        };

        const client = axios.create({
          baseURL: api.respond_survey.create.url,
          json: true
        });

        const headers =  {
            "Content-Type": "application/json",
            "Authorization" : this.tokenAuth
        };

        client({
            method: api.respond_survey.create.method,
            data: dataSurveyCreate,
            headers: headers,
            //timeout: 40000,
            responseType: 'json',
        })
        .then(response => {
          // console.log(response);
          if(response.status === 200) {
            this.showPage = this.fieldForm.form_json.value.pages.length + 1;

            this.textPageInfo = '<span>Terima kasih</span>';
            this.showPageInfo = false;
            this.nextTickForm = false;
              
            this.$nextTick(() => {
              this.nextTickForm = true;
              this.showPageInfo = true;

            });


          } else {
            alert("Something went wrong, please call the administrator !!!")
          }
        })
        .catch(error => {
          console.log(error);
          // if (typeof(error.response.data.status) !== 'undefined' && error.response.data !== null) {
          //   alert(error.response.data.status.response_message);
          // } else {
          //   alert("Something went wrong, please call the administrator !!!")
          // }
        });        
        
      } else {
        this.textPageInfo = "<b>Please check the form again !!!</b><br/>";
        Object.entries(this.fieldFormSurvey).forEach(entry => {
          const [key, field] = entry;
          if (field.isValid === false) {
            this.showPageInfo = true;
            this.textPageInfo += '<br/><span class="info-error">'+ field.label +" : "+ field.invalidFeedback+"</span>";
          }
        });
      }
    }
  }
}
</script>
