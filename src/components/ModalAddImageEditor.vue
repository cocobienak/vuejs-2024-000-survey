<template>
   <CModal
      size="xl"
      :centered="true"
      title="Choose your image !!"
      color="info"
      :show.sync="showModalListImageEditor"
    >
      <div>
        <CForm 
          @submit.prevent="processFormUploadImageEditor"
        >
          <hr/>
          <CButton v-if="fieldFormUploadImageEditor.image.value" type="submit" color="success" square size="sm"
          >
            Upload
          </CButton>
          <br><br>                  
                  
          <CRow>
            <CCol sm="12" style="display:table-cell;vertical-align: middle;text-align:left;">
              <div v-if="!fieldFormUploadImageEditor.image.value">
                <input 
                  type="file" 
                  @change="globalFunctions.onInputFileChange(vm, $event,'fieldFormUploadImageEditor', 'image')"
                  accept="image/x-png,image/gif,image/jpeg,image/svg+xml,image/webp">
              </div>
              <div v-else style="display:block; vertical-align: middle; text-align: left; width:500px">
                <div v-if="(activeOauthClientId == 1)">
                  <label>Oauth Clients</label>
                  <multiselect 
                    v-model="fieldFormUploadImageEditor.su_oauth_clients_id.value" 
                    :options="fieldFormUploadImageEditor.su_oauth_clients_id.options" 
                    :custom-label="optionsOauthClients" 
                    :allow-empty="true"
                    placeholder="Select one"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadImageEditor', 'su_oauth_clients_id'); processGetListDomain();"
                    label="name" track-by="name">
                  </multiselect>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldFormUploadImageEditor.su_oauth_clients_id.isValid === null) ? false : !fieldFormUploadImageEditor.su_oauth_clients_id.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadImageEditor', 'su_oauth_clients_id')}}
                    </label>
                </div>
                <div v-if="showDomainEditor">
                  <label>Domain</label>
                  <multiselect 
                    v-model="fieldFormUploadImageEditor.domain_id.value" 
                    :options="fieldFormUploadImageEditor.domain_id.options" 
                    :custom-label="optionsDomain" 
                    :allow-empty="true"
                    placeholder="Select one"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadImageEditor', 'domain_id')"                 
                    label="code" track-by="code">
                  </multiselect>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldFormUploadImageEditor.domain_id.isValid === null) ? false : !fieldFormUploadImageEditor.domain_id.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadImageEditor', 'domain_id')}}
                    </label>
                </div>                                         
                <div style="text-align: left;">
                  <CInput
                    name="title"
                    v-model="fieldFormUploadImageEditor.title.value"
                    placeholder="Title ..."
                    :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFormUploadImageEditor', 'title')"
                    :is-valid="globalFunctions.getIsValidfield(this, 'fieldFormUploadImageEditor', 'title')"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadImageEditor', 'title')" 
                    label="Title"               
                  />

                  <label>Lock : </label><br>
                  <label class="c-switch form-check-label c-switch-success">
                    <input type="checkbox" class="c-switch-input form-check-input"                           
                      v-model="fieldFormUploadImageEditor.is_lock.value">
                    <span class="c-switch-slider"></span>
                  </label><br>                 
                  <label>(if lock is 'yes' then your image cannot be use by other domain / unit / department)</label><br>                  
                </div>
                <div>
                  <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 600px; height: 300px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                    <img 
                      style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                      :src="fieldFormUploadImageEditor.image.value" 
                    />  
                  </span>
                  <button @click="globalFunctions.removeInputFile(vm,'fieldFormUploadImageEditor', 'image')" style="margin-top:10px">Remove image</button>
                </div>
              </div>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldFormUploadImageEditor.image.isValid === null) ? false : !fieldFormUploadImageEditor.image.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadImageEditor', 'image')}}
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
            @click="processSearchFirstImage()"
          >
            Search
          </CButton>
          <CButton
            color="warning"
            square
            size="sm"
            @click="processAddImageEditor()"
          >
            Add
          </CButton>        
      </CRow>
      <div class="box_list_image">
          <div v-for="(item) in listImageEditor" :key="item.id" class="item_image">
              <div>
                  <span class="span_image_thumbnail_modal" v-bind:class="{ image_selected: item['is_select'] }" @click="processChooseImageEditor(item)">                
                    <img 
                      class="image_thumbnail_modal"
                      :src="item['url_public']" 
                    />  
                  </span>
              </div>
          </div>
      </div>
      <div style="text-align: center;">
          <CButton
            color="success"
            square
            size="sm"
            @click="processLoadMoreImage()"
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
            @click="processAddImageEditor()"
          >
            Add
          </CButton>
          <CButton
            color="secondary"
            square
            size="sm"
            @click="toggleModalListImageEditor()"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>  
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
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

<script>
import { api } from '../configurations/services';
import Multiselect from 'vue-multiselect';
import globalFunctions from '../helpers/globalFunctions';

export default {
  name: 'ModalAddImageEditor',
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
      fieldFormUploadImageEditor : {
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
        image : {
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
      showModalListImageEditor : false,
      listImageEditor : [],
      
      objectEditor: null,
      
      objectParameter: null,
      fieldName: null,
      is_arrayWithIdImage: false,

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
      this.fieldFormUploadImageEditor.su_oauth_clients_id.validationRules = ['required', 'min.3', 'max.2000'];

      const data = {};
      this.baseCallApiHelper.callApi(
        "Get Oauth Clients",
        {},
        api.oauth_clients.list.method,
        api.oauth_clients.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldFormUploadImageEditor.su_oauth_clients_id.options =  data.data;

            if (this.fieldFormUploadImageEditor.su_oauth_clients_id.tempValue !== "") {
              var tempValue = this.fieldFormUploadImageEditor.su_oauth_clients_id.tempValue;
              this.fieldFormUploadImageEditor.su_oauth_clients_id.value = this.fieldFormUploadImageEditor.su_oauth_clients_id.options.find(element => element.id === tempValue);
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
      this.fieldFormUploadImageEditor.domain_id.validationRules = ['required', 'min.3', 'max.2000'];
      
      var data = {};
      if (this.activeOauthClientId == 1) {
        data = {
          "filter" : "oauth_clients_id = " + this.fieldFormUploadImageEditor.su_oauth_clients_id.value.id
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

            this.fieldFormUploadImageEditor.domain_id.options =  data.data;
            if (this.fieldFormUploadImageEditor.domain_id.tempValue !== "") {
              this.fieldFormUploadImageEditor.domain_id.value = this.fieldFormUploadImageEditor.domain_id.options.find(element => element.id === this.fieldFormUploadImageEditor.domain_id.tempValue);
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
    toggleModalListImageEditor: function () {
      this.page = 1;
      this.search =  "";

      if (this.showModalListImageEditor) {
        this.showModalListImageEditor = false;
      } else {
        const data = {
            order_by : "created_on desc",
            page     : 1,
            data_per_page : 16
        };      
        this.baseCallApiHelper.callApi(
          "Get List Image",
          null,
          api.image.list.method,
          api.image.list.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.listImageEditor = data.data;

              if (this.activeOauthClientId == 1) {
                this.processGetOauthClientsList();
              } else if (this.activeSystemUserDomain == 'master') {
                this.processGetListDomain();
              }

              this.showModalListImageEditor = true;

            }
          }, 
          true, 
          true,
          true
        );
      }
    },
    processSearchFirstImage: function() {
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
          "Get List Image",
          null,
          api.image.list.method,
          api.image.list.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.listImageEditor = data.data;
            }
          }, 
          true, 
          true,
          true
        );
    },
    processLoadMoreImage: function() {
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
          "Get List Image",
          null,
          api.image.list.method,
          api.image.list.url,  
          data, 
          (status, data, message) => {
            if(status){
              var vm = this;
              data.data.forEach(function(row) {
                vm.listImageEditor.push(row);

              });
            }
          }, 
          true, 
          true,
          true
        );
    },
    processChooseImageEditor: function(item) {
      var itemIndex = this.listImageEditor.find(e => e.id === item.id)['is_select'];
      if (typeof(itemIndex) === 'undefined' || itemIndex === false) {
        this.listImageEditor.forEach(function(e) {
          e['is_select'] = false;
        });
        this.listImageEditor.find(e => e.id === item.id)['is_select'] = true;
      } else {
        this.listImageEditor.find(e => e.id === item.id)['is_select'] = false;
      }
       this.showModalListImageEditor = false;

        this.$nextTick(() => {

          // Add the component back in
          this.showModalListImageEditor = true;
        });
    },
    processFormUploadImageEditor: function(e) {
      if (globalFunctions.validationForm(this, 'fieldFormUploadImageEditor')) {

        const data = {
            image         : this.fieldFormUploadImageEditor.image.value,
            title         : this.fieldFormUploadImageEditor.title.value,
            is_lock       : this.fieldFormUploadImageEditor.is_lock.value
        };

        var allowForSuAdmin = true;
        var su_oauth_clients_id = (typeof(this.fieldFormUploadImageEditor.su_oauth_clients_id.value) === 'undefined' 
          || this.fieldFormUploadImageEditor.su_oauth_clients_id.value ==='') ? null : this.fieldFormUploadImageEditor.su_oauth_clients_id.value.id;
        
        if (this.activeOauthClientId == 1) {
          if(su_oauth_clients_id == null) {
            allowForSuAdmin = false;
          } else {
            data.su_oauth_clients_id = su_oauth_clients_id;
          }
        }

        if (this.activeOauthClientId == 1 || this.activeSystemUserId == 2 || this.activeSystemUserDomain.toLowerCase() == 'master') {
          this.fieldFormUploadImageEditor.domain_id.tempValue = (typeof(this.fieldFormUploadImageEditor.domain_id.value) === 'undefined' 
            || this.fieldFormUploadImageEditor.domain_id.value ==='') ? null : this.fieldFormUploadImageEditor.domain_id.value.id;

          data.domain_id = this.fieldFormUploadImageEditor.domain_id.tempValue;
        }

        if (allowForSuAdmin) {
          this.baseCallApiHelper.callApi(
            "Upload Image",
            null,
            api.image.create.method,
            api.image.create.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldFormUploadImageEditor.image.value = "";
                this.fieldFormUploadImageEditor.title.value = "";
                this.fieldFormUploadImageEditor.is_lock.value = false;
                this.showModalListImageEditor = false;
                this.toggleModalListImageEditor();
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
    processAddImageEditor: function() {
      var listImageSelected = this.listImageEditor.filter(e => e.is_select === true);
      if (listImageSelected.length > 0) {
        if (this.objectEditor !== null) {
          this.objectEditor.insertEmbed(this.objectEditor.getSelection( true ).index, "image", listImageSelected[0].url_public); 
        } else if (this.objectParameter !== null && this.fieldName !== null) {
          if (!this.is_arrayWithIdImage) {
            this.objectParameter[this.fieldName].value = listImageSelected[0].url_public;
          } else {
            this.objectParameter[this.fieldName].value = [{
              id : listImageSelected[0].id,
              path : listImageSelected[0].url_public     
            }];
          }

        }

        this.showModalListImageEditor = false;
      }
    }           
  }
}

</script>
