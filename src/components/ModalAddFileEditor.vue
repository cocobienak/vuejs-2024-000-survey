<template>
   <CModal
      size="xl"
      :centered="true"
      title="Choose your file !!"
      color="info"
      :show.sync="showModalListFileEditor"
    >
      <div>
        <CForm 
          @submit.prevent="processFormUploadFileEditor"
        >
          <hr/>
          <CButton v-if="fieldFormUploadFileEditor.file.value" type="submit" color="success" square size="sm"
          >
            Upload
          </CButton>
          <br><br>                  
                  
          <CRow>
            <CCol sm="12" style="display:table-cell;vertical-align: middle;text-align:left;">
              <div v-if="!fieldFormUploadFileEditor.file.value">
                <input 
                  type="file" 
                  @change="globalFunctions.onInputFileChange(vm, $event,'fieldFormUploadFileEditor', 'file')"
                  accept="file/pdf">
              </div>
              <div v-else style="display:block; vertical-align: middle; text-align: left; width:500px">
                <div v-if="(activeOauthClientId == 1)">
                  <label>Oauth Clients</label>
                  <multiselect 
                    v-model="fieldFormUploadFileEditor.su_oauth_clients_id.value" 
                    :options="fieldFormUploadFileEditor.su_oauth_clients_id.options" 
                    :custom-label="optionsOauthClients" 
                    :allow-empty="true"
                    placeholder="Select one"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadFileEditor', 'su_oauth_clients_id'); processGetListDomain();"
                    label="name" track-by="name">
                  </multiselect>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldFormUploadFileEditor.su_oauth_clients_id.isValid === null) ? false : !fieldFormUploadFileEditor.su_oauth_clients_id.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadFileEditor', 'su_oauth_clients_id')}}
                    </label>
                </div>
                <div v-if="showDomainEditor">
                  <label>Domain</label>
                  <multiselect 
                    v-model="fieldFormUploadFileEditor.domain_id.value" 
                    :options="fieldFormUploadFileEditor.domain_id.options" 
                    :custom-label="optionsDomain" 
                    :allow-empty="true"
                    placeholder="Select one"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadFileEditor', 'domain_id')"                 
                    label="code" track-by="code">
                  </multiselect>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldFormUploadFileEditor.domain_id.isValid === null) ? false : !fieldFormUploadFileEditor.domain_id.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadFileEditor', 'domain_id')}}
                    </label>
                </div>                                         
                <div style="text-align: left;">
                  <CInput
                    name="title"
                    v-model="fieldFormUploadFileEditor.title.value"
                    placeholder="Title ..."
                    :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFormUploadFileEditor', 'title')"
                    :is-valid="globalFunctions.getIsValidfield(this, 'fieldFormUploadFileEditor', 'title')"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadFileEditor', 'title')" 
                    label="Title"               
                  />

                  <label>Lock : </label><br>
                  <label class="c-switch form-check-label c-switch-success">
                    <input type="checkbox" class="c-switch-input form-check-input"                           
                      v-model="fieldFormUploadFileEditor.is_lock.value">
                    <span class="c-switch-slider"></span>
                  </label><br>                 
                  <label>(if lock is true then your file cannot be used by other unit)</label><br>                  
                </div>
                <div>
                  <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 450px; height: 50px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                    <label 
                      style="margin: 0 auto;display: block;height: auto;width: auto;max-width:450px;max-height:50px;" >
                      {{fieldFormUploadFileEditor.title.value}} 
                    </label>  
                  </span>
                  <button @click="globalFunctions.removeInputFile(vm,'fieldFormUploadFileEditor', 'file')" style="margin-top:10px">Remove file</button>
                </div>
              </div>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldFormUploadFileEditor.file.isValid === null) ? false : !fieldFormUploadFileEditor.file.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadFileEditor', 'file')}}
              </label> 

            </CCol>
          </CRow>
          <hr/>

        </CForm>        
      </div>
      <CRow style="justify-content: center;">
          <CCol sm="4">

              <CInput
                name="search"
                v-model="search"
                placeholder="search title ..."
              />    
          </CCol>  
          <CButton
            style="margin-right: 20px;"
            color="success"
            square
            size="sm"
            @click="processSearchFirstFile()"
          >
            Search
          </CButton>
          <CButton
            color="warning"
            square
            size="sm"
            @click="processAddFileEditor()"
          >
            Add
          </CButton>        
      </CRow>
      <div class="box_list_file">
          <div v-for="(item) in listFileEditor" :key="item.id" class="item_file">
              <div>
                  <span class="span_file_thumbnail_modal" v-bind:class="{ file_selected: item['is_select'] }" @click="processChooseFileEditor(item)">
                    <a class="file_thumbnail_modal" :href="item['url_public']" >
                      {{item['title']}} 
                    </a>                                      
                    <!-- <img 
                      class="file_thumbnail_modal"
                      :src="item['url_public']" 
                    />   -->
                  </span>
              </div>
          </div>
      </div>
      <div style="text-align: center;">
          <CButton
            color="success"
            square
            size="sm"
            @click="processLoadMoreFile()"
          >
            Load More
          </CButton>        
      </div>      
      <div slot="footer-wrapper" class="w-100">
        <div class="modal-footer">
          <CButton
            color="warning"
            square
            size="sm"
            @click="processAddFileEditor()"
          >
            Add
          </CButton>
          <CButton
            color="secondary"
            square
            size="sm"
            @click="toggleModalListFileEditor()"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>  
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
  .box_list_file {
    display: flex;
    flex-wrap: wrap;   
    justify-content: center;
  }

  .item_file {
    padding:8px 0px 8px 15px;
  }

  .span_file_thumbnail {
    vertical-align: middle; 
    text-align: center; 
    display:table-cell; 
    width: 420px; 
    height: 280px; 
    border: 2px solid #acacac; 
    border-radius: 6px;
    cursor: pointer;
  }

  .span_file_thumbnail:hover {
    border: 2px solid #ffa600; 
  }

  .file_thumbnail {
    margin: 0 auto;display: block;height: auto;width: auto;max-width:380px;max-height:250px;overflow-wrap: break-word;
  }

  .span_file_thumbnail_modal {
    vertical-align: middle; 
    text-align: center; 
    display:table-cell; 
    width: 280px; 
    height: 150px; 
    border: 2px solid #acacac; 
    border-radius: 6px;
    cursor: pointer;
  }

  .span_file_thumbnail_modal:hover {
    border: 2px solid #ffa600; 
  }

  .file_thumbnail_modal {
    margin: 0 auto;display: block;height: auto;width: auto;max-width:250px;max-height:120px;overflow-wrap: break-word;
  }

  .file_selected {
    border: 8px solid #7bff00; 
  }


</style>

<script>
import { api } from '../configurations/services';
import Multiselect from 'vue-multiselect';
import globalFunctions from '../helpers/globalFunctions';

export default {
  name: 'ModalAddFileEditor',
  components: {
    Multiselect
  },
  data () {
    return {
      globalFunctions,
      baseCallApiHelper : null,
      vm : this,
      activeOauthClientId : localStorage.getItem('oauthClientId'),
      activeSystemUserName : localStorage.getItem('systemUserName'),
      activeSystemUserId : localStorage.getItem('systemUserId'),
      activeSystemUserDomain : localStorage.getItem('systemUserDomain'),
      createdBy : "-",
      createdOn : "-",
      modifiedBy : "-",
      modifiedOn : "-",
      page : 0,
      search: "",
      // For Editor wysiwyg
      fieldFormUploadFileEditor : {
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
        },        
        file : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null        
        },
        title : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null        
        },
        is_lock : {
          value : true,
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        }     
      },
      showModalListFileEditor : false,
      listFileEditor : [],
      
      objectEditor: null,
      
      objectParameter: null,
      fieldName: null,
      is_arrayWithIdFile: false,

      showDomainEditor : false

    }
  },
  created () {

  },
  mounted() {
  },
  methods: {
    optionsOauthClients ({ id, name }) {
      return `${id} : ${name}`
    },     
    processGetOauthClientsList: function () {
      this.fieldFormUploadFileEditor.su_oauth_clients_id.validationRules = ['required', 'min.3', 'max.2000'];

      const data = {};
      this.baseCallApiHelper.callApi(
        "Get Oauth Clients",
        {},
        api.oauth_clients.list.method,
        api.oauth_clients.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldFormUploadFileEditor.su_oauth_clients_id.options =  data.data;

            if (this.fieldFormUploadFileEditor.su_oauth_clients_id.tempValue !== "") {
              var tempValue = this.fieldFormUploadFileEditor.su_oauth_clients_id.tempValue;
              this.fieldFormUploadFileEditor.su_oauth_clients_id.value = this.fieldFormUploadFileEditor.su_oauth_clients_id.options.find(element => element.id === tempValue);
            }
          }
        }, 
        true, 
        true,
        true
      );
    },
    optionsDomain ({ id, code }) {
      return `${id} : ${code}`
    },                   
    processGetListDomain: function () {
      this.fieldFormUploadFileEditor.domain_id.validationRules = ['required', 'min.3', 'max.2000'];
      
      var data = {};
      if (this.activeOauthClientId == 1) {
        data = {
          "filter" : "oauth_clients_id = " + this.fieldFormUploadFileEditor.su_oauth_clients_id.value.id
        };
      }

      this.baseCallApiHelper.callApi(
        "Get List Domain",
        {},
        api.domain.list.method,
        api.domain.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldFormUploadFileEditor.domain_id.options =  data.data;
            if (this.fieldFormUploadFileEditor.domain_id.tempValue !== "") {
              this.fieldFormUploadFileEditor.domain_id.value = this.fieldFormUploadFileEditor.domain_id.options.find(element => element.id === this.fieldFormUploadFileEditor.domain_id.tempValue);
            }

          }
        }, 
        true, 
        true,
        true
      );

      this.showDomainEditor = true;


    }, 

    // For Editor wysiwyg    
    toggleModalListFileEditor: function () {
      this.page = 1;
      this.search =  "";

      if (this.showModalListFileEditor) {
        this.showModalListFileEditor = false;
      } else {
        const data = {
            order_by : "created_on desc",
            page     : 1,
            data_per_page : 16
        };      
        this.baseCallApiHelper.callApi(
          "Get List File",
          null,
          api.file.list.method,
          api.file.list.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.listFileEditor = data.data;

              if (this.activeOauthClientId == 1) {
                this.processGetOauthClientsList();
              } else if (this.activeSystemUserDomain == 'master') {
                this.processGetListDomain();
              }

              this.showModalListFileEditor = true;

            }
          }, 
          true, 
          true,
          true
        );
      }
    },
    processSearchFirstFile: function() {
        this.page = 1;
        const data = {
            order_by : "created_on desc",
            page     : this.page,
            data_per_page : 16
        };      
        if (this.search !== "") {
          data.filter = "title like '%"+ this.search +"%'";
        }

        this.baseCallApiHelper.callApi(
          "Get List File",
          null,
          api.file.list.method,
          api.file.list.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.listFileEditor = data.data;
            }
          }, 
          true, 
          true,
          true
        );
    },
    processLoadMoreFile: function() {
        this.page = this.page + 1;
        const data = {
            order_by : "created_on desc",
            page     : this.page,
            data_per_page : 16
        };      
        if (this.search !== "") {
          data.filter = "title like '%"+ this.search +"%'";
        }

        this.baseCallApiHelper.callApi(
          "Get List File",
          null,
          api.file.list.method,
          api.file.list.url,  
          data, 
          (status, data, message) => {
            if(status){
              var vm = this;
              data.data.forEach(function(row) {
                vm.listFileEditor.push(row);

              });
            }
          }, 
          true, 
          true,
          true
        );
    },
    processChooseFileEditor: function(item) {
      var itemIndex = this.listFileEditor.find(e => e.id === item.id)['is_select'];
      if (typeof(itemIndex) === 'undefined' || itemIndex === false) {
        this.listFileEditor.forEach(function(e) {
          e['is_select'] = false;
        });
        this.listFileEditor.find(e => e.id === item.id)['is_select'] = true;
      } else {
        this.listFileEditor.find(e => e.id === item.id)['is_select'] = false;
      }
       this.showModalListFileEditor = false;

        this.$nextTick(() => {

          // Add the component back in
          this.showModalListFileEditor = true;
        });
    },
    processFormUploadFileEditor: function(e) {
      if (globalFunctions.validationForm(this, 'fieldFormUploadFileEditor')) {

        const data = {
            file         : this.fieldFormUploadFileEditor.file.value,
            title         : this.fieldFormUploadFileEditor.title.value,
            is_lock       : this.fieldFormUploadFileEditor.is_lock.value
        };

        var allowForSuAdmin = true;
        var su_oauth_clients_id = (typeof(this.fieldFormUploadFileEditor.su_oauth_clients_id.value) === 'undefined' 
          || this.fieldFormUploadFileEditor.su_oauth_clients_id.value ==='') ? null : this.fieldFormUploadFileEditor.su_oauth_clients_id.value.id;
        
        if (this.activeOauthClientId == 1) {
          if(su_oauth_clients_id == null) {
            allowForSuAdmin = false;
          } else {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }
        }

        if (this.activeOauthClientId == 1 || this.activeSystemUserId == 2 || this.activeSystemUserDomain.toLowerCase() == 'master') {
          this.fieldFormUploadFileEditor.domain_id.tempValue = (typeof(this.fieldFormUploadFileEditor.domain_id.value) === 'undefined' 
            || this.fieldFormUploadFileEditor.domain_id.value ==='') ? null : this.fieldFormUploadFileEditor.domain_id.value.id;

          data.domain_id = this.fieldFormUploadFileEditor.domain_id.tempValue;
        }

        if (allowForSuAdmin) {
          this.baseCallApiHelper.callApi(
            "Upload File",
            null,
            api.file.create.method,
            api.file.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldFormUploadFileEditor.file.value = "";
                this.fieldFormUploadFileEditor.title.value = "";
                this.fieldFormUploadFileEditor.is_lock.value = false;
                this.showModalListFileEditor = false;
                this.toggleModalListFileEditor();
              } 
            }, 
            true, 
            true,
            true
          ); 
        } else {
            alert("If Super Admin, su_oauth_clients_id cannot be null ");
        }
       
      }
    },    
    processAddFileEditor: function() {
      var listFileSelected = this.listFileEditor.filter(e => e.is_select === true);
      if (listFileSelected.length > 0) {
        if (this.objectEditor !== null) {
          this.objectEditor.insertEmbed(this.objectEditor.getSelection( true ).index, "file", listFileSelected[0].url_public); 
        } else if (this.objectParameter !== null && this.fieldName !== null) {
          if (!this.is_arrayWithIdFile) {
            this.objectParameter[this.fieldName].value = listFileSelected[0].url_public;
          } else {
            this.objectParameter[this.fieldName].value = [{
              id : listFileSelected[0].id,
              path : listFileSelected[0].url_public,
              title : (typeof(listFileSelected[0].title) !== 'undefined' && listFileSelected[0].title !== "" && listFileSelected[0].title !== null)  
                  ? listFileSelected[0].title : listFileSelected[0].url_public     
            }];
          }

        }

        this.showModalListFileEditor = false;
      }
    }           
  }
}

</script>
