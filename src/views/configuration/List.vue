<template>
  <div>
    <CCard>
      <CCardBody>
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="$router.push({path: '/configuration/add'})"
        >
          Add new
        </CButton>
        <hr/>
        <CDataTable
          :items="listItems"
          :fields="fields"
          column-filter
          :tableFilter='{ label:"Search"}'
          items-per-page-select
          :items-per-page="20"
          hover
          sorter
          pagination
        >
          <template #created_on="{item}">
            <td>
              {{ moment(item.created_on).format('ll') }}
            </td>
          </template> 
          <template #value="{item}">
            <td>
                {{item.value.substring(0, 50) + ' ... '}}
            </td>
          </template>

          <template #edit_button="{item}">
            <td class="py-2">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="$router.push({ path: `/configuration/edit/${item.id}` })"
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
        <div v-if="this.isNeedPrevious100k | this.isNeedNext100k">
          <label style="color:#ff0000">Only fetch 100k record per request from database, because perfomance !!!</label>
        </div>
        <CButton
          v-if="this.isNeedPrevious100k"
          color="warning"
          variant="outline"
          square
          size="sm"
          @click="globalFunctions.togglePrevious100k(vm, vm.processGetConfigurationList)"
        >
          Previous 100k record
        </CButton> 
        <CButton
          v-if="this.isNeedNext100k"
          color="warning"
          variant="outline"
          square
          size="sm"
          @click="globalFunctions.toggleNext100k(vm, vm.processGetConfigurationList)"
        >
          Next 100k record
        </CButton>
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
            @click="processDeleteConfiguration()"
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

<script>
import store from '../../store';
import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'ConfigurationList',
  data () {
    return {
      store,
      moment,
      globalFunctions,
      vm : this,      
      listItems: [],
      pageDataBase : 1,
      isNeedPrevious100k : false,
      isNeedNext100k : false,
      labelDeleteModal : "",
      showDeleteModal: false,
      itemDeleteID: null,
      fields : [
        { key: 'id', label: 'ID', _style:'width:20px', isFields: true }, 
        { key: 'key', label: 'Key', _style:'min-width:100px', isFields: true },
        { key: 'type_data', label: 'Type', _style:'min-width:100px', isFields: true },
        { key: 'value', label: 'Value', _style:'min-width:200px', isFields: true },
        { key: 'description', label: 'Description', _style:'min-width:200px', isFields: true },
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
      ]

     
    }
    
  },
  mounted() {
    this.processGetConfigurationList();
  },
  methods: {
    processGetConfigurationList: function (e) {
        const data = {
          select : globalFunctions.mapFields(this.fields),
          filter : "",
          order_by : "created_on desc", // always include 'created_on desc' for grab the new data from database
          page: this.pageDataBase,
          data_per_page: 100000 // set 100000 record per request for perfomance
        };

        baseCallApiHelper.callApi(
          "Get configuration list",
          null,
          api.configuration.list.method,
          api.configuration.list.url, 
          data, 
          (status, data, message) => {
            if(status) {
              (data.from === 1 || data.from === null) ? this.isNeedPrevious100k = false : this.isNeedPrevious100k = true;
              (data.to === data.total || data.total === 0) ? this.isNeedNext100k = false : this.isNeedNext100k = true;
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
            } else {
              this.listItems = [];
            }
          }, 
          true, 
          true,
          true
        );
    },
    processDeleteConfiguration: function () {
      const data = {
      };      
      if (this.itemDeleteID) {
        baseCallApiHelper.callApi(
          "Delete configuration",
          null,
          api.configuration.delete.method,
          api.configuration.delete.url + '/' + this.itemDeleteID, 
          data, 
          (status, data, message) => {
            this.itemDeleteID = null;              

            if(status){
              this.processGetConfigurationList();
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
