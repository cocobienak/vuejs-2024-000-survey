<template>
   <ul class="pagination">
      <li class="page-item" v-if="(pageActive-6) < 1 && pageStart > 1">
         <a class="page-link" @click="processChangePage(1)">&laquo;</a>
      </li>         
      <li class="page-item" v-if="(pageActive-6) >= 1">
         <a class="page-link" @click="processChangePage(pageActive-6)">&laquo;</a>
      </li>
      <li class="page-item" v-if="pageStart > 1">
         <div style="padding: 10px 5px 0px 5px;"> ... </div>
      </li>

      <li class="page-item" 
         :class="(pageItem.isActive)?'active':''"
         @click="processChangePage(pageItem.page)"
         v-for="pageItem in pageItems" :key="pageItem.page"
      >
         <a class="page-link">{{ pageItem.page }}</a>
      </li>

      <li class="page-item" v-if="pageStop < pageTotal">
         <div style="padding: 10px 5px 0px 5px;"> ... </div>
      </li>
      <li class="page-item" v-if="(pageActive+6) <= pageTotal">
         <a class="page-link" @click="processChangePage(pageActive+6)">&raquo;</a>
      </li>
      <li class="page-item" v-if="(pageActive+6) > pageTotal && pageStop > 1">
         <a class="page-link" @click="processChangePage(pageTotal)">&raquo;</a>
      </li>         
   </ul>
</template>
<script>


export default {
  name: 'Pagination',
  components: {
  },
  data () {
    return {
      vm : this,
      objectActive: null,
      fieldNamePageActive: '',
      functionNameRefreshList: '',

      pageItems : [{page :1, isActive:true},{page :2, isActive:false},{page :3, isActive:false}],
      pageActive : 1,
      pageTotal : 3,
      pageStart : 1,
      pageStop : 3,
    }
  },
  created () {

  },
  mounted() {
  },
  methods: {
      togglePagination: function (pageActive, pageTotal) {

         this.pageActive = pageActive;
         this.pageTotal = pageTotal;

         this.pageStop = pageActive + 4;
         if (this.pageStop >= pageTotal) {
            this.pageStop = pageTotal
         }

         this.pageStart = this.pageStop-7;
         if (this.pageStart < 1) {
            this.pageStart = 1;
         } 

         this.pageItems = [];
         if (pageTotal > 1) {
            for (let i = this.pageStart; i <= this.pageStop; i++) {
               this.pageItems.push({page :i, isActive:(i===pageActive)?true:false}); 
            }
         }
          
      },
      processChangePage: function (pageSelected) {
         this.objectActive[this.fieldNamePageActive] = pageSelected;
         this.objectActive[this.functionNameRefreshList]();
      }                
  }
}

</script>