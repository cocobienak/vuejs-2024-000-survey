<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormFormSurvey"
        >
          <CButton type="submit" color="success" square size="sm"
          >
            Save
          </CButton>
          <CButton v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"
          color="primary"
          variant="outline"
          square
          size="sm"
          class="ml-10"
          @click="globalFunctions.openInNewTab(urlEmbedIframe)"
        >
          Preview
        </CButton>
        <CButton v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"
          color="primary"
          variant="outline"
          square
          size="sm"
          class="ml-10"
          @click="showModalEmbedIframe = true"
        >
          Embed Iframe
        </CButton>
          <!-- Start Form header -->
            <div style="float:right" v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
                <CButton
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  @click="globalFunctions.reloadAddNew($router, 'form-survey/add')"
                >
                Add new
              </CButton>
            </div>
            <hr/>
            <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
              <CCol sm="12">
                  <label class="text-info">Created by : {{createdBy}} , {{ moment(createdOn).format('LLL') }}</label>
                  <label class="text-info" style="float:right;">Modified by : {{modifiedBy}} , {{ moment(modifiedOn).format('LLL') }}</label>

              </CCol>
              <hr/>
            </CRow>
          <!-- End Form header -->

          <!-- Start Jika Super Administrator yang login -->
            <CRow v-if="((activeOauthClientId == 1) && (fieldForm.id.value === null || fieldForm.id.value === ''))">
              <CCol sm="12">
                <div>
                  <label>Oauth Clients</label>
                  <multiselect 
                    v-model="fieldForm.su_oauth_clients_id.value" 
                    :options="fieldForm.su_oauth_clients_id.options" 
                    :custom-label="optionsOauthClients" 
                    :allow-empty="true"
                    placeholder="Select one"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'su_oauth_clients_id'); processGetListDomain();"
                    label="name" track-by="name">
                  </multiselect>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldForm.su_oauth_clients_id.isValid === null) ? false : !fieldForm.su_oauth_clients_id.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'su_oauth_clients_id')}}
                    </label>
                </div>
              </CCol>
            </CRow>  
            <CRow v-if="showDomain">
              <CCol sm="12">
                <div>
                  <label>Select Domain</label>
                  <multiselect 
                    v-model="fieldForm.domain_id.value" 
                    :options="fieldForm.domain_id.options" 
                    :custom-label="optionsDomain" 
                    :allow-empty="true"
                    placeholder="Select one"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'domain_id')"                 
                    label="code" track-by="name">
                  </multiselect>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldForm.domain_id.isValid === null) ? false : !fieldForm.domain_id.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'domain_id')}}
                    </label>
                </div> 
              </CCol>
            </CRow>        
            <hr v-if="(((activeOauthClientId == 1) && (fieldForm.id.value === null || fieldForm.id.value === '')) || showDomain)"/>
          <!-- End Jika Super Administrator yang login -->

          <!-- Start Field Form Survey -->
            <CRow>
              <CCol sm="12">
                  <CInput
                  name="survey_name"
                  v-model="fieldForm.survey_name.value"
                  placeholder="Name ..."
                  :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'survey_name')"
                  :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'survey_name')"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'survey_name')"                
                  label="Survey Name"
                  />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  name="participant_limit"
                  v-model="fieldForm.participant_limit.value"
                  placeholder="Participant limit ..."
                  :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'participant_limit')"
                  :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'participant_limit')"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'participant_limit')"
                  label="Participant Limit (Fill `0` if not limited.)"
                />
              
                <div role="group" class="form-group">
                  <label for="pickcolorbackground" class="" style="display:block">Choose Background color (if background image empty) :</label>
                  <input id="pickcolorbackground" type="color" class="form-control inline-block w-25p mr-10"
                    v-model="fieldForm.background_color.value" 
                    value="fieldForm.background_color.value"  />
                  <input id="pickcolorbgpage" type="text" class="form-control inline-block w-50p"
                      v-model="fieldForm.background_color.value" 
                      value="fieldForm.background_color.value"  />
                  <label for="pickcolorbackground" class="" style="display:block">(Chrome pickcolor not support transparant, fill the text with HEX color)</label>

                </div>
              </CCol> 
              <CCol sm="6" class="box-border" style="display:table-cell;vertical-align: middle;text-align:left;">
                  <label class="text-info"> </label>
                  <CButton
                    style="margin-left:8px;"
                    color="info"
                    square
                    size="sm"
                    @click="toggleModalChooseBackground()"
                  >
                    Choose Background Image
                </CButton>
                <br/><br/>            
                <div v-if="fieldForm.background_url.value !== '' && fieldForm.background_url.value !== null" 
                style="display:block; vertical-align: middle; text-align: left; max-width:500px">

                  <div>
                    <span 
                      style="background: #e2e2e2; vertical-align: middle; 
                      text-align: center; display:table-cell; width: 600px; 
                      height: 300px; border: 2px solid rgb(216, 216, 216); 
                      border-radius: 6px;"
                    >                
                      <img 
                        style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                        :src="fieldForm.background_url.value" 
                      />  
                    </span>
                  </div>
                  <br/>
                  <CButton
                    style="margin-left:8px;"
                    color="warning"
                    square
                    size="sm"
                    @click="fieldForm.background_url.value = ''"
                  >
                      <span style="color:#fff;">Remove Background</span>
                  </CButton>

                </div>
              </CCol>
            </CRow> 
            <CRow>
              <CCol sm="6">
                <div role="group" class="form-group">              
                  <label>Survey Start</label>              
                  <VueCtkDateTimePicker 
                    v-model="fieldForm.survey_start.value"
                    id="survey_start_input"
                    format="YYYY-MM-DD HH:mm:ss"
                    formatted="ddd, YYYY MMM DD, HH:mm"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'survey_start')"
                    :no-value-to-custom-elem="false">  
                  </VueCtkDateTimePicker>   
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                      v-show="(fieldForm.survey_start.isValid === null) ? false : !fieldForm.survey_start.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'survey_start')}}
                  </label>   
                </div>     
              </CCol>
              <CCol sm="6">
                <div role="group" class="form-group">              
                  <label>Survey End</label>              
                  <VueCtkDateTimePicker 
                    v-model="fieldForm.survey_end.value"
                    id="survey_end_input"
                    format="YYYY-MM-DD HH:mm:ss"
                    formatted="ddd, YYYY MMM DD, HH:mm"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'survey_end')"
                    :no-value-to-custom-elem="false">  
                  </VueCtkDateTimePicker>   
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                      v-show="(fieldForm.survey_end.isValid === null) ? false : !fieldForm.survey_end.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'survey_end')}}
                  </label> 
                </div>       
              </CCol>            
            </CRow>
          <!-- End Field Form Survey -->

          <!-- Page List -->
          <div v-if="nextTickPageSurvey">
            <div class="box-border bg-big-box" 
            v-for="(surveyPage, indexPage) in  fieldForm.form_json.value.pages" 
            :key="indexPage">
                <label class="button-click" @click="toogleShowHidePage(indexPage)" >
                  # {{ indexPage + 1  }} Page : {{ surveyPage.title }}
                  <i v-if="fieldForm.form_json.config_pages[indexPage].show" class="arrow mb-min2px up"></i>
                  <i v-else class="arrow mb-plus2px down"></i>
                </label>
                <hr/>
              <!-- Page List -->
              <div v-if="fieldForm.form_json.config_pages[indexPage].show">                   
                <CRow>
                  <CCol sm="6">
                      <CInput
                      name="title_page"
                      v-model="fieldForm.form_json.value.pages[indexPage].title"
                      placeholder="Title ..."               
                      label="Title page"
                      />
                  </CCol>
                  <CCol sm="3">
                    <label>Display title on the form survey</label><br>
                    <label class="c-switch form-check-label c-switch-success">
                      <input type="checkbox" class="c-switch-input form-check-input"                           
                        v-model="fieldForm.form_json.value.pages[indexPage].show_title">
                      <span class="c-switch-slider"></span>
                    </label> 
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="3">
                    <div role="group" class="form-group">
                      <label for="pickcolorbgpage" class="">Choose Page Background color  :</label>
                      <input id="pickcolorbgpage" type="color" class="form-control inline-block w-25p mr-10"
                        v-model="fieldForm.form_json.value.pages[indexPage].background_color" 
                        value="fieldForm.form_json.value.pages[indexPage].background_color"  />
                      <input id="pickcolorbgpage" type="text" class="form-control inline-block w-50p"
                        v-model="fieldForm.form_json.value.pages[indexPage].background_color" 
                        value="fieldForm.form_json.value.pages[indexPage].background_color"  />
                      <label for="pickcolorbackground" class="" style="display:block">(Chrome pickcolor not support transparant, fill the text with HEX color)</label>
                    </div>
                  </CCol>
                  <CCol sm="3">
                    <div role="group" class="form-group">
                      <label for="pickcolorfontpage" class="mr-50">Choose Page Font color  :</label>
                      <input id="pickcolorfontpage" type="color" class="form-control inline-block w-25p mr-10"
                        v-model="fieldForm.form_json.value.pages[indexPage].font_color" 
                        value="fieldForm.form_json.value.pages[indexPage].font_color"  />
                      <input id="pickcolorfontpage" type="text" class="form-control inline-block w-50p"
                        v-model="fieldForm.form_json.value.pages[indexPage].font_color" 
                        value="fieldForm.form_json.value.pages[indexPage].font_color"  />
                      <label for="pickcolorbackground" class="" style="display:block">(Chrome pickcolor not support transparant, fill the text with HEX color)</label>
                    </div>
                  </CCol>
                </CRow>
                <!-- Field List -->
                <div v-if="nextTickPageFieldsSurvey">
                  <div v-for="(surveyPageField, indexField) in  fieldForm.form_json.value.pages[indexPage].fields" :key="indexField">
                    <div class="box-border bg-small-box"> 
                      <div v-if="fieldForm.form_json.value.pages[indexPage].fields.length > 1"
                        class="button-click x-icon-remove" @click="fieldForm.form_json.value.pages[indexPage].fields.splice(indexField, 1)">
                        x
                      </div>
                      <CRow>
                        <CCol sm="6">
                          <div class="input-flex">
                            <label>Type Input : </label>
                            <multiselect 
                              v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].type" 
                              :options="optionsTypeInputList" 
                              :allow-empty="false"
                              @input="toogleChangePageFieldsSurvey(indexPage, indexField)"
                              placeholder="Select one">
                            </multiselect>
                          </div> 
                        </CCol>
                      </CRow>
                      <br>

                      <!-- Config Input Default -->
                      <CRow>
                        <CCol sm="6">
                            <CTextarea
                              name="label_input"
                              v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].label"
                              placeholder="Label ..."
                              label="Label Input"
                            />
                        </CCol>
                        <CCol sm="3">
                          <label>Display label on the form survey</label><br>
                          <label class="c-switch form-check-label c-switch-success">
                            <input type="checkbox" class="c-switch-input form-check-input"                           
                              v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].show_label">
                            <span class="c-switch-slider"></span>
                          </label> 
                        </CCol>
                        <CCol sm="3" v-if="surveyPageField.type !== 'description'">
                          <label>Require</label><br>
                          <label class="c-switch form-check-label c-switch-success">
                            <input type="checkbox" class="c-switch-input form-check-input"                           
                              v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].require">
                            <span class="c-switch-slider"></span>
                          </label> 
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol sm="6" v-if="surveyPageField.type !== 'description'">
                          <CTextarea
                            name="description_input"
                            v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].description"
                            placeholder="description input ..."
                            label="Description"
                          />
                        </CCol>
                        <CCol sm="6" v-if="surveyPageField.type !== 'description'">
                            <!-- <CInput
                                name="default_value"
                                v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.default_value"
                                placeholder="Default Value ..."               
                                label="Default Value"
                              /> -->
                        </CCol>
                      </CRow>

                      <div v-if="surveyPageField.type === 'text' || surveyPageField.type === 'textarea'">
                        <CRow>
                          <CCol sm="6">
                              <CInput
                                name="minimal_characters"
                                v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.minimal_characters"
                                placeholder="0"               
                                label="Minimal Characters"
                              />
                          </CCol>
                          <CCol sm="6">
                              <CInput
                                name="maximal_characters"
                                v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.maximal_characters"
                                placeholder="0"               
                                label="Maximal Characters"
                              />
                          </CCol>
                        </CRow>
                      </div>
                      <div v-else-if="surveyPageField.type === 'select' || surveyPageField.type === 'checkbox' || surveyPageField.type === 'radio'">
                        <!-- <CRow v-if="surveyPageField.type === 'checkbox'">
                          <CCol sm="6">
                              <CInput
                                name="minimal_checked"
                                v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.minimal_checked"
                                placeholder="0"               
                                label="Minimal Checked"
                              />
                          </CCol>
                          <CCol sm="6">
                              <CInput
                                name="maximal_checked"
                                v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.maximal_checked"
                                placeholder="0"               
                                label="Maximal Checked"
                              />
                          </CCol>
                        </CRow> -->
                        <div v-for="(optionList, indexOptionList) in  fieldForm.form_json.value.pages[indexPage].fields[indexField].options.option_list" :key="indexOptionList">
                          <div class="box-border">
                            # {{ indexOptionList + 1  }} Option
                            <div v-if="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.option_list.length > 1"
                              class="button-click x-icon-remove" @click="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.option_list.splice(indexOptionList, 1)">
                              x
                            </div>
                            <CRow>
                              <CCol sm="6">
                                  <CInput
                                    name="value"
                                    v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.option_list[indexOptionList].value"
                                    placeholder="Value ..."               
                                    label="Value"
                                  />
                              </CCol>
                              <CCol sm="6">
                                  <CInput
                                    name="label"
                                    v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.option_list[indexOptionList].label"
                                    placeholder="Label ..."               
                                    label="Label"
                                  />
                              </CCol>
                              
                            </CRow>
                            <CRow>
                              <CCol sm="3">
                                <CButton variant="outline" color="info" square size="sm" style="margin-right: 10px;"
                                  @click="toogleAddFieldOptionListSurvey(indexPage, indexField, indexOptionList); ">
                                    Add Option Below
                                </CButton>
                              </CCol>
                            </CRow>
                          </div>

                        </div>
                      </div>
                      <div v-else-if="surveyPageField.type === 'rating'">
                        <CRow>
                          <CCol sm="3">
                            <CSelect
                              name="total_star"
                              :value.sync="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.total_star"
                              label="Total Star"
                              :options="['2','3','4','5','6','7','8','9','10']"
                            />
                          </CCol>
                          <CCol sm="3">
                            <CSelect
                              name="type_rating"
                              :value.sync="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.type"
                              label="Type Rating"
                              :options="['number']"
                            />
                          </CCol>
                        </CRow>
                      </div>
                      <div v-else-if="surveyPageField.type === 'datepicker'"></div>
                      <div v-else>
                        <CTextarea
                          name="information"
                          v-model="fieldForm.form_json.value.pages[indexPage].fields[indexField].options.information"
                          placeholder="fill your description"
                        />
                      </div>

                      <br>
                      <CRow>
                        <CCol sm="3">
                          <CButton variant="outline" color="info" square size="sm" style="margin-right: 10px;"
                            @click="toogleAddPageFieldsSurvey(indexPage, indexField); ">
                              Add Input Below
                          </CButton>
                        </CCol>
                      </CRow>
                    </div>



                  </div>
                </div>
                <br>
              </div>
              <CButton color="info" square size="sm" style="margin-right: 10px;"
                @click="toogleAddPageSurvey(indexPage); ">
                  Add Page Below
              </CButton>
              <CButton color="info" square size="sm" style="margin-right: 10px;"
                @click="toogleShowHidePage(indexPage)">
                  <span v-if="fieldForm.form_json.config_pages[indexPage].show">Hide Page</span>  
                  <span v-else>Show Page</span>  
              </CButton>
              <div style="margin-right:6px;display: inline-block;"> 
                Page Order : 
              </div>
              <div style="margin-right:6px;display: inline-block;"> 
                <CSelect
                  class="form-control-height"
                  name="page_order"
                  :value="indexPage + 1"
                  @change="pageSurveyOrderChange($event, indexPage)" 
                  :options="fieldForm.form_json.value.pages.map((o, index) => { return { value: index + 1, label: index + 1 } })"
                />  
              </div>

              <CButton v-if="fieldForm.form_json.value.pages.length > 1" 
              variant="outline" color="danger" square size="sm" 
              style="float:right;"
              @click="globalFunctions.toggleDeleteModal(vm, surveyPage, true, 
                surveyPage.title, 
                'showDeleteModalPageSurvey', 
                'itemDeleteIDPageSurvey', 
                'labelDeleteModalPageSurvey',
                null,
                indexPage)"
              >
                  Remove Page
              </CButton>
            </div>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
    <CModal
      :centered="true"
      title="Embed Iframe !!"
      color="warning"
      :show.sync="showModalEmbedIframe"
    >
      <label>
        {{this.tagEmbedIframe}}
      </label>

      <div slot="footer-wrapper" class="w-100">
        <div class="modal-footer">

          <CButton
            color="secondary"
            square
            size="sm"
            @click="showModalEmbedIframe = false"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>
    <CModal
      :centered="true"
      title="Confirmation Delete !!"
      color="warning"
      :show.sync="showDeleteModalPageSurvey"
    >
      <label>{{labelDeleteModalPageSurvey}}</label>

      <div slot="footer-wrapper" class="w-100">
        <div class="modal-footer">
          <CButton
            color="warning"
            square
            size="sm"
            @click="toogleRemovePageSurvey()"
          >
            Delete
          </CButton>
          <CButton
            color="secondary"
            square
            size="sm"
            @click="globalFunctions.toggleDeleteModal(vm, null, false, null, 'showDeleteModalPageSurvey', 'itemDeleteIDPageSurvey', 'labelDeleteModalPageSurvey')"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>
    <ModalAddImageEditor ref="ModalAddImageEditor" />        

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
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import { uuid } from 'vue-uuid';

import ModalAddImageEditor from '../../components/ModalAddImageEditor.vue';

import moment from "moment";
import { api } from '../../configurations/services';

import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'FormSurveyForm',
  components: {     
    Multiselect,
    VueCtkDateTimePicker,
    ModalAddImageEditor
  },
  data () {
    return {
      router,
      store,
      moment,
      globalFunctions,
      vm : this,
      activeOauthClientId : localStorage.getItem('oauthClientId'),
      activeSystemUserName : localStorage.getItem('systemUserName'),
      activeSystemUserId : localStorage.getItem('systemUserId'),
      activeSystemUserDomain : localStorage.getItem('systemUserDomain'),      
      createdBy : "-",
      createdOn : "-",
      modifiedBy : "-",
      modifiedOn : "-",
      showDomain : false,
             
      idEncrypted : null,
      nextTickPageFieldsSurvey : true,
      nextTickPageSurvey : true,
      optionsTypeInputList : [
        "description",
        "text",
        "textarea",
        "select",
        "radio",
        "checkbox",
        "rating",
        "datepicker"
      ],
      defaultOptionsTypeInput : {
        description : {
          information : ""
        },
        text : {
          minimal_characters : 0,
          maximal_characters : 0,
        },
        textarea : {
          minimal_characters : 0,
          maximal_characters : 0,
        },
        select : {
          option_list : [
            {
              value : "value 1",
              label : "label 1",
            }
          ]
        },
        radio : {
          option_list : [
            {
              value : "value 1",
              label : "label 1",
            }
          ]
        },
        checkbox : {
          option_list : [
            {
              value : "value 1",
              label : "label 1",
            }
          ],
          minimal_checked : 0,
          maximal_checked : 0
        },
        rating : {
          type : "number",
          total_star : 2,
        },
        datepicker : {
        }
      },
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
                font_color : "#000",
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
          config_pages: [
            {
              show: true
            }
          ],
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

      tagEmbedIframe : '',
      urlEmbedIframe : null,
      showModalEmbedIframe : false,

      itemDeleteIDPageSurvey : null,
      showDeleteModalPageSurvey : false,
      labelDeleteModalPageSurvey : "",

    }
  },
  created () {
    if (this.$route.params.id) {
      this.processGetFormSurveyDetail();
      this.idEncrypted = globalFunctions.encryptOurBoard('binusdigita||' + this.$route.params.id + '||binussurvey');
      const routeData = router.resolve({name: 'form'});
      var base_url = window.location.origin;
      this.urlEmbedIframe = base_url + routeData.href + '?dd=' + this.idEncrypted;
      this.tagEmbedIframe = '<iframe width="640px" height="480px" src="' + this.urlEmbedIframe + '" frameborder="0" marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>';
    } else {
      // if super admin
      if (this.activeOauthClientId == 1) {
        this.processGetOauthClientsList();
      }

    }
  },
  mounted() {
  },
  methods: {
    processGetFormSurveyDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get stories author detail",
        null,
        api.form_survey.read.method,
        api.form_survey.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = data.data.id;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"]; 

            this.fieldForm.survey_name.value = data.data.survey_name;
            this.fieldForm.background_url.value = data.data.background_url;
            this.fieldForm.background_color.value = data.data.background_color;

            this.fieldForm.participant_limit.value = data.data.participant_limit;
            this.fieldForm.participant_type.value = data.data.participant_type;
            this.fieldForm.survey_start.value = data.data.survey_start;
            this.fieldForm.survey_end.value = data.data.survey_end;

            var form_jsonTemp = JSON.parse(data.data.form_json);
            form_jsonTemp.pages.forEach((page, indexPage) => {
        
              this.fieldForm.form_json.config_pages[indexPage] = {
                show: false
              };
            });
            this.fieldForm.form_json.value = form_jsonTemp;

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },
    processFormFormSurvey: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        const data = {
            survey_name     : this.fieldForm.survey_name.value,
            background_url  : this.fieldForm.background_url.value,
            background_color     : this.fieldForm.background_color.value,
            participant_limit  : this.fieldForm.participant_limit.value,
            participant_type     : this.fieldForm.participant_type.value,
            form_json  : JSON.stringify(this.fieldForm.form_json.value),
            survey_start : null,
            survey_end : null
        }; 

        if (this.fieldForm.survey_start.value !== null || this.fieldForm.survey_start.value !== '') {
          data.survey_start = this.fieldForm.survey_start.value;
        }
        if (this.fieldForm.survey_end.value !== null || this.fieldForm.survey_end.value !== '') {
          data.survey_end = this.fieldForm.survey_end.value;
        }

        if (this.fieldForm.id.value === null) {

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' 
            || this.fieldForm.su_oauth_clients_id.value ==='') 
              ? null : this.fieldForm.su_oauth_clients_id.value.id;

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' 
            || this.fieldForm.su_oauth_clients_id.value ==='') 
              ? null : this.fieldForm.su_oauth_clients_id.value.id;

          if (this.activeOauthClientId == 1) {
            data.su_oauth_clients_id = su_oauth_clients_id;

          }

          baseCallApiHelper.callApi(
            "Create form survey",
            null,
            api.form_survey.create.method,
            api.form_survey.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldForm.id.value = data.data.id


                this.createdBy = this.activeSystemUserName;
                this.createdOn = data.data["created_on"];
                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];                
              } 
            }, 
            true, 
            true,
            true
          );
        } else {
          data.id = this.fieldForm.id.value;
          baseCallApiHelper.callApi(
            "Update form survey",
            null,
            api.form_survey.update.method,
            api.form_survey.update.url,  
            data, 
            (status, data, message) => {
              if(status) {

                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];                
              } 
            }, 
            true, 
            true,
            true
          );

        }
        e.preventDefault(); 
      }

    },

    optionsOauthClients ({ id, name }) {
      return `${id} : ${name}`
    },     
    processGetOauthClientsList: function () {
      this.fieldForm.su_oauth_clients_id.validationRules = ['required', 'min.3', 'max.2000'];

      const data = {};
      baseCallApiHelper.callApi(
        "Get Oauth Clients",
        {},
        api.oauth_clients.list.method,
        api.oauth_clients.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.su_oauth_clients_id.options =  data.data;

            if (this.fieldForm.su_oauth_clients_id.tempValue !== "") {
              var tempValue = this.fieldForm.su_oauth_clients_id.tempValue;
              this.fieldForm.su_oauth_clients_id.value = this.fieldForm.su_oauth_clients_id.options.find(element => element.id === tempValue);
            }
          }
        }, 
        false, 
        true,
        true
      );
    },
    optionsDomain ({ id, code, name, link_web }) {
      var title = name;
      if (link_web !== "" && link_web !== null)
        title += ' - ' + link_web;

      return `${code} : ${title} `
    },                      
    processGetListDomain: function () {
      this.fieldForm.domain_id.validationRules = ['required', 'min.3', 'max.2000'];
      
      var data = {};
      if (!this.$route.params.id && this.activeOauthClientId == 1) {
        data = {
          "filter" : "oauth_clients_id = " + this.fieldForm.su_oauth_clients_id.value.id
        };
      }  else if (this.$route.params.id) {
        data = {
          "filter" : "oauth_clients_id = " + this.oauthClientsIdForm
        };        
      }

      baseCallApiHelper.callApi(
        "Get List Domain",
        {},
        api.domain.list.method,
        api.domain.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.domain_id.options =  data.data;
            if (this.fieldForm.domain_id.tempValue !== "") {
              this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(
                element => element.id === this.fieldForm.domain_id.tempValue
              );
            }


          }
        }, 
        false, 
        true,
        true
      );

      this.showDomain = true;
      
    },

    toggleModalChooseBackground: function() {
      this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
      this.$refs.ModalAddImageEditor.objectParameter = this.fieldForm;
      this.$refs.ModalAddImageEditor.fieldName = "background_url";
      this.$refs.ModalAddImageEditor.is_arrayWithIdImage = false;

      this.$refs.ModalAddImageEditor.toggleModalListImageEditor();      
    },
    
    toogleAddPageSurvey: function(index) {
      // Add new page at the middle of the array
      this.fieldForm.form_json.value.pages.splice(index + 1, 0, {
        title: "new page",
        show_title : false,
        background_color : "#bbbbbb99",
        font_color : "#000",
        fields : [
          {
            id : uuid.v1(),
            label : 'Label Description',
            show_label : true,
            description : '',
            type : 'description',
            default_value : '',
            require : false,
            options : {
              information : ""
            }
          }
        ]
      });

      this.fieldForm.form_json.config_pages.splice(index + 1, 0, {
        show: true
      });

      this.nextTickPageSurvey = false;
      this.nextTickPageSurvey = true;
      
      this.$nextTick(() => {
      });
    },
    toogleRemovePageSurvey: function() {
      this.fieldForm.form_json.value.pages.splice(this.itemDeleteIDPageSurvey, 1);
      this.showDeleteModalPageSurvey = false;

      this.nextTickPageSurvey = false;
      this.nextTickPageSurvey = true;
      
      this.$nextTick(() => {
      });
    },
    toogleShowHidePage: function(indexPage) {
      this.fieldForm.form_json.config_pages[indexPage].show = !this.fieldForm.form_json.config_pages[indexPage].show;
      console.log(this.fieldForm.form_json.config_pages[indexPage].show);

      this.nextTickPageSurvey = false;
      this.nextTickPageSurvey = true;
      
      this.$nextTick(() => {
      });
    }, 
    pageSurveyOrderChange: function(event, indexPage) {
      var newIndex = event.target.value - 1;
      var oldIndex = indexPage;

      if (newIndex >= this.fieldForm.form_json.value.pages.length) {
        var k = newIndex - this.fieldForm.form_json.value.pages.length + 1;
        while (k--) {
          this.fieldForm.form_json.value.pages.push(undefined);
        }
      }
      this.fieldForm.form_json.value.pages.splice(newIndex, 0, this.fieldForm.form_json.value.pages.splice(oldIndex, 1)[0]);

      this.nextTickPageSurvey = false;
      
      this.$nextTick(() => {
        this.nextTickPageSurvey = true;
      });
    },
    toogleAddPageFieldsSurvey: function(indexPage, indexField) {
      // Add new page at the middle of the array
      this.fieldForm.form_json.value.pages[indexPage].fields.splice(indexField + 1, 0, {
        id : uuid.v1(),
        label : 'Label Description',
        show_label : true,
        description : '',
        type : 'description',
        default_value : '',
        require : false,
        options : {
          information : ""
        }
      });

      this.nextTickPageFieldsSurvey = false;
      this.nextTickPageFieldsSurvey = true;
      
      this.$nextTick(() => {
      });
    },
    toogleChangePageFieldsSurvey: function(indexPage, indexField) {
      this.fieldForm.form_json.value.pages[indexPage].fields[indexField].options = 
        this.defaultOptionsTypeInput[this.fieldForm.form_json.value.pages[indexPage].fields[indexField].type];
   
      this.nextTickPageFieldsSurvey = false;
      this.nextTickPageFieldsSurvey = true;
      
      this.$nextTick(() => {
      });
    },
    toogleAddFieldOptionListSurvey: function(indexPage, indexField, indexOptionList) {
      // Add new page at the middle of the array
      this.fieldForm.form_json.value.pages[indexPage].fields[indexField].options.option_list.splice(indexOptionList + 1, 0, {
        value : "value 1",
        label : "label 1",
      });

      this.nextTickPageFieldsSurvey = false;
      this.nextTickPageFieldsSurvey = true;
      
      this.$nextTick(() => {
      });
    },
  }
}

</script>
