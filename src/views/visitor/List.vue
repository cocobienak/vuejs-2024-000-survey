<template>
  <div>
    <CCard>
      <CCardBody>
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="$router.push({path: '/visitor/add'})"
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
          <template #birth_date="{item}">
            <td>
              <span v-if="item.birth_date !== null && item.birth_date != '' && item.birth_date  != '-'">{{ moment(item.birth_date).format('ll') }}</span>
              <span v-else>-</span>              
            </td>
          </template>         
          <template #created_on="{item}">
            <td>
              {{ item.created_on = moment(item.created_on).format('ll') }}
            </td>
          </template>  
          <template #is_active="{item}">
            <td>
              <CBadge :color="globalFunctions.getBadgeIsActive(item.is_active)">
                {{globalFunctions.getLabelIsActive(item.is_active)}}
              </CBadge>
            </td>
          </template>
          <template #edit_button="{item}">
            <td class="py-2">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="$router.push({ path: `/visitor/edit/${item.id}` })"
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
                @click="globalFunctions.toggleDeleteModal(vm, item, true, item.name)"
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
          @click="globalFunctions.togglePrevious100k(vm, vm.processGetVisitorList)"
        >
          Previous 100k record
        </CButton> 
        <CButton
          v-if="this.isNeedNext100k"
          color="warning"
          variant="outline"
          square
          size="sm"
          @click="globalFunctions.toggleNext100k(vm, vm.processGetVisitorList)"
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
            @click="processDeleteVisitor()"
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
  name: 'VisitorList',
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
      // isField = true, for include into query to api
        { key: 'id', label: 'ID', _style:'width:20px', isFields: true }, 
        { key: 'name', label: 'Name', _style:'min-width:100px', isFields: true },
        { key: 'email', label: 'Email', _style:'min-width:200px', isFields: true },
        { key: 'username', label: 'Username', _classes:["d-none", "sr_only"], isFields: true },
        { key: 'phone_number', label: 'Phone Number', _style:'min-width:200px', isFields: true },
        { key: 'is_active', label: 'Status', _style:'width:40px', isFields: true },
        { key: 'gender', label: 'Gender', _style:'min-width:200px', isFields: true },
        { key: 'birth_date', label: 'Birth Date', _style:'min-width:200px', isFields: true },

        { key: 'modified_by.name', label: 'Modified By', _classes:["d-none", "sr_only"], isFields: true },
        { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
        // Classes d-none & sr_only make visibility hide on table
        { key: 'created_by.name', label: 'Created By', _style:'min-width:100px;', isFields: true },
        { key: 'created_on', label: 'Created On', _style:'min-width:100px;', isFields: true },

      // Tools
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
    this.processGetVisitorList();
  },
  methods: {
    processGetVisitorList: function (e) {
        const data = {
          select : globalFunctions.mapFields(this.fields),
          filter : "",
          order_by : "created_on desc", // always include 'created_on desc' for grab the new data from database
          page: this.pageDataBase,
          data_per_page: 100000 // set 100000 record per request for perfomance
        };

        baseCallApiHelper.callApi(
          "Get visitor list",
          null,
          api.visitor.list.method,
          api.visitor.list.url, 
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
    processDeleteVisitor: function () {
      const data = {
      };      
      if (this.itemDeleteID) {
        baseCallApiHelper.callApi(
          "Delete Visitor",
          null,
          api.visitor.delete.method,
          api.visitor.delete.url + '/' + this.itemDeleteID, 
          data, 
          (status, data, message) => {
            this.itemDeleteID = null;              

            if(status){
              this.processGetVisitorList();
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
