<template>
  <div>
    <CCard>
      <CCardBody>
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="$router.push({path: '/form-survey/add'})"
        >
          Add new
        </CButton>
        <hr/>
        <!-- FILTER INPUT -->
        <CRow>  
          <CCol md="3" v-if="activeOauthClientId == 1 || activeSystemUserDomain == 'master'">
            <div class="form-group">
              <multiselect 
                v-model="list_domain.value" 
                :options="list_domain.options" 
                :custom-label="optionsDomain" 
                :allow-empty="true"
                :multiple="true"
                placeholder="Select Domain To Search"
                label="code" track-by="code">
              </multiselect>
            </div> 
          </CCol>   
          <CCol md="3">
            <CInput
              class="input_search_adt"
              name="name"
              v-model="search_name"
              placeholder="Name Survey ..."               
            />
          </CCol>             
          <CCol md="3">
            <CButton
              class="button_search_adt"
              @click="processGetFormSurveyList('search')"
            >
              filter
            </CButton>
          </CCol>                                               
        </CRow>     
        <hr/>
        <!-- PAGINATION -->
        <CRow>
          <CCol sm="10">
            <Pagination ref="Pagination_Top" />        
          </CCol>
          <CCol sm="2">
            View : 
            <CSelect style="display: inline-block !important;width: 70% !important;"
              name="dataPerPage"
              :value.sync="dataPerPage"
              @input="pageDataBase=1;globalFunctions.changeDataPerPage($event,vm,'processGetFormSurveyList','dataPerPage')"                
              :options="[20,50,100,500]"
            />     
          </CCol>
        </CRow>

        <!-- :tableFilter='{ label:"Search"}'
          items-per-page-select 
          :items-per-page="20"
          pagination
          -->
        <CDataTable
          :items="listItems"
          :fields="fields"
          @row-clicked="toggleDetails"
          hover
        >
          <template #created_on="{item}">
            <td>
              {{ item.created_on = moment(item.created_on).format('ll') }}
            </td>
          </template>         
          <template #edit_button="{item}">
            <td class="py-2">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="$router.push({ path: `/form-survey/edit/${item.id}` })"
              >
                Edit
              </CButton>
            </td>
          </template>
          <template #delete_button="{item}">
            <td class="py-2">
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                @click="globalFunctions.toggleDeleteModal(vm, item, true, item.code)"
              >
                Delete
              </CButton>
            </td>
          </template>
        </CDataTable>

        <!-- PAGINATION -->
        <CRow>
          <CCol sm="10">
            <Pagination ref="Pagination_Bottom" />        
          </CCol>
          <CCol sm="2">
            View : 
            <CSelect style="display: inline-block !important;width: 70% !important;"
              name="dataPerPage"
              :value.sync="dataPerPage"
              @input="pageDataBase=1;globalFunctions.changeDataPerPage($event,vm,'processGetFormSurveyList','dataPerPage')"                
              :options="[20,50,100,500]"
            />     
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CModal
      :centered="true"
      title="Confirmation Delete !!"
      color="warning"
      :show.sync="showDeleteModal"
    >
      <label>{{labelDeleteModal}}</label>

      <div slot="footer-wrapper" class="w-100">
        <div class="modal-footer">
          <CButton
            color="warning"
            square
            size="sm"
            @click="processDeleteFormSurvey()"
          >
            Delete
          </CButton>
          <CButton
            color="secondary"
            square
            size="sm"
            @click="globalFunctions.toggleDeleteModal(vm)"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>
  </div>
</template>

<style lang="scss">
  @import '../../assets/scss/page_list';
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<script>
import store from '../../store';
import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

import Pagination from '../../components/Pagination.vue';

import Multiselect from 'vue-multiselect';

export default {
  name: 'FormSurveyList',
  components: {
    Multiselect,
    Pagination
  }, 
  data () {
    return {
      store,
      moment,
      globalFunctions,
      vm : this, 
      activeOauthClientId : localStorage.getItem('oauthClientId'),
      activeSystemUserName : localStorage.getItem('systemUserName'),
      activeSystemUserId : localStorage.getItem('systemUserId'),
      activeSystemUserDomain : localStorage.getItem('systemUserDomain'),
      activeSystemUserDomainId : localStorage.getItem('systemUserDomainId'),

      listItems: [],
      pageDataBase : 1,
      dataPerPage : 20,

      labelDeleteModal : "",
      showDeleteModal: false,
      itemDeleteID: null,
      collapseDuration: 0,
      details: [],

      fields : [
        { key: 'id', label: 'ID', _style:'width:20px', isFields: true }, 
        { key: 'survey_name', label: 'Survey Name', _style:'min-width:50px', isFields: true },
        { key: 'participant_limit', label: 'Participant Limit', _style:'min-width:100px', isFields: true },
        { key: 'participant_type', label: 'Participant Type', _style:'min-width:100px', isFields: true },
        { key: 'survey_start', label: 'Survey Start', _style:'min-width:100px', isFields: true },
        { key: 'survey_end', label: 'Survey End', _style:'min-width:100px', isFields: true },
        { key: 'modified_by.name', label: 'Modified By', _classes:["d-none", "sr_only"], isFields: true },
        { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
        // Classes d-none & sr_only make visibility hide on table
        { key: 'created_by.name', label: 'Created By', _style:'min-width:100px;', isFields: true },
        { key: 'created_on', label: 'Created On', _style:'min-width:100px;', isFields: true },
                { 
          key: 'edit_button', 
          label: '', 
          _style: 'width:1%', 
          sorter: false, 
          filter: false
        },
        { 
          key: 'delete_button', 
          label: '', 
          _style: 'width:1%', 
          sorter: false, 
          filter: false
        }
      ],

      list_domain : {
        value : [],
        tempValue : "",
        options: [],   
      },      
      search_name:"",
      list_type:'all'

     
    }
    
  },
  mounted() {
    this.processGetFormSurveyList(null);
    if (this.activeOauthClientId == 1 || this.activeSystemUserDomain == 'master') {
      this.processGetListDomain();
    }
  },
  methods: {
    optionsDomain ({ id, code, name, link_web }) {
      var title = name;
      if (link_web !== "" && link_web !== null)
        title += ' - ' + link_web;

      return `${code} : ${title} `
    },  
    processGetListDomain: function () {
   
      var data = {};
      if (this.activeOauthClientId != 1) {
        data = {
          "filter" : "oauth_clients_id = " + this.activeOauthClientId
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
            this.list_domain.options =  data.data;
          }
        }, 
        false, 
        true,
        true
      );

      this.showDomain = true;
      
    },
    processGetFormSurveyList: function (action = null) {
      if (action === 'search' || action === 'delete') {
          this.pageDataBase = 1;
      }

        const data = {
          // select : globalFunctions.mapFields(this.fields),
          filter : "",
          order_by : "created_on desc", // always include 'created_on desc' for grab the new data from database
          page: this.pageDataBase,
          data_per_page: this.dataPerPage // set 100000 record per request for perfomance
        };

        if (this.list_domain.value.length > 0) {
          data.filter = (data.filter != "") ? data.filter + " and " : "";
          var $domainIDConcat = "";
          this.list_domain.value.forEach(function(row) {
            $domainIDConcat += row.id + ',';            
          });
          $domainIDConcat += '0';

          data.filter = data.filter + "(domain_id in ("+$domainIDConcat+"))";
        }

        if(this.search_name != "") {
          data.filter = (data.filter != "") ? data.filter + " and " : "";

          data.filter = data.filter + "(survey_name like '%" + this.search_name + "%')";
        }

        this.$refs.Pagination_Top.objectActive = this;
        this.$refs.Pagination_Top.fieldNamePageActive = "pageDataBase";
        this.$refs.Pagination_Top.functionNameRefreshList = "processGetStoriesList";
        
        this.$refs.Pagination_Bottom.objectActive = this;
        this.$refs.Pagination_Bottom.fieldNamePageActive = "pageDataBase";
        this.$refs.Pagination_Bottom.functionNameRefreshList = "processGetStoriesList";
        
        baseCallApiHelper.callApi(
          "Get form survey list",
          null,
          api.form_survey.list.method,
          api.form_survey.list.url, 
          data, 
          (status, data, message) => {
            if(status) {

              data.data.forEach(function(row) {
                for (const property in row) {
                  if (row[property] === null) {
                    row[property] = '-';
                  } else if (row[property].toString().toLowerCase() === 'null') {
                    row[property] = '-';
                  }
                };              
              });              
              this.listItems = data.data.map((item) => { return {...item}});

              
              this.$refs.Pagination_Top.togglePagination(this.pageDataBase, data.last_page); 
              this.$refs.Pagination_Bottom.togglePagination(this.pageDataBase, data.last_page); 

            } else {
              this.listItems = [];

              this.$refs.Pagination_Top.togglePagination(this.pageDataBase, 0); 
              this.$refs.Pagination_Bottom.togglePagination(this.pageDataBase, 0); 
            }
          }, 
          true, 
          true,
          true
        );
    },
    toggleDetails (item, index) {
      this.$set(this.listItems[index], '_toggled', !item._toggled);
      this.collapseDuration = 200;
      this.$nextTick(() => { this.collapseDuration = 0});
    },
    processDeleteFormSurvey: function () {
      const data = {
      };      
      if (this.itemDeleteID) {
        baseCallApiHelper.callApi(
          "Delete form survey",
          null,
          api.form_survey.delete.method,
          api.form_survey.delete.url + '/' + this.itemDeleteID, 
          data, 
          (status, data, message) => {
            this.itemDeleteID = null;              

            if(status){
              this.processGetFormSurveyList();
            }
          }, 
          true, 
          true,
          true
        );
      }
      this.showDeleteModal = false;
    }
  }

}

</script>
