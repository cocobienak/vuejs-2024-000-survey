<template>
  <div>
    <CCard>
      <CCardBody>
        <CButton color="info" square size="sm" @click="showMainForm = !showMainForm" class="button-show">{{(showMainForm) ? 'Hide Main Form' : 'show Main Form'}}</CButton>
        <CForm style="clear:both"
          @submit.prevent="processFormStories" v-if="showMainForm"
        >

          <CButton type="submit" color="success" square size="sm"
          >
            Save
          </CButton>
       
          <div style="float:right" v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="globalFunctions.reloadAddNew($router, 'stories/add')"
              >
              Add new
            </CButton>
          </div>
          <CRow v-if="showFieldFormValidation">
            <CCol sm="12">
              <hr/>
              <CRow v-for="(fieldFormValidation, index) in  fieldForm" :key="index">
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353; padding-left:20px" 
                    v-show="(fieldFormValidation.isValid === null || fieldFormValidation.isValid) ? false : true" >
                    {{index + " " + globalFunctions.getInvalidFeedback(vm, 'fieldForm', index)}}
                </label>
              </CRow>
              <hr/>
            </CCol>
          </CRow>             
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
            <CCol sm="12">
                <label class="text-info">Created by : {{createdBy}} , {{ moment(createdOn).format('LLL') }}</label>
                <label class="text-info" style="float:right;">Modified by : {{modifiedBy}} , {{ moment(modifiedOn).format('LLL') }}</label>

            </CCol>
          </CRow> 
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
          <CRow>
            <CCol sm="6">
              <CInput
                name="name"
                v-model="fieldForm.name.value"
                placeholder="Name Stories ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Name "
              />
              <label>Recommend Story</label><br>
              <label class="c-switch form-check-label c-switch-success">
                <input type="checkbox" class="c-switch-input form-check-input"                           
                  v-model="fieldForm.is_recommend.value">
                <span class="c-switch-slider"></span>
              </label> 
            </CCol>
            <CCol sm="6">
              <br>
              <input type="radio" id="publish_1" value="publish_local" v-model="fieldForm.publish_status_form.value"
                style="margin-right:15px;cursor:pointer;">
              <label for="publish_1" style="cursor:pointer;">PUBLISH ON YOUR WEBSITE</label>
              <br>
                <label class="text-info">
                  (this option only for your website)
                </label>
              <br>
              <input type="radio" id="publish_2" value="publish_global" v-model="fieldForm.publish_status_form.value"
                style="margin-right:15px;cursor:pointer;">
              <label for="publish_2" style="cursor:pointer;">PUBLISH ON WEB Stories</label>
              <br>
                <label class="text-info">
                  (this option will need approval from WEB Stories admin)
                </label>
              <br>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.publish_status_form.isValid === null) ? false : !fieldForm.publish_status_form.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'publish_status_form')}}
              </label>
            </CCol>
          </CRow>    
          <CRow>
            <CCol sm="6">
              <div>
                <label>Select Genre</label>
                <multiselect 
                  v-model="fieldForm.stories_genre_id.value" 
                  :options="fieldForm.stories_genre_id.options" 
                  :custom-label="optionsStoriesGenre" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'stories_genre_id')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.stories_genre_id.isValid === null) ? false : !fieldForm.stories_genre_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'stories_genre_id')}}
                  </label>
              </div> 
            </CCol>
            <CCol sm="6">
              <div>
                <label>Select Sub-genre</label>
                <multiselect 
                  v-model="fieldForm.stories_subgenre_id.value" 
                  :options="fieldForm.stories_subgenre_id.options" 
                  :custom-label="optionsStoriesGenre" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'stories_subgenre_id')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.stories_subgenre_id.isValid === null) ? false : !fieldForm.stories_subgenre_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'stories_subgenre_id')}}
                  </label>
              </div> 
            </CCol>            
          </CRow>           
          <CRow>
            <CCol sm="6">
              <div>
                <label>Select Author</label>
                <multiselect 
                  v-model="fieldForm.stories_author_id.value" 
                  :options="fieldForm.stories_author_id.options" 
                  :custom-label="optionsStoriesAuthor" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'stories_author_id')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.stories_author_id.isValid === null) ? false : !fieldForm.stories_author_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'stories_author_id')}}
                  </label>
              </div> 
            </CCol>
            <CCol sm="6">
              <CSelect
                name="stories_author_type"
                :value.sync="fieldForm.stories_author_type.value"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'stories_author_type')"                
                label="Author Type"
                :options="['other','student','lecturer', 'alumni']"
              /> 
            </CCol>            
          </CRow>
          <CRow>
            <CCol sm="12">
              <hr/>
            </CCol>
          </CRow>            
          <CRow>
            <CCol sm="6" style="display:table-cell;vertical-align: middle;text-align:left;">
                <label class="text-info"> Recommend resolution 440px x 440px </label>
                <CButton
                  style="margin-left:8px;"
                  color="info"
                  square
                  size="sm"
                  @click="toggleModalChooseCoverBook()"
                >
                  Choose Cover Story
              </CButton>
              <br/><br/>            
              <div v-if="fieldForm.cover_image_id.value" style="display:block; vertical-align: middle; text-align: left; width:500px">

                <div>
                  <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 600px; height: 300px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                    <img 
                      style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                      :src="fieldForm.cover_image_id.value[0].path" 
                    />  
                  </span>
                </div>
                <br/>
                <CButton
                  style="margin-left:8px;"
                  color="warning"
                  square
                  size="sm"
                  @click="fieldForm.cover_image_id.value = ''"
                >
                    <span style="color:#fff;">Remove Cover</span>
                </CButton>

              </div>
            </CCol> 
            <CCol sm="6" style="display:table-cell;vertical-align: middle;text-align:left;">
             <CTextarea
                name="sort_description"
                v-model="fieldForm.sort_description.value"
                rows="4"
                placeholder="Sort Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'sort_description')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'sort_description')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'sort_description')"
                label="Sort Description"
                />

            </CCol>                         
          </CRow>
          <CRow>
            <CCol sm="12">
              <hr/>
            </CCol>
          </CRow>                                                                                      
          <CRow>
            <CCol sm="12" style="display:table-cell;vertical-align: middle;text-align:left;">
                <!-- <label>Choose Your Story</label>&nbsp;&nbsp;               -->
                <!-- <CButton variant="outline" color="info" square size="sm" @click="fieldForm.is_pdf_stories.value = true">Upload PDF</CButton>&nbsp;&nbsp;&nbsp; -->
                <!-- <CButton variant="outline" color="info" square size="sm" @click="fieldForm.is_pdf_stories.value = false">Type Text</CButton> : -->
                <!-- <div v-if="fieldForm.is_pdf_stories.value">
                    <CButton
                      style="margin-left:8px;"
                      color="info"
                      square
                      size="sm"
                      @click="toggleModalChooseFile()"
                    >
                      Choose PDF File
                  </CButton>
                  <br/><br/>            
                  <div v-if="fieldForm.stories_file.value" style="display:block; vertical-align: middle; text-align: left; width:500px">
                    <div>
                        <a :href="fieldForm.stories_file.value[0].path" >
                          {{fieldForm.stories_file.value[0].title}} 
                        </a>                     
                    </div>
                    <br/>
                    <CButton
                      style="margin-left:8px;"
                      color="warning"
                      square
                      size="sm"
                      @click="fieldForm.stories_file.value = ''"
                    >
                        <span style="color:#fff;">Remove Selection</span>
                    </CButton>

                  </div>
                </div> -->
                <div v-if="!fieldForm.is_pdf_stories.value">
                  <label>Type Your Story</label><br>
                  <CButton variant="outline" color="info" square size="sm" 
                    @click="toogleAddPageStory(fieldForm.stories.value.length); ">
                      Add Page
                  </CButton>
                  <br>
                  <div v-for="(storyPage, index) in  fieldForm.stories.value" :key="index">
                    <br>
                    <CButton v-if="fieldForm.stories.value.length > 1" variant="outline" color="info" square size="sm" 
                      @click="fieldForm.stories.value.splice(index, 1)">
                        Remove Page
                      </CButton>
                    &nbsp;text : {{fieldForm.stories.value[index].length}} / 3500
                    <br>
                    <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                      v-show="(fieldForm.stories.value[index].length > 3500)">
                        Text can't be more than 3500
                    </label>
                    <br>
                    <div :id="'editor-toolbar-stories_'+index">
                      <span class="ql-formats">
                        <select class="ql-font"></select>
                        <select class="ql-size"></select>
                      </span>
                      <span class="ql-formats">
                        <button class="ql-bold"></button>
                        <button class="ql-italic"></button>
                        <button class="ql-underline"></button>
                        <button class="ql-strike"></button>
                      </span>
                      <span class="ql-formats">
                        <select class="ql-color"></select>
                        <select class="ql-background"></select>
                      </span>
                      <span class="ql-formats">
                        <button class="ql-script" value="sub"></button>
                        <button class="ql-script" value="super"></button>
                      </span>
                      <span class="ql-formats">
                        <button class="ql-header" value="1"></button>
                        <button class="ql-header" value="2"></button>
                        <button class="ql-blockquote"></button>
                        <button class="ql-code-block"></button>
                      </span>
                      <span class="ql-formats">
                        <button class="ql-list" value="ordered"></button>
                        <button class="ql-list" value="bullet"></button>
                        <button class="ql-indent" value="-1"></button>
                        <button class="ql-indent" value="+1"></button>
                      </span>
                      <span class="ql-formats">
                        <button class="ql-direction" value="rtl"></button>
                        <select class="ql-align"></select>
                      </span>
                      <span class="ql-formats">
                        <button class="ql-link"></button>
                        <button class="ql-customImage"><svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg></button>
                        <button class="ql-video"></button>
                      </span>
                    </div>                    
                    <vue-editor
                      :ref="'fieldForm_stories_'+index" 
                      v-model="fieldForm.stories.value[index]" 
                      :editorOptions="fieldForm.stories.editorConfigArray[index].editorSettings"
                      :customModules="fieldForm.stories.editorConfigArray[index].modulesForEditor"
                      @input="checkStoryPage()"
                      :id="'editor-story-'+index"
                    >
                    </vue-editor>
                  </div>
                  <br>
                  <CButton v-if="fieldForm.stories.value.length > 1" 
                    variant="outline" color="info" square size="sm" 
                    @click="toogleAddPageStory(fieldForm.stories.value.length);">
                      Add Page
                  </CButton>  
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldForm.stories.isValid === null) ? false : !fieldForm.stories.isValid">
                      Check maximum text per page
                  </label>
                </div>
            </CCol>                
          </CRow>  
          <hr/>        
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" >
            <CCol sm="12">
              <CButton color="success" square size="sm"
                @click="processFormCode()"
              >
                Edit Slug
              </CButton>
              <CInput
                name="code"
                v-model="fieldFormCode.code.value"
                placeholder="Slug ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFormCode', 'code')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldFormCode', 'code')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormCode', 'code')"                
                label="Slug "
              />
              <label class="text-info">The “slug” is unique name for the URL-friendly version.
                  <br> It will be forced to lowercase and replace spaces with “-”.
              </label>
            </CCol>
          </CRow>        
        </CForm>
        <CButton v-if="showMainForm" color="info" square size="sm" @click="showMainForm = !showMainForm" class="button-show">{{(showMainForm) ? 'Hide Main Form' : 'show Main Form'}}</CButton>
        <hr style="clear:both"/>
        <CButton color="info" square size="sm" @click="showSubForm = !showSubForm" class="button-show">{{(showSubForm) ? 'Hide Sub Form' : 'show Sub Form'}}</CButton>
        <div v-if="showSubForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')" style="clear:both">
          <CRow v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
            <CCol sm="12">
              <div>
                <CButton
                    color="success"
                    square
                    size="sm"
                    @click="processSaveShareToDomain()"
                  >
                  Set Share To Domain
                </CButton>
                <multiselect 
                  v-model="fieldFormShare.stories_share_domain.value" 
                  :options="fieldFormShare.stories_share_domain.options" 
                  :custom-label="optionsDomain" 
                  :allow-empty="true"
                  :multiple="true"
                  placeholder="Select Domain To Share"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormShare', 'stories_share_domain')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldFormShare.stories_share_domain.isValid === null) ? false : !fieldFormShare.stories_share_domain.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldFormShare', 'stories_share_domain')}}
                  </label>
              </div> 
            </CCol>
          </CRow>         
        </div>
        <CButton color="info" v-if="showSubForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')" square size="sm" @click="showSubForm = !showSubForm" class="button-show">{{(showSubForm) ? 'Hide Sub Form' : 'show Sub Form'}}</CButton>
        <hr style="clear:both"/>
      </CCardBody>
    </CCard>
    <ModalAddImageEditor ref="ModalAddImageEditor" />        
    <ModalAddFileEditor ref="ModalAddFileEditor" />        

  </div>
</template>

<style scoped>
  /* #table-attendance {
    height: 500px;
  } */

  .button-show {
    float: right;
    margin: 10px 0px;
  }

  .box_list_image {
    display: flex;
    flex-wrap: wrap;   
    justify-content: center;
  }

  .item_image {
    padding:8px 0px 8px 15px;
  }

  .span_image_thumbnail {
    vertical-align: middle; 
    text-align: center; 
    display:table-cell; 
    width: 420px; 
    height: 210px; 
    border: 2px solid #acacac; 
    border-radius: 6px;
    cursor: pointer;
  }

  .span_image_thumbnail:hover {
    border: 2px solid #ffa600; 
  }

  .image_thumbnail {
    margin: 0 auto;display: block;height: auto;width: auto;max-width:420px;max-height:210px;
  }

  .span_image_thumbnail_modal {
    vertical-align: middle; 
    text-align: center; 
    display:table-cell; 
    width: 210px; 
    height: 115px; 
    border: 2px solid #acacac; 
    border-radius: 6px;
    cursor: pointer;
  }

  .span_image_thumbnail_modal:hover {
    border: 2px solid #ffa600; 
  }

  .image_thumbnail_modal {
    margin: 0 auto;display: block;height: auto;width: auto;max-width:210px;max-height:115px;
  }

  .image_selected {
    border: 8px solid #7bff00; 
  }


</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"></style>

<script>
import router from '../../router';
import store from '../../store';
import Multiselect from 'vue-multiselect';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

import { VueEditor, Quill } from 'vue2-editor';
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
import ModalAddImageEditor from '../../components/ModalAddImageEditor.vue';
import ModalAddFileEditor from '../../components/ModalAddFileEditor.vue';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'StoriesForm',
  components: {
    Multiselect,
    VueCtkDateTimePicker,
    VueEditor,
    // For ModalAddImageEditor must add :
      // import baseCallApiHelper from '../../helpers/baseCallApi';    
    ModalAddImageEditor,
    ModalAddFileEditor    
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
      activeSystemUserDomainId : localStorage.getItem('systemUserDomainId'),
      createdBy : "-",
      createdOn : "-",
      modifiedBy : "-",
      modifiedOn : "-",
      showDomain : false,
      oauthClientsIdForm : "",
      showFieldFormValidation : false,
      fieldFormCode : {
        code : {
          value : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.5'],
          isValid : null        
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
        name : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.100'],
          isValid : null        
        },
        sort_description : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        stories_genre_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        stories_subgenre_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        stories_author_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },         
        stories_author_use_degree : {
          value : 1,
          selected : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        stories_author_type : {
          value : "other",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.20'],
          isValid : null        
        },
        cover_image_id : {
          value : null,
          path : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        }, 
        is_pdf_stories : {
          value : 0,
          path : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        stories_file : {
          value : "",
          path : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        stories : {
          value : [""],
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null,
          showHTML : true,
          editorConfigArray : [
            {
              modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
              editorSettings: {
                modules: {
                  imageDrop: true,
                  imageResize: {},
                  toolbar: {
                    container: "#editor-toolbar-stories_0",
                    handlers: {
                      customImage: () => {  
                        this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
                        this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_stories_0[0].quill;
                        this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                      }
                    }           
                  }          
                }   
              }                
            }
          ]   
        },        
        editorial_letter_image_id : {
          value : null,
          path : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        editorial_letter_html : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.65535'],
          isValid : null,
          showHTML : true,
          modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
          editorSettings: {
            modules: {
              imageDrop: true,
              imageResize: {},
              toolbar: {
                container: "#editor-toolbar-editorial_letter_html",
                handlers: {
                  customImage: () => {  
                  this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;

                    this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_editorial_letter_html.quill;
                    this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                  }
                }           
              }          
            }    
          }              
        },
        author_interview_html : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['max.65535'],
          isValid : null,
          showHTML : true,
          modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
          editorSettings: {
            modules: {
              imageDrop: true,
              imageResize: {},
              toolbar: {
                container: "#editor-toolbar-author_interview_html",
                handlers: {
                  customImage: () => {  
                  this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;

                    this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_author_interview_html.quill;
                    this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                  }
                }           
              }          
            }    
          }              
        },

        is_recommend : {
          value : 0,
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        publish_status : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        publish_status_form : {
          value : "",
          tempValue : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3'],
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
      fieldFormShare : {
        stories_share_domain : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },  
      },
      showMainForm : true,    
      showSubForm : true

    }
  },
  created () {
    this.processGetStoriesGenreList();
    this.processGetStoriesAuthorList();
    if (this.$route.params.id) {
      this.fieldForm.id.value = this.$route.params.id;

      this.showMainForm = true;     
      this.showSubForm = true;
      
      this.processGetStoriesDetail();

    } else {
        this.showMainForm = true;     
        this.showSubForm = false;

      // if super admin
      if (this.activeOauthClientId == 1) {
        this.processGetOauthClientsList();
      }
      
      // if (this.activeSystemUserDomain.toLowerCase() == 'master' && this.activeOauthClientId != 1) {
        // this.processGetListDomain();
      // }
    }
  },
  mounted() {
  },
  methods: {
    processGetStoriesDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get stories  detail",
        null,
        api.stories.read.method,
        api.stories.read.url + '/' + this.$route.params.id + '?is_form=1', 
        data, 
        (status, data, message) => {
          if(status) {

            this.oauthClientsIdForm = data.data.oauth_clients_id;
            this.fieldForm.domain_id.tempValue = data.data.domain_id;
            this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === data.data.domain_id);

            this.fieldForm.id.value = data.data.id;
            this.fieldFormCode.code.value = this.fieldFormCode.code.tempValue = data.data.code;

            this.fieldForm.name.value = data.data.name;
            this.fieldForm.sort_description.value = data.data.sort_description;
            this.fieldForm.is_recommend.value = data.data.is_recommend;

            this.fieldForm.publish_status.value = data.data.publish_status;

            if (this.fieldForm.publish_status.value === 'publish_local') {
              this.fieldForm.publish_status_form.value = 'publish_local';
              this.fieldForm.publish_status_form.tempValue = 'publish_local';
            } else {
              this.fieldForm.publish_status_form.value = 'publish_global';
              this.fieldForm.publish_status_form.tempValue = 'publish_global';
            }

            this.fieldForm.stories_genre_id.tempValue = data.data.stories_genre_id;
            this.fieldForm.stories_genre_id.value = this.fieldForm.stories_genre_id.options.find(element => element.id === data.data.stories_genre_id);

            this.fieldForm.stories_subgenre_id.tempValue = data.data.stories_subgenre_id;
            this.fieldForm.stories_subgenre_id.value = this.fieldForm.stories_subgenre_id.options.find(element => element.id === data.data.stories_subgenre_id);

            this.fieldForm.stories_author_id.tempValue = data.data.stories_author_id;
            this.fieldForm.stories_author_id.value = this.fieldForm.stories_author_id.options.find(element => element.id === data.data.stories_author_id);
            this.fieldForm.stories_author_use_degree.tempValue = this.fieldForm.stories_author_use_degree.value = data.data.stories_author_use_degree;
            this.fieldForm.stories_author_type.value = data.data.stories_author_type;

            this.fieldForm.editorial_letter_image_id.value = '';
            if (data.data.editorial_letter_image_id !== null && data.data['editorial_letter_image_id.path'] !== null) {
              this.fieldForm.editorial_letter_image_id.value =[{
                id : data.data.editorial_letter_image_id,
                path : data.data['editorial_letter_image_id.path']                  
              }]
            }
            this.fieldForm.editorial_letter_html.value = data.data.editorial_letter_html;
            this.fieldForm.author_interview_html.value = data.data.author_interview_html;

            this.fieldForm.cover_image_id.value = '';
            if (data.data.cover_image_id !== null && data.data['cover_image_id.path'] !== null) {
              this.fieldForm.cover_image_id.value =[{
                id : data.data.cover_image_id,
                path : data.data['cover_image_id.path']                  
              }]
            }

            this.fieldForm.is_pdf_stories.value = data.data['is_pdf_stories'];
            
            this.fieldForm.stories.tempValue = data.data['stories'];
            if (this.fieldForm.stories.tempValue !== null && this.fieldForm.stories.tempValue !== "") {
              this.fieldForm.stories.value = this.fieldForm.stories.tempValue.split('||page||');

              for(var i = 0;i < this.fieldForm.stories.value.length; i++) {
                this.fieldForm.stories.editorConfigArray[i] = {
                        modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
                        editorSettings: {
                          modules: {
                            imageDrop: true,
                            imageResize: {},
                            toolbar: {
                              container: "#editor-toolbar-stories_" + i,
                              handlers: {
                                customImage: () => {  
                                  this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
                                  this.$refs.ModalAddImageEditor.objectEditor = this.$refs['fieldForm_stories_'+i][0].quill;
                                  this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                                }
                              }           
                            }          
                          }   
                        }                
                      }                
              }
            }
            // console.log(this.fieldForm.stories.editorConfigArray[index]);

            this.fieldForm.stories_file.value = null;
            if (typeof(data.data['stories_file.list']) !== 'undefined' && data.data['stories_file.list'] !== null
            && typeof(data.data['stories_file.list'][0]) !== 'undefined'
            && typeof(data.data['stories_file.list'][0]['file_id']) !== 'undefined' && data.data['stories_file.list'][0]['file_id'] !== 0
            && typeof(data.data['stories_file.list'][0]['file_id.path']) !== 'undefined' && data.data['stories_file.list'][0]['file_id.path'] !== "") {
              this.fieldForm.stories_file.value =[{
                id : data.data['stories_file.list'][0]['file_id'],
                path : data.data['stories_file.list'][0]['file_id.path'],   
                title : (typeof(data.data['stories_file.list'][0]['file_id.title']) !== 'undefined' && data.data['stories_file.list'][0]['file_id.title'] !== "")  
                  ? data.data['stories_file.list'][0]['file_id.title'] : data.data['stories_file.list'][0]['file_id.path']          
              }]
            }


            // stories_file       

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];


            // Share Domain ------------------------
              this.processGetListDomainForShare();
              this.fieldFormShare.stories_share_domain.tempValue = data.stories_share_domain;

              var valueShareToDomain = [];
              var optionsShareToDomain = this.fieldFormShare.stories_share_domain.options;
              data.stories_share_domain.forEach(function(item) {
                valueShareToDomain.push(optionsShareToDomain.find(element => element.id === item.domain_id));
              });
              this.fieldFormShare.stories_share_domain.value = valueShareToDomain;
            // ------------------------ Share Domain


            if (this.activeOauthClientId == 1) {
              this.processGetListDomain();
            }

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },
    processFormStories: function (e) {
      this.checkStoryPage();
      var checkStoryPage = this.fieldForm.stories.isValid;
      if (globalFunctions.validationForm(this, 'fieldForm') && (checkStoryPage == null || checkStoryPage)) {

            
            if (Array.isArray(this.fieldForm.stories.value) && this.fieldForm.stories.value.length > 0) {
              this.fieldForm.stories.tempValue = this.fieldForm.stories.value[0];
              var i = 0;
              var vm = this;
              this.fieldForm.stories.value.forEach(function (item) {
                if (item.trim() !== "" && i > 0) {
                  vm.fieldForm.stories.tempValue = vm.fieldForm.stories.tempValue + '||page||' + item;
                }
                i++;
              });
            }

        const data = {
            name                     : this.fieldForm.name.value,
            sort_description : this.fieldForm.sort_description.value,
            is_recommend : this.fieldForm.is_recommend.value,
            stories_genre_id        : (typeof(this.fieldForm.stories_genre_id.value) === 'undefined' || this.fieldForm.stories_genre_id.value ==='') 
              ? null : this.fieldForm.stories_genre_id.value.id,
            stories_subgenre_id       : (typeof(this.fieldForm.stories_subgenre_id.value) === 'undefined' || this.fieldForm.stories_subgenre_id.value ==='') 
              ? null : this.fieldForm.stories_subgenre_id.value.id,
            stories_author_id         : (typeof(this.fieldForm.stories_author_id.value) === 'undefined' || this.fieldForm.stories_author_id.value ==='') 
              ? null : this.fieldForm.stories_author_id.value.id,
            stories_author_use_degree : this.fieldForm.stories_author_use_degree.value,
            stories_author_type       : this.fieldForm.stories_author_type.value,
            cover_image_id        : (typeof(this.fieldForm.cover_image_id.value) === 'undefined' || typeof(this.fieldForm.cover_image_id.value[0]) === 'undefined' 
              || typeof(this.fieldForm.cover_image_id.value[0].id) === 'undefined') 
              ? null : this.fieldForm.cover_image_id.value[0].id,
            // editorial_letter_image_id        : (typeof(this.fieldForm.editorial_letter_image_id.value) === 'undefined' || this.fieldForm.editorial_letter_image_id.value == null
            //   || typeof(this.fieldForm.editorial_letter_image_id.value[0]) === 'undefined' 
            //   || typeof(this.fieldForm.editorial_letter_image_id.value[0].id) === 'undefined') 
            //   ? null : this.fieldForm.editorial_letter_image_id.value[0].id,              
            // editorial_letter_html      : this.fieldForm.editorial_letter_html.value,
            // author_interview_html      : this.fieldForm.author_interview_html.value,

            is_pdf_stories : this.fieldForm.is_pdf_stories.value,
            stories : this.fieldForm.stories.tempValue,

            stories_file               : (typeof(this.fieldForm.stories_file.value) === 'undefined' || this.fieldForm.stories_file.value ==='') 
              ? null : this.fieldForm.stories_file.value
        }; 


        if (this.fieldForm.id.value === null) {

          if (this.activeOauthClientId == 1) {
            data.domain_id = this.fieldForm.domain_id.tempValue = (typeof(this.fieldForm.domain_id.value) === 'undefined' || this.fieldForm.domain_id.value ==='') ? null : this.fieldForm.domain_id.value.id;        
          }

          var allowForSuAdmin = true;

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;

          if (this.activeOauthClientId == 1) {
            if(su_oauth_clients_id == null) {
              allowForSuAdmin = false;
            } else {
              data.su_oauth_clients_id = su_oauth_clients_id;
            }
          }

          data.publish_status = this.fieldForm.publish_status_form.value;

          if (allowForSuAdmin) {
            baseCallApiHelper.callApi(
              "Create stories ",
              null,
              api.stories.create.method,
              api.stories.create.url, 
              data, 
              (status, data, message) => {
                if(status) {
                  this.fieldFormCode.code.value = data.data.code;
                  this.fieldForm.id.value = this.$route.params.id = data.data.id

                  this.oauthClientsIdForm = su_oauth_clients_id;

                  this.showDomain = false;

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
            alert("If Super Admin, su_oauth_clients_id cannot be null ");
          }


        } else {
          
          if (this.fieldForm.publish_status_form.value != this.fieldForm.publish_status_form.tempValue) {
            data.publish_status = this.fieldForm.publish_status_form.value ;
          }

          data.id = this.fieldForm.id.value;
          baseCallApiHelper.callApi(
            "Update stories ",
            null,
            api.stories.update.method,
            api.stories.update.url,  
            data, 
            (status, data, message) => {
              if(status) {

                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];
                this.showSubForm = true;
                this.processGetStoriesDetail();

              } 
            }, 
            true, 
            true,
            true
          );

        }
        e.preventDefault(); 
      } else {
        this.checkStoryPage();

        this.showFieldFormValidation = true;
      }

    },
    processFormCode: function () {
      if (globalFunctions.validationForm(this, 'fieldFormCode') && (this.fieldForm.id.value !== null && this.fieldForm.id.value !== '')) {
        const data = {
            id   : this.fieldForm.id.value,
            code : this.fieldFormCode.code.value
        };
          baseCallApiHelper.callApi(
            "Update slug stories ",
            null,
            api.stories.updatecode.method,
            api.stories.updatecode.url,  
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldFormCode.code.value = data.data.code;
                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];

              } else {
                this.fieldFormCode.code.isValid = false;
                this.fieldFormCode.code.invalidFeedback = message;

              }
            }, 
            true, 
            true,
            true
          );                 
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
              this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === this.fieldForm.domain_id.tempValue);
            }


          }
        }, 
        false, 
        true,
        true
      );

      this.showDomain = true;
      
    },
    processGetListDomainForShare: function () {     
        var data = {
          "filter" : "(oauth_clients_id = " + this.oauthClientsIdForm + " and code <> 'master' and id <> " + this.fieldForm.domain_id.tempValue + ")"
        };

      baseCallApiHelper.callApi(
        "Get List Domain Share",
        {"Privilege": "readstories"},
        api.domain.list.method,
        api.domain.list.url, 
        data, 
        (status, data, message) => {
          if(status) {
          this.fieldFormShare.stories_share_domain.options = data.data;

          if (this.fieldFormShare.stories_share_domain.tempValue !== "") {
            var valueShareToDomain = [];
            var optionsShareToDomain = this.fieldFormShare.stories_share_domain.options;
            this.fieldFormShare.stories_share_domain.tempValue.forEach(function(item) {
              valueShareToDomain.push(optionsShareToDomain.find(element => element.id === item.domain_id));
            });
            this.fieldFormShare.stories_share_domain.value = valueShareToDomain; 
          }


          }
        }, 
        false, 
        true,
        true
      );      
    },  
    processSaveShareToDomain: function() {
      if (this.fieldForm.id.value != null && this.fieldForm.id.value != '') {
        const data = {
            stories_id  : this.fieldForm.id.value,
            stories_share_domain     : this.fieldFormShare.stories_share_domain.value,
        }; 

          baseCallApiHelper.callApi(
            "Share stories",
            null,
            api.stories.updatesharestories.method,
            api.stories.updatesharestories.url, 
            data, 
            (status, data, message) => {
              if(status) {
              } 
            }, 
            true, 
            true,
            true
          );
      }
    },

    optionsStoriesGenre ({ name, description }) {
      description = (description === null) ? '-' : description;
      return `${name} : ${description}`
    },              
    processGetStoriesGenreList: function () {
        const data = {
          select : ["id", "name", "description"],
          filter : "",
          order_by : "name asc"
        };
      baseCallApiHelper.callApi(
        "Get stories genre list",
        {},
        api.stories_genre.list.method,
        api.stories_genre.list.url, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.stories_genre_id.options =  data.data;

            if (this.fieldForm.stories_genre_id.tempValue !== "") {
              var tempValue = this.fieldForm.stories_genre_id.tempValue;
              this.fieldForm.stories_genre_id.value = this.fieldForm.stories_genre_id.options.find(element => element.id === tempValue);
            }

            this.fieldForm.stories_subgenre_id.options =  data.data;

            if (this.fieldForm.stories_subgenre_id.tempValue !== "") {
              var tempValue = this.fieldForm.stories_subgenre_id.tempValue;
              this.fieldForm.stories_subgenre_id.value = this.fieldForm.stories_subgenre_id.options.find(element => element.id === tempValue);
            }

          }
        }, 
        false, 
        true,
        true
      );
    },

    toogleAddPageStory: function(totalLength) {
      this.fieldForm.stories.value[totalLength] = '';
      this.fieldForm.stories.editorConfigArray[totalLength] = {
              modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
              editorSettings: {
                modules: {
                  imageDrop: true,
                  imageResize: {},
                  toolbar: {
                    container: "#editor-toolbar-stories_" + totalLength,
                    handlers: {
                      customImage: () => {  
                        this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
                        this.$refs.ModalAddImageEditor.objectEditor = this.$refs['fieldForm_stories_'+totalLength][0].quill;
                        this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                      }
                    }           
                  }          
                }   
              }                
            }

        this.fieldForm.is_pdf_stories.value=true;
        this.fieldForm.is_pdf_stories.value=false;
        
      this.$nextTick(() => {


      });

 

    },
    checkStoryPage: function() {
      this.fieldForm.stories.isValid = null;
      var vm = this;
      this.fieldForm.stories.value.forEach(function (item) {
        if (item.length > 3500) {
          vm.fieldForm.stories.isValid = false;
          vm.fieldForm.stories.invalidFeedback = 'Check maximum text per page !!';

        }
      });
    },

    optionsStoriesAuthor ({ name, prefix_degree, sufix_degree  }) {
      var prefix = (prefix_degree === null) ? "" : prefix_degree + " ";
      var sufix = (sufix_degree === null) ? "" : " " + sufix_degree;

      return `${prefix}${name}${sufix}`
    },              
    processGetStoriesAuthorList: function () {
        const data = {
          select : ["id", "name", "prefix_degree", "sufix_degree"],
          filter : "",
          order_by : "name asc"
        };
      baseCallApiHelper.callApi(
        "Get stories author list",
        {},
        api.stories_author.list.method,
        api.stories_author.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.stories_author_id.options =  data.data;

            if (this.fieldForm.stories_author_id.tempValue !== "") {
              var tempValue = this.fieldForm.stories_author_id.tempValue;
              this.fieldForm.stories_author_id.value = this.fieldForm.stories_author_id.options.find(element => element.id === tempValue);
            }
          }
        }, 
        false, 
        true,
        true
      );
    },
    processChecklistUseDegree: function() {
      // if (this.fieldForm.speaker_use_degree.value) {
      //   var prefix_degree = (this.fieldForm.speaker_id.value.prefix_degree === null) ? "" : this.fieldForm.speaker_id.value.prefix_degree + " ";
      //   var sufix_degree = (this.fieldForm.speaker_id.value.sufix_degree === null) ? "" : " " + this.fieldForm.speaker_id.value.sufix_degree;
      //   this.fieldForm.speaker_use_degree.selected = prefix_degree + this.fieldForm.speaker_id.value.name + sufix_degree;
      // } else {
      //   this.fieldForm.speaker_use_degree.selected = this.fieldForm.speaker_id.value.name;
      // }
    },

    toggleModalChooseCoverBook: function() {
      this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
      this.$refs.ModalAddImageEditor.objectParameter = this.fieldForm;
      this.$refs.ModalAddImageEditor.fieldName = "cover_image_id";
      this.$refs.ModalAddImageEditor.is_arrayWithIdImage = true;

      this.$refs.ModalAddImageEditor.toggleModalListImageEditor();      
    },
    toggleModalChooseEditorialBanner: function() {
      this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;
      this.$refs.ModalAddImageEditor.objectParameter = this.fieldForm;
      this.$refs.ModalAddImageEditor.fieldName = "editorial_letter_image_id";
      this.$refs.ModalAddImageEditor.is_arrayWithIdImage = true;

      this.$refs.ModalAddImageEditor.toggleModalListImageEditor();      
    },    
    toggleModalChooseFile: function() {
      this.$refs.ModalAddFileEditor.baseCallApiHelper = baseCallApiHelper;
      this.$refs.ModalAddFileEditor.objectParameter = this.fieldForm;
      this.$refs.ModalAddFileEditor.fieldName = "stories_file";
      this.$refs.ModalAddFileEditor.is_arrayWithIdFile = true;

      this.$refs.ModalAddFileEditor.toggleModalListFileEditor();      
    }         

  }
}

</script>
