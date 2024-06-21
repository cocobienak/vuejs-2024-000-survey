<template>
  <div>
    <CCard>
      <CCardBody >
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="$router.push({path: '/event/add'})"
        >
          Add new
        </CButton>
        <hr/>

        <!-- FILTER TIME -->
        <CRow>
          <div class="guard-status-info" style="display:flex;justify-content: flex-start; flex-wrap: wrap;">
            <div class="status-info">
              <a 
                :class="(event_time==='all')?'active-bold-adt':''"
                :style="colorAll"
                @click="event_time='all';processGetEventList('search')"
              >
                All Date
              </a> | &nbsp; 
            </div> 
            <div class="status-info">
              <a
                :class="(event_time==='on_going')?'active-bold-adt':''" 
                :style="colorAll"
                @click="event_time='on_going';processGetEventList('search')"
              >
                On Going
              </a> | &nbsp; 
            </div>   
            <div class="status-info">
              <a 
                :class="(event_time==='has_passed')?'active-bold-adt':''"
                :style="colorAll"
                @click="event_time='has_passed';processGetEventList('search')"
              >
                Has Passed 
              </a>              
            </div>    
          </div>     
        </CRow> 
        <!-- FILTER INFO GRAFIS -->
        <CRow>
          <CCol md="3" >
            <div class="info-box">
              <div class="info-title">
                ALL EVENT
              </div>
              <div class="info-fill">
                <span :class="(list_type=='all')?'active-bold-adt':''">All</span> 
                <span class="info-count">({{countAll}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='all';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='all_published')?'active-bold-adt':''">Published</span>  
                <span class="info-count">({{countAllPublished}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='all_published';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='all_draft')?'active-bold-adt':''">Draft</span>  
                <span class="info-count">({{countAllUnpublished}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='all_draft';processGetEventList('search')"
                ></a>
              </div>
            </div>
          </CCol> 
          <CCol md="3">
            <div class="info-box">
              <div class="info-title">
                MY EVENT
              </div>
              <div class="info-fill">
                <span :class="(list_type=='my_all')?'active-bold-adt':''">All</span> 
                <span class="info-count" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">({{countMyPublished + countMyDraft + countMyNeedApproval}})</span>
                <span class="info-count" v-else>({{countMyPublished + countMyDraft}})</span>

                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='my_all';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='my_published')?'active-bold-adt':''">Published</span>  
                <span class="info-count">({{countMyPublished}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='my_published';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
                <span :class="(list_type=='my_pendingapproval')?'active-bold-adt':''">Pending Approval</span>  
                <span class="info-count">({{countMyNeedApproval}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='my_pendingapproval';processGetEventList('search')"
                ></a>
              </div>              
              <div class="info-fill">
                <span :class="(list_type=='my_draft')?'active-bold-adt':''">Draft</span> 
                <span class="info-count">({{countMyDraft}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='my_draft';processGetEventList('search')"
                ></a>
              </div>
            </div>
          </CCol>  
          <!-- Untuk domain unit / divisi / jurusan -->
          <CCol md="3" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
            <div class="info-box">
              <div class="info-title">
                FROM SHARED EVENT
              </div>
              <div class="info-fill">
                <span :class="(list_type=='shared_approval')?'active-bold-adt':''">My Approval</span> 
                <span class="info-count">({{countSharedPublished}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='shared_approval';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='shared_rejection')?'active-bold-adt':''">My Rejection</span> 
                <span class="info-count">({{countSharedNeedPublish}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='shared_rejection';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='shared_waitingconfirmation')?'active-bold-adt':''">Waiting Confirmation</span> 
                <span class="info-count">({{countSharedWaiting}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='shared_waitingconfirmation';processGetEventList('search')"
                ></a>
              </div>
            </div>
          </CCol> 
          <CCol md="3">
            <div class="info-box">
              <div class="info-title">
                localhost PERMISSION
              </div>
              <div class="info-fill">
                <span :class="(list_type=='permission_approve')?'active-bold-adt':''">Approve</span> 
                <span class="info-count">({{countMyAcceptedPublish}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='permission_approve';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='permission_reject')?'active-bold-adt':''">Reject</span> 
                <span class="info-count">({{countMyRejectedPublish}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='permission_reject';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='permission_pendingapproval')?'active-bold-adt':''">Pending Approval</span> 
                <span class="info-count">({{countMyNeedApproval}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='permission_pendingapproval';processGetEventList('search')"
                ></a>
              </div>
              <div class="info-fill">
                <span :class="(list_type=='permission_draft')?'active-bold-adt':''">Draft</span> 
                <span class="info-count">({{countAllDraft}})</span>
                <span class="menu-icon"><i class="right-arrow"></i></span>
                <a class="overlay-layout" href="#"
                  @click="list_type='permission_draft';processGetEventList('search')"
                ></a>
              </div>              
            </div>
            </CCol> 
        </CRow>
        <hr/>
          <!-- FILTER INPUT -->
        <CRow>            
          <CCol md="3" v-if="event_time==='all'">
            <div role="group" class="form-group"> 
              <VueCtkDateTimePicker 
                label="Select Event Date & Time"
                v-model="event_start"
                format="YYYY-MM-DD HH:mm:ss"
                formatted="ddd, YYYY MMM DD, HH:mm"
                :no-value-to-custom-elem="false"
                :range="true">  
              </VueCtkDateTimePicker>                 
            </div>
          </CCol> 
          <CCol md="3">
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
              placeholder="Name Event ..."               
            />
          </CCol>             
          <CCol md="3">
            <CButton
              class="button_search_adt"
              @click="processGetEventList('search')"
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
                @input="pageDataBase=1;globalFunctions.changeDataPerPage($event,vm,'processGetEventList','dataPerPage')"                
                :options="[20,50,100,500]"
              />     
            </CCol>
        </CRow>      

          <!-- :tableFilter='{ label:"Search"}'
          items-per-page-select 
          :items-per-page="20"
          pagination-->
        <CDataTable
          :items="listItems"
          :fields="fields"
          column-filter
          @row-clicked="toggleDetails"
          hover
          sorter
        >
          <template #name="{item}">
            <td class="main-field" style="min-width:250px">
              <div class="main-field-detail">{{item.name}}</div>
              <div class="main-field-tools">
                <div class="mfield-tools-detail">
                  <!-- For master -->
                  <div v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1"
                  class="div-btn-list" >  

                  <div v-if="item.is_publish==1"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEvent(item)"
                      >
                        <span v-if="activeOauthClientId == 1">Unpublish on web</span>
                        <span v-else>Unpublish</span>                      
                         
                      </a>             
                    </div>
                    <div v-else-if="item.is_publish==0 && item.is_publish_domain==1"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEvent(item)"
                      >
                        <span v-if="activeOauthClientId == 1">Publish on web</span>
                        <span v-else>Publish</span>  
                      </a>             
                    </div>      
                    <div v-else-if="item.is_publish==0 && item.is_publish_domain==0"
                    class="div-btn-list separate-adt" >
                      <label class="text-info label-adt">Status Draft on Web Unit</label>                
                    </div>            

                    <!-- Perubahan aturan menghilangkan proses aproval -->
                    <!-- <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a
                        class="button-list-adt" 
                        @click="prosessApprovalUnpublish(item, 1, true)"
                      >
                        Accepted
                      </a>
                    </div>
                    Kondisi sama dengan yang diatas
                    <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt" 
                        @click="toggleRejectedPublishModal(item)"
                      >
                        Reject
                      </a>
                    </div>                                                                  
                    <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="toggleRejectedPublishModal(item, 'Confirmation Unpublish !!', 'Unpublish event :')"
                      >
                        <span v-if="activeOauthClientId == 1">Unpublish From WEB Event</span>
                        <span v-else>Unpublish</span> 
                      </a>             
                    </div>
                    Punya master sendiri
                    <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==1"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEvent(item)"
                      >
                        <span v-if="activeOauthClientId == 1">Unpublish From WEB Event</span>
                        <span v-else>Unpublish</span>                      
                         
                      </a>             
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==0"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEvent(item)"
                      >
                        <span v-if="activeOauthClientId == 1">Publish From WEB Event</span>
                        <span v-else>Publish</span>  
                      </a>             
                    </div> -->
                  </div>
                  <!-- For unit / jurusan -->
                  <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) == parseInt(activeSystemUserDomainId)) || activeOauthClientId == 1"
                  class="div-btn-list" >   
                    <div v-if="(item.is_publish_domain==1) && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEventDomain(item, true)"
                      >
                        <span v-if="activeOauthClientId == 1">Unpublish From Web Unit</span>
                        <span v-else>Unpublish</span>

                      </a>             
                    </div> 
                    <div v-else-if="(item.is_publish_domain==0) && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEventDomain(item, true)"
                      >
                        <span v-if="activeOauthClientId == 1">Publish From Web Unit</span>
                        <span v-else>Publish</span>
              
                      </a>             
                    </div> 
                    
                    <!-- Perubahan aturan menghilangkan proses aproval (di 2023)-->
                    <!-- <div v-if="(item.publish_status=='publish_global_accepted' || (item.publish_status=='publish_local' && item.is_publish_domain==1)) && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="toggleRejectedPublishModal(item, 'Confirmation Unpublish !!', 'Unpublish event :')"
                      >
                        <span v-if="activeOauthClientId == 1">Unpublish From Web Unit</span>
                        <span v-else>Unpublish</span>

                      </a>             
                    </div>
                    <div v-else-if="(item.publish_status=='publish_global_accepted' || (item.publish_status=='publish_local' && item.is_publish_domain==0)) && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEventDomain(item, true)"
                      >
                        <span v-if="activeOauthClientId == 1">Publish From Web Unit</span>
                        <span v-else>Publish</span>
              
                      </a>             
                    </div>
                    <div v-else-if="(item.publish_status=='publish_global_rejected' || item.publish_status=='publish_global_draft') && item['domain_id.code']!='master'"
                    class="div-btn-list separate-adt" >
                      <a 
                        class="button-list-adt"
                        @click="prosessPublishEventDomain(item, true)"
                      >
                        Request Approval 
                      </a>             
                    </div> -->
                  </div>
                  <!-- From Event Share -->
                  <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) != parseInt(activeSystemUserDomainId) && activeOauthClientId != 1)"
                  class="div-btn-list" >               
                    <div v-if="item['share_domain.is_publish']==0 && item.is_publish_domain_origin==1"
                    class="div-btn-list separate-adt" >
                      <a
                        class="button-list-adt"
                        @click="prosessPublishEventShare(item)"
                      >
                        Publish
                      </a>                  
                    </div>
                    <div v-else-if="item['share_domain.is_publish']==1 && item.is_publish_domain_origin==1"
                    class="div-btn-list separate-adt" >
                      <a
                        class="button-list-adt" 
                        @click="prosessPublishEventShare(item)"
                      >
                        Unpublish
                      </a>                  
                    </div> 
                  </div>
                  <!-- Edit -->
                  <div
                    class="div-btn-list separate-adt" >
                    <a 
                      class="button-list-adt" 
                      @click="$router.push({ path: `/event/edit/${item.id}` })"
                    >
                      Edit
                    </a>                
                  </div> 
                  <!-- Delete -->                  
                  <div
                    class="div-btn-list" >
                    <a
                      class="button-list-adt"
                      @click="globalFunctions.toggleDeleteModal(vm, item, true, item.name)"
                    >
                      Delete
                    </a>                  
                  </div>
                </div>
              </div>
              <!-- Perubahan aturan menghilangkan proses aproval (di 2023)-->
              <!-- <div class="main-field-tools">
                <div class="mfield-tools-detail">
                  <div v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1" style="padding-bottom:5px"> 
  
                    <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                      <label class="text-info label-adt">Request Publish</label><br>
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_rejected' && item['domain_id.code']!='master'">
                        <label class="text-info label-adt">Rejected publish</label>            
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_draft' && item['domain_id.code']!='master'">
                        <label class="text-info label-adt">Draft</label>            
                    </div>                                                                            
                  </div>                  
                  <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) == parseInt(activeSystemUserDomainId)) || activeOauthClientId == 1" style="padding-bottom:5px"> 
                    <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                        <label class="text-info label-adt">Prosess approval</label>
                    </div>                
                    <div v-else-if="(item.publish_status=='publish_global_rejected' || item.publish_status=='publish_global_draft') 
                      && item['domain_id.code']!='master'">
                      <label class="text-info label-adt" v-if="item.publish_status=='publish_global_draft'">Draft</label>
                      <label class="text-info label-adt" v-else-if="item.publish_status=='publish_global_rejected'">Rejected</label>             
                    </div>
                  </div>
                  <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) != parseInt(activeSystemUserDomainId) && activeOauthClientId != 1)"> 
                    <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_local' || item.publish_status=='publish_global_accepted')">
                      <label class="text-info label-adt">Cannot publish, because on origin is not publish</label>                
                    </div>             
                    <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_global' || item.publish_status=='publish_global_rejected')">
                      <label class="text-info label-adt">Status Unpublish, prosses approval From Web Unit</label>                
                    </div>                   
                  </div>
                </div>
              </div> -->
            </td>
          </template>
          <!-- <template #event_start="{item}">
            <td class="sub-field">
              <span v-if="item.event_start !== null && item.event_start != '' && item.event_start  != '-'">{{ item.event_start = moment(item.event_start).format('LLL') }}</span>
              <span v-else>-</span>
            </td>
          </template>
          <template #event_end="{item}">
            <td class="sub-field">
              <span v-if="item.event_end !== null && item.event_end  != '' && item.event_end  != '-'">{{ item.event_end =  moment(item.event_end).format('LLL') }}</span>
              <span v-else>-</span>
            </td>
          </template> -->
          <!-- <template #is_publish="{item}">
            <td class="tools-field">
              <div v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1" style="padding-bottom:5px"> 
     
                <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                  <label class="text-info label-adt" :style="colorNeedApproval">Need Approval</label><br>
                </div>
                <div v-else-if="item.publish_status=='publish_global_rejected' && item['domain_id.code']!='master'">
                    <label class="text-info label-adt" :style="colorRejectedPublished">Rejected publish</label>            
                </div>
                <div v-else-if="item.publish_status=='publish_global_draft' && item['domain_id.code']!='master'">
                    <label class="text-info label-adt" :style="colorDraft">Draft</label>            
                </div>                                                 
                <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']!='master'">
                  <label class="text-info label-adt" :style="colorPublished">
                      <span v-if="activeOauthClientId == 1">Published On WEB Event</span>
                      <span v-else>Published</span>                   
                  </label>                       
                </div>
                <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==1">
                  <label class="text-info label-adt" :style="colorPublished">                        
                      <span v-if="activeOauthClientId == 1">Published On WEB Event</span>
                      <span v-else>Published</span> 
                  </label>                                 
                </div>
                <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==0">
                  <label class="text-info label-adt" :style="colorUnpublished">
                        <span v-if="activeOauthClientId == 1">Un-Published On WEB Event</span>
                        <span v-else>Un-Published</span> 
                  </label>                                  
                </div>                              
              </div>
              <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) == parseInt(activeSystemUserDomainId)) || activeOauthClientId == 1" style="padding-bottom:5px"> 
 
                <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                    <label class="text-info label-adt" :style="colorNeedApproval">Prosess approval</label>
                </div> 
                <div v-else-if="(item.publish_status=='publish_global_accepted' || (item.publish_status=='publish_local' && item.is_publish_domain==1)) && item['domain_id.code']!='master'">
                  <label class="text-info label-adt" :style="colorPublished">
                        <span v-if="activeOauthClientId == 1">Published On Origin</span>
                        <span v-else>Published</span>                  
                  </label>           
                </div>
                <div v-else-if="(item.publish_status=='publish_global_accepted' || (item.publish_status=='publish_local' && item.is_publish_domain==0)) && item['domain_id.code']!='master'">
                  <label class="text-info label-adt" :style="colorUnpublished">
                        <span v-if="activeOauthClientId == 1">Un-Published On Origin</span>
                        <span v-else>Un-Published</span>                    
                  </label>              
                </div>                
                <div v-else-if="(item.publish_status=='publish_global_rejected' || item.publish_status=='publish_global_draft') && item['domain_id.code']!='master'">
                  <label class="text-info label-adt" :style="colorDraft" v-if="item.publish_status=='publish_global_draft'">Draft</label>
                  <label class="text-info label-adt" :style="colorRejectedPublished" v-else-if="item.publish_status=='publish_global_rejected'">Rejected</label>             
                </div>

              </div>
              <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) != parseInt(activeSystemUserDomainId) && activeOauthClientId != 1)" style="padding-bottom:5px"> 
                <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_local' || item.publish_status=='publish_global_accepted')">
                  <label class="text-info label-adt" :style="colorUnpublished">Cannot publish, because on origin is not publish</label>                
                </div>             
                <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_global' || item.publish_status=='publish_global_rejected')">
                  <label class="text-info label-adt" :style="colorNeedApproval">Status Un-Publish, prosses approval From Web Unit</label>                
                </div>                   
                <div v-else-if="item['share_domain.is_publish']==0 && item.is_publish_domain_origin==1">
                  <label class="text-info label-adt" :style="colorUnpublished">Un-Publish</label>                   
                </div>
                <div v-else-if="item['share_domain.is_publish']==1 && item.is_publish_domain_origin==1">
                  <label class="text-info label-adt" :style="colorPublished">Published</label>                 
                </div> 
              </div>  
            </td>
          
          </template> -->
          <!-- <template #created_on="{item}">
            <td>
              {{ item.created_on = moment(item.created_on).format('ll') }}
            </td>
          </template> -->         
          <template #details="{item}">
            <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration" style="ba">
              <CCardBody style="background:#dadada !important;"> 
                <CRow class="sub-field-responsive">
                  <CCol md="4">
                    <div>ID : {{item.id}}</div>
                  </CCol>
                  <CCol md="4">
                    <div>Speaker : {{item.speaker_name}}</div>
                  </CCol> 
                  <CCol md="4">
                    <div>Category : {{item['event_category_id.name']}}</div>
                  </CCol>                   
                </CRow>
                <CRow class="sub-field-responsive">
                  <CCol md="12">
                    <hr/>
                  </CCol> 
                </CRow>                  
                <CRow>
                  <CCol md="4">
                    <div>Domain : {{item['domain_id.code']}}</div>
                  </CCol>                      
                  <CCol md="4">
                    <div>event_start : 
                        <span v-if="item.event_start !== null && item.event_start != '' && item.event_start  != '-'">{{ item.event_start = moment(item.event_start).format('LLL') }}</span>
                        <span v-else>-</span>
                    </div>
                  </CCol> 
                  <CCol md="4">
                    <div>event_end :
                      <span v-if="item.event_end !== null && item.event_end  != '' && item.event_end  != '-'">{{ item.event_end =  moment(item.event_end).format('LLL') }}</span>
                      <span v-else>-</span>                      
                    </div>
                  </CCol>                   
                </CRow>                
                <CRow>
                  <CCol md="12">
                    <hr/>
                  </CCol> 
                </CRow>                              
                <CRow>
                  <CCol md="4">
                    <div>Event Type : {{item.event_type}}</div>
                  </CCol>
                  <CCol md="4">
                    <div>Localtion Type : {{item.location_type}}</div>
                  </CCol> 
                  <CCol md="4">
                    <div>Member Type : {{item.member_type}}</div>
                  </CCol>  
                </CRow>
                <CRow>
                  <CCol md="12">
                    <hr/>
                  </CCol> 
                </CRow> 
                <div style="font-weight:bold;">Content : </div>
                <div v-html="item.content_html"></div>
                <CRow>
                  <CCol md="12">
                    <hr/>
                  </CCol> 
                </CRow>                 
                <div v-html="renderPublishMessage(item.publish_message)" ></div>
              </CCardBody>
            </CCollapse>
          </template>          
        </CDataTable>

        <!-- PAGINATION -->
        <CRow>
            <CCol sm="10">
              <Pagination ref="Pagination_Bottom" />        
            </CCol>   

            <CCol sm="2">
              View : 
              <CSelect 
                class="slct-view-list"
                name="dataPerPage"
                :value.sync="dataPerPage"
                @input="pageDataBase=1;globalFunctions.changeDataPerPage($event,vm,'processGetEventList','dataPerPage')"                
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
            @click="processDeleteEvent()"
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
    <CModal
      :centered="true"
      :title="titlePublishModal"
      color="warning"
      :show.sync="showRejectedPublishModal"
    >
      <label>{{labelPublishModal}}</label>
      <br>
      <label>{{dataEventModal.id}} : {{dataEventModal.name}}</label>
      <br>
        <CTextarea
          name="publish_message"
          v-model="fieldFormPublish.publish_message.value"
          placeholder="Reason ..."
          :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFormPublish', 'publish_message')"
          :is-valid="globalFunctions.getIsValidfield(this,'fieldFormPublish', 'publish_message')"
          @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormPublish', 'publish_message')"
          label="Reason"
        /> 

      <div slot="footer-wrapper" class="w-100">
        <div class="modal-footer">
          <CButton v-if="activeSystemUserDomain == 'master'"
            color="warning"
            square
            size="sm"
            @click="prosessApprovalUnpublish(dataEventModal, 0)"
          >
            Submit
          </CButton>
          <CButton v-if="(activeSystemUserDomain != 'master' && parseInt(dataEventModal.domain_id) == parseInt(activeSystemUserDomainId))"
            class="button-adt" 
            :style="colorUnpublished"
            square
            size="sm"
            @click="prosessPublishEventDomain(dataEventModal)"
          >
            Un-Publish 
          </CButton>   
          <CButton
            color="secondary"
            square
            size="sm"
            @click="toggleRejectedPublishModal(null)"
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
<style src="vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"></style>

<script>
import store from '../../store';
import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

import Pagination from '../../components/Pagination.vue';

import Multiselect from 'vue-multiselect';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

export default {
  name: 'EventList',
  components: {
    Multiselect,
    VueCtkDateTimePicker,
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
        { key: 'id', label: 'ID', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'domain_id.code', label: 'Domain', _classes:["sub-field"], _style:'min-width:100px', filter: false, isFields: true },
 
        { key: 'name', label: 'Name', _classes:["main-field"], _style:'min-width:300px', filter: false, isFields: true },
        { key: 'speaker_id.name', label: 'Speaker', _classes:["sub-field"], _style:'min-width:100px', filter: false, isFields: false },
        
        { key: 'event_category_id.name', label: 'Category', _classes:["sub-field"], _style:'min-width:100px', filter: false, isFields: true },
        { key: 'event_category_id', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        
        { key: 'event_start', label: 'Event Start', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'event_end', label: 'Event End', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'event_type', label: 'Event Type', _classes:["d-none", "sr_only"], filter: false, isFields: true },

        { key: 'member_type', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'content_text', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'location_type', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'location_address', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'location_longitude', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'location_latitude', label: '', _classes:["d-none", "sr_only"], filter: false, isFields: true },

        { key: 'modified_by.name', label: 'Modified By', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        // Classes d-none & sr_only make visibility hide on table
        { key: 'created_by.name', label: 'Created By', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'created_on', label: 'Created On', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        // { 
        //   key: 'is_publish', 
        //   label: 'Status', 
        //   _classes:["tools-field"],
        //   _style: 'width:185px',
        //   filter: false,
        //   sorter: false, 
        //   isFields: true 
        // },
        // { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
        // { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
      ],
      titlePublishModal : 'Confirmation Rejected !!',
      labelPublishModal : 'Reject publish event :',
      showRejectedPublishModal:false,
      dataEventModal: {id: "", name:"", domain_id:null},

      event_time:'all',
      event_start:"",
      list_domain : {
        value : [],
        tempValue : "",
        options: [],   
      },        
      search_name:"",
      list_type:'all',
      
      countAll : 0,
      countAllPublished : 0,
      countMyPublished : 0,
      countSharedPublished : 0,
      countAllUnpublished : 0,
      countMyNeedApproval : 0,
      countSharedNeedPublish : 0,
      countMyRejectedPublish : 0,
      countMyAcceptedPublish : 0,
      countSharedWaiting : 0,
      countAllDraft : 0,
      countMyDraft : 0,

      colorAll : {'--colorNormal': '#616161', '--colorHover':'#2b2630', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},
      colorPublished : {'--colorNormal': '#9300b0', '--colorHover':'#6d0082', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},
      colorUnpublished : {'--colorNormal': '#ff9b00', '--colorHover':'#b36d00', '--colorText':'#404040', '--colorTextHover':'#404040'},
      colorNeedApproval : {'--colorNormal': '#0019bd', '--colorHover':'#000f5c', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},
      colorRequestApproval : {'--colorNormal': '#0019bd', '--colorHover':'#000f5c', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},
      colorNeedPublish : {'--colorNormal': '#b5000f', '--colorHover':'#690009', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},
      colorRejectedPublished : {'--colorNormal': '#b4c400', '--colorHover':'#8d9900', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},
      colorDraft : {'--colorNormal': '#614700', '--colorHover':'#a17600', '--colorText':'#ffffff', '--colorTextHover':'#ffffff'},

      fieldFormPublish : {
        publish_message : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null        
        }  
      }      
    }
    
  },
  mounted() {
    this.processGetEventList(null);
    if (this.activeSystemUserDomain.toLowerCase() == 'master' || this.activeOauthClientId == 1) {
      this.processGetListDomain();
    } else {
      this.processGetListDomainShare();
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
    processGetListDomainShare: function () {
   
      var data = {};

      baseCallApiHelper.callApi(
        "Get List Domain",
        {},
        api.event.listdomainsharedevent.method,
        api.event.listdomainsharedevent.url, 
        data, 
        (status, data, message) => {
          if(status) {
            console.log(data.data)
            this.list_domain.options =  data.data;
          }
        }, 
        false, 
        true,
        true
      );

      this.showDomain = true;
      
    },

    processGetEventList: function (action = null) {
      if (action === 'search' || action === 'delete') {
          this.pageDataBase = 1;
      }

      const data = {
        is_form : true,
        // select : globalFunctions.mapFields(this.fields),
        filter : "",
        order_by : "event_start desc", // always include 'created_on desc' for grab the new data from database
        page: this.pageDataBase,
        data_per_page: this.dataPerPage // set 100000 record per request for perfomance
      };

      //---------------------------------------------------------------------------------------------------------

        if (this.event_time === 'all') {
          if(this.event_start != "" && this.event_start != null) {
            if (this.event_start.end != null) {
              
              data.filter = '(event_start BETWEEN "' + this.event_start.start + '" AND "' + this.event_start.end + '")';
            } else {
              data.filter = '(event_start >= "' + this.event_start.start + '")';
            }
          }
        } else if (this.event_time === 'on_going') {
          // 2021-08-19 00:00:00
          data.filter = '(event_start >= "' + moment().format('YYYY-MM-DD HH:mm:ss') + '")';
        } else {
          data.filter = '(event_start < "' + moment().format('YYYY-MM-DD HH:mm:ss') + '")';
        }

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

          data.filter = data.filter + "(name like '%" + this.search_name + "%')";
          
        }

      // Jika yang login adalah unit / divisi / jurusan
      if(this.activeSystemUserDomain != 'master' && this.activeOauthClientId != 1) {
        data.filter = (data.filter != "") ? data.filter + " and " : "";

        switch(this.list_type ) {
          case 'all_published':
            data.filter = data.filter  + " ( ( domain_id = " + this.activeSystemUserDomainId + " and is_publish_domain = 1 ) " +
              " or ( domain_id <> " + this.activeSystemUserDomainId + " and share_domain.is_publish = 1) " + 
            " ) ";
            break;
          case 'all_draft':
            data.filter = data.filter  + " ( is_publish_domain = 0 " +
              " or ( domain_id <> " + this.activeSystemUserDomainId + " and share_domain.is_publish = 0) " + 
            " ) ";
            break;
          case 'my_all':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId + " ) ";
            break;  
          case 'my_published':
            data.filter = data.filter  + " ( ( domain_id = " + this.activeSystemUserDomainId + " ) " + 
              " and ( ( is_publish_domain = 1 and publish_status = 'publish_local' ) " +
                " or ( is_publish = 1 and publish_status = 'publish_global_accepted' ) " + 
              " ) " +
            " ) ";
            break;
          case 'my_draft':
            data.filter = data.filter  + " ( ( domain_id = " + this.activeSystemUserDomainId + " ) " + 
              " and ( publish_status = 'publish_global_draft' or publish_status = 'publish_global_rejected' " + 
                "or ( publish_status = 'publish_local' and is_publish_domain = 0 ) " +
              " ) " + 
            " ) ";
            break;             
          case 'permission_pendingapproval':
          case 'my_pendingapproval':
            data.filter = data.filter  + " ( ( domain_id = " + this.activeSystemUserDomainId + " ) " + 
              " and ( is_publish = 0 and publish_status = 'publish_global' ) " + 
            " ) ";
            break;                        
          case 'shared_approval':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + " and share_domain.is_publish = 1 and is_publish_domain = 1 ) ";
            break;  
          case 'shared_rejection':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + " and (share_domain.is_publish = 0 or share_domain.is_publish is null) and is_publish_domain = 1 ) ";

            break;  
          case 'shared_waitingconfirmation':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + 
              " and ( publish_status = 'publish_global_rejected' or publish_status = 'publish_global_draft' " + 
                " or ( publish_status = 'publish_local' and  is_publish_domain = 0 ) " +
              " ) " +
            " ) ";
            break;   
          case 'permission_approve':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId  + " and  publish_status = 'publish_global_accepted' ) ";
            break;   
          case 'permission_reject':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId  + " and  publish_status = 'publish_global_rejected' ) ";
            break;   
          case 'permission_draft':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId  + " and  publish_status = 'publish_global_draft' ) ";
            break;                        
          default:
            data.filter = data.filter  + " ( true ) ";
        }
      } 
      // Jika yang login adalah domain master / super administrator
      else {
        data.filter = (data.filter != "") ? data.filter + " and " : "";

        switch(this.list_type ) {
          case 'all_published':
            data.filter = data.filter  + " ( is_publish = 1 and  publish_status <> 'publish_local' and  publish_status <> 'publish_local_draft' ) ";
            break;
          case 'all_draft':
            data.filter = data.filter  + " ( is_publish = 0 and  publish_status <> 'publish_local' and  publish_status <> 'publish_local_draft' ) ";

            break;
          case 'my_all':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId + " ) ";
            break;  
          case 'my_published':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId + " and is_publish = 1) ";
            break;
          case 'my_draft':
            data.filter = data.filter  + " ( domain_id = " + this.activeSystemUserDomainId + " and is_publish = 0 ) ";

            break;                                   
          case 'permission_approve':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + " and is_publish = 1 and  publish_status = 'publish_global_accepted') ";
            break;   
          case 'permission_reject':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + " and is_publish = 0 and  publish_status = 'publish_global_rejected') ";
            break; 
          case 'permission_pendingapproval':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + " and is_publish = 0 and  publish_status = 'publish_global') ";
            break;                
          case 'permission_draft':
            data.filter = data.filter  + " ( domain_id <> " + this.activeSystemUserDomainId + " and is_publish = 0 and  publish_status = 'publish_global_draft') ";
            break;                        
          default:
            data.filter = data.filter  + " ( true ) ";
        }
      }

      //---------------------------------------------------------------------------------------------------------

      // Jika yang login adalah domain master
      if (this.activeSystemUserDomain == 'master') {
        data.filter = (data.filter != "") ? data.filter + " and " : "";
        data.filter = data.filter + "(publish_status <> 'publish_local' or domain_id = " + this.activeSystemUserDomainId + ")";
      }

      baseCallApiHelper.callApi(
        "Get event  list",
        null,
        api.event.list.method,
        api.event.list.url, 
        data, 
        (status, data, message) => {
          if(status) {
            // (data.from === 1 || data.from === null) ? this.isNeedPrevious100k = false : this.isNeedPrevious100k = true;
            // (data.to === data.total || data.total === 0) ? this.isNeedNext100k = false : this.isNeedNext100k = true;
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
            
            
            
              this.$refs.Pagination_Top.objectActive = this;
              this.$refs.Pagination_Top.fieldNamePageActive = "pageDataBase";
              this.$refs.Pagination_Top.functionNameRefreshList = "processGetEventList";
              this.$refs.Pagination_Top.togglePagination(this.pageDataBase, data.last_page); 
              this.$refs.Pagination_Bottom.objectActive = this;
              this.$refs.Pagination_Bottom.fieldNamePageActive = "pageDataBase";
              this.$refs.Pagination_Bottom.functionNameRefreshList = "processGetEventList";
              this.$refs.Pagination_Bottom.togglePagination(this.pageDataBase, data.last_page);             
            this.processGetCountEventList();
          } else {
            this.listItems = [];
          }
        }, 
        true, 
        true,
        true
      );
    },
    processGetCountEventList: function (e) {
        const data = {
          filter : ""
        };

        if (this.event_time === 'on_going') {
          // 2021-08-19 00:00:00
          data.filter = '(event_start >= "' + moment().format('YYYY-MM-DD HH:mm:ss') + '")';
        } else if (this.event_time === 'has_passed') {
          data.filter = '(event_start < "' + moment().format('YYYY-MM-DD HH:mm:ss') + '")';
        }

        baseCallApiHelper.callApi(
          "Get event  list",
          null,
          api.event.getcount.method,
          api.event.getcount.url, 
          data, 
          (status, data, message) => {
            if(status) {
              this.countAll = data.countAll;

              this.countAllPublished = data.countAllPublished;
              this.countMyPublished = data.countMyPublished;
              this.countSharedPublished = data.countSharedPublished;

              this.countAllUnpublished = data.countAllUnpublished;
              
              this.countMyNeedApproval = data.countMyNeedApproval;

              this.countSharedNeedPublish = data.countSharedNeedPublish;

              this.countMyRejectedPublish = data.countMyRejectedPublish;
              this.countMyAcceptedPublish = data.countMyAcceptedPublish;

              this.countSharedWaiting = data.countSharedWaiting;

              this.countMyDraft = data.countMyDraft;      
              this.countAllDraft = data.countAllDraft;                                   
            }
          }
        );
    },
    toggleDetails (item, index) {
      this.$set(this.listItems[index], '_toggled', !item._toggled);
      this.collapseDuration = 200;
      this.$nextTick(() => { this.collapseDuration = 0});
    },
    renderPublishMessage: function (publishMessage) {
      var renderMessage = '<div style="font-weight:bold;">LOG PUBLISH : </div>';
      if(publishMessage != '-' && publishMessage != null && publishMessage != '') {
        const obj = JSON.parse(publishMessage);
        obj.forEach(function(message) {
          if (message.message != null && message.message != '') {
            renderMessage = renderMessage + message.name + ' (' + message.datetime + ') => ' +  message.message + '; <br> ';
          }
        });
      }

      return renderMessage;
    },

    prosessApprovalUnpublish: function(item, acceptAction, allowCheckFieldForm = false) {
      this.showRejectedPublishModal = false;

      if (globalFunctions.validationForm(this, 'fieldFormPublish') || allowCheckFieldForm) {
        const data = {
          event_id : item.id,
          is_publish : acceptAction,
          publish_message : this.fieldFormPublish.publish_message.value
        };

        baseCallApiHelper.callApi(
          "Proses approval unpublish event",
          null,
          api.event.approvalunpublish.method,
          api.event.approvalunpublish.url, 
          data, 
          (status, data, message) => {
            this.processGetEventList();
          }, 
          true, 
          true,
          true
        );
      }
    },    
    prosessPublishEvent: function(item) {
      this.showRejectedPublishModal = false;

        const data = {
          event_id : item.id,
          is_publish : (item.is_publish === 1) ? 0 : 1
        };

        baseCallApiHelper.callApi(
          "Proses publish event",
          null,
          api.event.publish.method,
          api.event.publish.url, 
          data, 
          (status, data, message) => {
            this.processGetEventList();
          }, 
          true, 
          true,
          true
        );
    },
    prosessPublishEventDomain: function(item, allowCheckFieldForm = false)  {
      this.showRejectedPublishModal = false;
      if (globalFunctions.validationForm(this, 'fieldFormPublish') || allowCheckFieldForm) {

        const data = {
          event_id : item.id,
          is_publish : (item.is_publish_domain === 1) ? 0 : 1,
          publish_message : this.fieldFormPublish.publish_message.value
        };

        baseCallApiHelper.callApi(
          "Proses publish event origin",
          null,
          api.event.publishdomain.method,
          api.event.publishdomain.url, 
          data, 
          (status, data, message) => {
            this.processGetEventList();
          }, 
          true, 
          true,
          true
        );
      }
    },
    prosessPublishEventShare: function(item) {
        const data = {
          event_id : item.id,
          is_publish : (item['share_domain.is_publish'] === 1) ? 0 : 1
        };

        baseCallApiHelper.callApi(
          "Proses publish event share",
          null,
          api.event.publishshare.method,
          api.event.publishshare.url, 
          data, 
          (status, data, message) => {
            this.processGetEventList();
          }, 
          true, 
          true,
          true
        );
    },

    toggleRejectedPublishModal : function(item, titleModal = 'Confirmation Rejected !!', labelModal = 'Reject publish event :') {
      this.showRejectedPublishModal = !this.showRejectedPublishModal;
      this.titlePublishModal = titleModal;
      this.labelPublishModal = labelModal;
      if (this.showRejectedPublishModal) {
        this.dataEventModal = item;
      } else {
        this.fieldFormPublish.publish_message.value = "";
        this.dataEventModal = {id: "", name:"", domain_id:null};
      }
    },    
    
    processDeleteEvent: function () {
      const data = {
      };      
      if (this.itemDeleteID) {
        baseCallApiHelper.callApi(
          "Delete event ",
          null,
          api.event.delete.method,
          api.event.delete.url + '/' + this.itemDeleteID, 
          data, 
          (status, data, message) => {
            this.itemDeleteID = null;              

            if(status){
              this.processGetEventList('delete');
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
