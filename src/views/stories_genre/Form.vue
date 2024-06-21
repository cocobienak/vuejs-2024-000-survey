<template>
  <div>
    <CCard>
      <CCardBody>
        <CForm
          @submit.prevent="processFormStoriesGenre"
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
                @click="globalFunctions.reloadAddNew($router, 'stories-genre/add')"
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
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'su_oauth_clients_id');"
                  label="name" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.su_oauth_clients_id.isValid === null) ? false : !fieldForm.su_oauth_clients_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'su_oauth_clients_id')}}
                  </label>
              </div>
            </CCol>
          </CRow>              
          <CRow>
            <CCol sm="6">
                <CInput
                name="name"
                v-model="fieldForm.name.value"
                placeholder="Name Stories Genre ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Name Category"
                />
            </CCol>
            <CCol sm="6">
              <div>
                <label>Parent Category</label>
                <multiselect 
                  v-model="fieldForm.parent_id.value" 
                  :options="fieldForm.parent_id.options" 
                  :custom-label="optionsLabelParentCategory" 
                  :allow-empty="true"
                  placeholder="Select one"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'parent_id')"
                  label="name" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.parent_id.isValid === null) ? false : !fieldForm.parent_id.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'parent_id')}}
                  </label>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="6">
              <CTextarea
                name="description"
                v-model="fieldForm.description.value"
                placeholder="Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'description')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'description')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'description')"
                label="Description"
                />
            </CCol>            
            <CCol sm="6">
              <label>As is Sub Genre</label><br>
              <label class="c-switch form-check-label c-switch-success">
                <input type="checkbox" class="c-switch-input form-check-input"                           
                  v-model="fieldForm.is_sub_genre.value">
                <span class="c-switch-slider"></span>
              </label> 
            </CCol>            
          </CRow>
          <CRow>
            <CCol sm="6">
              
              <CTextarea
                name="background_color"
                v-model="fieldForm.background_color.value"
                placeholder="background: rgb(44,3,52);background: linear-gradient(0deg, rgba(44,3,52,1) 0%, rgba(171,0,204,1) 100%);"
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'background_color')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'background_color')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'background_color')"
                label="Code CSS Background Color"
                />
                <label class="text-info">Please visit <a href="https://cssgradient.io/" target="_blank">https://cssgradient.io/</a> to get Code CSS for gradient color</label>
            </CCol>
            <CCol sm="6">

              <div style="width:80%; height:150px; border-radius:12px;margin:0 auto;" :style="fieldForm.background_color.value">&nbsp;</div>

            </CCol>
          </CRow>  
          <CRow>

            <CCol sm="6">

              <tree v-if="treeRender"
                class="tree--small"
                :data="processSyncTree(this)"
              >
                <div slot-scope="{ node }" class="node-container">
                    <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="vm.processRefresh(node.id)"
                    >
                      Edit
                    </CButton> 
                    <div class="node-text" style="display:inline; padding-left:10px">{{ node.text  }}</div>
                </div>

              </tree>

            </CCol>
          </CRow>                                
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script>
import store from '../../store';
import Multiselect from 'vue-multiselect';
import LiquorTree from 'liquor-tree';
import router from '../../router';


import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'StoriesGenreForm',
  components: {
    Multiselect,
    [LiquorTree.name]: LiquorTree
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
      treeDataAsync: null,
      treeRender : false,
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
        description : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        parent_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        background_color : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        is_sub_genre : {
          value : 0,
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
      }

    }
  },
  created () {
    if (this.$route.params.id) {
      this.processGetTree();
      this.processGetParentList();
      this.processGetStoriesGenreDetail();
    } else {
      this.processGetParentListAll();
      // if super admin
      if (this.activeOauthClientId == 1) {
        this.processGetOauthClientsList();
      }

    }
  },
  mounted() {
  },
  methods: {
    processGetStoriesGenreDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get stories genre detail",
        null,
        api.stories_genre.read.method,
        api.stories_genre.read.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.fieldForm.id.value = data.data.id;
            this.fieldForm.name.value = data.data.name;
            this.fieldForm.description.value = data.data.description;
            this.fieldForm.background_color.value = data.data.background_color;
            this.fieldForm.is_sub_genre.value = data.data.is_sub_genre;

            this.fieldForm.parent_id.tempValue = data.data.parent_id;
            this.fieldForm.parent_id.value = this.fieldForm.parent_id.options.find(element => element.id === data.data.parent_id);

           this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];  

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },
    processFormStoriesGenre: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {
        console.log(this.fieldForm.parent_id.value);
        var parentId = (typeof(this.fieldForm.parent_id.value) === 'undefined' || this.fieldForm.parent_id.value  === null
          || typeof(this.fieldForm.parent_id.value.id)  ==='undefined' ) ? null : this.fieldForm.parent_id.value.id;

        const data = {
            description  : this.fieldForm.description.value,
            name     : this.fieldForm.name.value,
            background_color : this.fieldForm.background_color.value,
            is_sub_genre             : this.fieldForm.is_sub_genre.value,

            parent_id : parentId,

        }; 

        if (this.fieldForm.id.value === null) {

          var su_oauth_clients_id = (typeof(this.fieldForm.su_oauth_clients_id.value) === 'undefined' || this.fieldForm.su_oauth_clients_id.value ==='') ? null : this.fieldForm.su_oauth_clients_id.value.id;
          
          if (this.activeOauthClientId == 1) {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }

          baseCallApiHelper.callApi(
            "Create stories genre",
            null,
            api.stories_genre.create.method,
            api.stories_genre.create.url, 
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
            "Update stories genre",
            null,
            api.stories_genre.update.method,
            api.stories_genre.update.url,  
            data, 
            (status, data, message) => {
              if(status) {
                this.treeRender = false;

                this.processGetTree();

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
        true, 
        true,
        true
      );
    },

    processRefresh(id){
      router.push({ path: `/stories-genre/edit/${id}` });
      this.$route.params.id = id;
      if (this.$route.params.id) {
        this.processGetTree();
        this.processGetParentList();
        this.processGetStoriesGenreDetail();
      }
    },    
    processSyncTree : function (obj) {
      return Promise.resolve(obj.treeDataAsync.data);
    },
    processGetTree : function () {
      const data = {
      };

      baseCallApiHelper.callApi(
        "Get tree list",
        null,
        api.stories_genre.getTree.method,
        api.stories_genre.getTree.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {
            this.treeDataAsync = data;
            this.treeRender = true;
          }
        }, 
        true, 
        true,
        true
      );
    },      
    optionsLabelParentCategory ({ name, description }) {
      description = (description === null) ? '-' : description;
      return `${name} : ${description}`
    },    
    processGetParentList : function () {
      const data = {
      };

      baseCallApiHelper.callApi(
        "Get parent list",
        null,
        api.stories_genre.listParent.method,
        api.stories_genre.listParent.url + '/' + this.$route.params.id, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.parent_id.options =  data.data;

            if (this.fieldForm.parent_id.tempValue !== "") {
              var tempValue = this.fieldForm.parent_id.tempValue;
              this.fieldForm.parent_id.value = this.fieldForm.parent_id.options.find(element => element.id === tempValue);
            }
          }
        }, 
        true, 
        true,
        true
      );
    },        
    processGetParentListAll: function () {
        const data = {
          select : ["id", "name", "description"],
          filter : "",
          order_by : "name asc" // always include 'created_on desc' for grab the new data from database
        };
      baseCallApiHelper.callApi(
        "Get parent list",
        null,
        api.stories_genre.list.method,
        api.stories_genre.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.parent_id.options =  data.data;

            if (this.fieldForm.parent_id.tempValue !== "") {
              var tempValue = this.fieldForm.parent_id.tempValue;
              this.fieldForm.parent_id.value = this.fieldForm.parent_id.options.find(element => element.id === tempValue);
            }
          }
        }, 
        true, 
        true,
        true
      );
    }         
  }
}

</script>
