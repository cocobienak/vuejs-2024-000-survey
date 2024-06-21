<template>
  <div>
    <CCard>
      <CCardBody >
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="$router.push({path: '/author-interview/add'})"
        >
          Add new
        </CButton>
        <hr/>

          <CRow>
            <div class="guard-status-info" style="display:flex;justify-content: flex-start; flex-wrap: wrap;">
              <div class="status-info">
                <a 
                  :class="(is_publish==='all'&&publish_status==='all')?'active-bold-adt':''" 
                  :style="colorAll"
                  @click="is_publish='all';list_type='all';publish_status='all';processGetAuthorInterviewList('search')"
                >
                  All : <span style="font-size:18px;color: #616161;">{{countAll}}</span>
                </a> | &nbsp; 
              </div> 
              <div class="status-info">
                <a
                  :class="(is_publish==='published'&&publish_status==='all')?'active-bold-adt':''"  
                  :style="colorPublished"
                  @click="is_publish='published';list_type='all';publish_status='all';processGetAuthorInterviewList('search')"
                >
                  Published : <span style="font-size:18px;color: #616161;">{{countPublished}}</span>
                </a> | &nbsp; 
              </div>   
              <div class="status-info">
                <a
                  :class="(is_publish==='unpublished'&&publish_status==='all')?'active-bold-adt':''"                 
                  :style="colorUnpublished"
                  @click="is_publish='unpublished';list_type='all';publish_status='all';processGetAuthorInterviewList('search')"
                >
                  Un-Published : <span style="font-size:18px;color: #616161;">{{countUnpublished}}</span>
                </a> | &nbsp;               
              </div>    
              <div class="status-info">
                <a 
                  :class="(is_publish==='unpublished_canpublish'&&publish_status==='all')?'active-bold-adt':''"  
                  :style="colorNeedPublish"
                  @click="is_publish='unpublished_canpublish';list_type='all';publish_status='all';processGetAuthorInterviewList('search')"
                >
                  Need publish : <span style="font-size:18px;color: #ff4141;">{{countNeedPublish}}</span>
                </a> | &nbsp;               
              </div>
              <div class="status-info" v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1">
                <a
                  :class="(is_publish==='all'&&publish_status==='publish_global')?'active-bold-adt':''"
                  :style="colorNeedApproval"
                  @click="is_publish='all';list_type='all';publish_status='publish_global';processGetAuthorInterviewList('search')"
                >
                  Need approval : <span style="font-size:18px;color: #ff4141;">{{countNeedApproval}}</span>
                </a> | &nbsp;               
              </div>
              <div class="status-info" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
                <a
                  :class="(is_publish==='requestapproval'&&publish_status==='all')?'active-bold-adt':''"
                  :style="colorRequestApproval"
                  @click="is_publish='requestapproval';list_type='all';publish_status='all';processGetAuthorInterviewList('search')"
                >
                  Need approval : <span style="font-size:18px;color: #ff4141;">{{countRequestApproval}}</span>
                </a> | &nbsp;               
              </div>  
              <div class="status-info" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
                <a
                  :class="(is_publish==='all'&&publish_status==='publish_global')?'active-bold-adt':''"
                  :style="colorNeedApproval"
                  @click="is_publish='all';list_type='all';publish_status='publish_global';processGetAuthorInterviewList('search')"
                >
                  My process approval : <span style="font-size:18px;color: #ff4141;">{{countNeedApproval}}</span>
                </a> | &nbsp;               
              </div>
                                    
              <div class="status-info">
                <a
                  :class="(is_publish==='all'&&publish_status==='publish_global_rejected')?'active-bold-adt':''"
                  :style="colorRejectedPublished"
                  @click="is_publish='all';list_type='all';publish_status='publish_global_rejected';processGetAuthorInterviewList('search')"
                >
                  My rejected Published : <span style="font-size:18px;color: #ff4141;">{{countRejectedPublish}}</span>
                </a> | &nbsp;              
              </div>
              <div class="status-info">
                <a
                  :class="(is_publish==='all'&&publish_status==='publish_global_draft')?'active-bold-adt':''"
                  :style="colorDraft"
                  @click="is_publish='all';list_type='all';publish_status='publish_global_draft';processGetAuthorInterviewList('search')"
                >
                  Draft : <span style="font-size:18px;color: #616161;">{{countDraft}}</span>
                </a>           
              </div>              
            </div>     
          </CRow>           
          <CRow>            
            <CCol md="2" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
              <CSelect
                name="list_type"
                :value.sync="list_type"       
                :options="[{ value: 'all', label: 'All Domain' }, { value: 'my_domain', label: 'My Domain' },
                            { value: 'from_share', label: 'From Share' }]"                   
              />
            </CCol>
            <CCol sm="4" v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1">
              <div>
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
            <CCol md="2">
              <CInput
                name="name"
                v-model="search_name"
                placeholder="Tittle Author Interview ..."               
              />
            </CCol> 
            <CCol md="2" v-if="activeSystemUserDomain == 'master'">
              <CSelect
                name="is_publish"
                :value.sync="is_publish"              
                :options="[{ value: 'all', label: 'All publish or not' }, { value: 'published', label: 'Published' },
                            { value: 'unpublished', label: 'Unpublished' }, { value: 'unpublished_canpublish', label: 'Unpublished - can publish' }]"                
              />
            </CCol>            
            <CCol md="2" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
              <CSelect
                name="is_publish"
                :value.sync="is_publish"              
                :options="[{ value: 'all', label: 'All publish or not' }, { value: 'published', label: 'Published' },
                            { value: 'unpublished', label: 'Unpublished' }, { value: 'requestapproval', label: 'Need Approval' },
                            { value: 'unpublished_canpublish', label: 'Unpublished - can publish' },
                            { value: 'unpublished_cannotpublish', label: 'Unpublished - can not publish' }]"                
              />
              <label v-if="activeOauthClientId == 1">Only Web Master</label>
            </CCol>                       
            <CCol md="2" v-if="activeSystemUserDomain == 'master'">
              <CSelect
                name="publish_status"
                :value.sync="publish_status"           
                :options="[{ value: 'all', label: 'All Status' }, { value: 'publish_global_draft', label: 'Draft status' }, 
                            { value: 'publish_global', label: 'Need Approval' }, { value: 'publish_global_accepted', label: 'Status Accepted Publish' },
                            { value: 'publish_global_rejected', label: 'Status Rejected Publish' }]"
              />
            </CCol>             
            <CCol md="2" v-if="activeSystemUserDomain != 'master' && activeOauthClientId != 1">
              <CSelect
                name="publish_status"
                :value.sync="publish_status"           
                :options="[{ value: 'all', label: 'All Status' }, { value: 'publish_local', label: 'Only On Your Website' }, { value: 'publish_global_draft', label: 'Draft status' }, 
                            { value: 'publish_global', label: 'Process Approval' }, { value: 'publish_global_accepted', label: 'Status Accepted Publish' },
                            { value: 'publish_global_rejected', label: 'Status Rejected Publish' }]"
              />
            </CCol>            
            <CCol md="2">
              <CButton
                color="success"
                square
                size="sm"
                @click="processGetAuthorInterviewList('search')"
              >
                filter
              </CButton>
            </CCol>                                               
          </CRow>
     
        <hr/>     
        <CRow>
            <CCol sm="10">
              <Pagination ref="Pagination_Top" />        
   
            </CCol>

            <CCol sm="2">
              Per : 
              <CSelect style="display: inline-block !important;width: 70% !important;"
                name="dataPerPage"
                :value.sync="dataPerPage"
                @input="pageDataBase=1;globalFunctions.changeDataPerPage($event,vm,'processGetAuthorInterviewList','dataPerPage')"                
                :options="[20,50,100,500]"
              />     
            </CCol>
            
        </CRow>
    
          
          <!-- 
          :tableFilter='{ label:"Search"}'
          items-per-page-select 
          :items-per-page="20"
          pagination
          -->
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
                <div class="mfield-tools-detail border-right">
                  <div v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1" style="padding-bottom:5px"> 
                    <!-- <div v-if="item.is_publish_force==1">
                      <label class="text-info">Auto publish on Web Master</label>                
                    </div> -->
                    <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                      <label class="text-info label-adt" :style="colorNeedApproval">Request Publish</label><br>
                      <CButton style="margin-right:5px;"
                        class="button-adt" 
                        :style="colorNeedApproval"
                        square
                        size="sm"
                        @click="prosessApprovalUnpublish(item, 1, true)"
                      >
                        Accepted
                      </CButton>
                      <CButton 
                        color="warning"
                        square
                        size="sm"
                        @click="toggleRejectedPublishModal(item)"
                      >
                        Reject
                      </CButton>
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_rejected' && item['domain_id.code']!='master'">
                        <label class="text-info label-adt" :style="colorRejectedPublished">Rejected publish</label>            
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_draft' && item['domain_id.code']!='master'">
                        <label class="text-info label-adt" :style="colorDraft">Draft</label>            
                    </div>                                                 
                    <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']!='master'">
                      <CButton 
                        class="button-adt" 
                        :style="colorUnpublished"
                        square
                        size="sm"
                        @click="toggleRejectedPublishModal(item, 'Confirmation Un-Publish !!', 'Un-Publish author interview :')"
                      >
                        <span v-if="activeOauthClientId == 1">Un-Publish From WEB Author Interview</span>
                        <span v-else>Un-Publish</span> 
                      </CButton>             
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==1">
                      <CButton 
                        class="button-adt" 
                        :style="colorUnpublished"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterview(item)"
                      >
                        <span v-if="activeOauthClientId == 1">Un-Publish From WEB Author Interview</span>
                        <span v-else>Un-Publish</span>                      
                         
                      </CButton>             
                    </div>
                    <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==0">
                      <CButton 
                        class="button-adt" 
                        :style="colorNeedPublish"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterview(item)"
                      >
                        <span v-if="activeOauthClientId == 1">Publish From WEB Author Interview</span>
                        <span v-else>Publish</span>  
                      </CButton>             
                    </div>                              
                  </div>
                  <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) == parseInt(activeSystemUserDomainId)) || activeOauthClientId == 1" style="padding-bottom:5px"> 
                    <!-- <div v-if="item.is_publish_domain_force==1">
                      <label class="text-info">Auto publish on Web Origin</label>                
                    </div> --> 
                    <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                      <label class="text-info label-adt" :style="colorNeedApproval">Prosess approval show on, but has publish on your site</label>
                      <br>
                      <CButton 
                        class="button-adt" 
                        :style="colorUnpublished"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterviewDomainCancel(item)"
                      >
                        Cancel Publish 
                      </CButton>                         
                    </div> 
                    <div v-else-if="(item.publish_status=='publish_global_accepted' || (item.publish_status=='publish_local' && item.is_publish_domain==1)) && item['domain_id.code']!='master'">
                      <CButton 
                        class="button-adt" 
                        :style="colorUnpublished"
                        square
                        size="sm"
                        @click="toggleRejectedPublishModal(item, 'Confirmation Un-Publish !!', 'Un-Publish author interview :')"
                      >
                        <span v-if="activeOauthClientId == 1">Un-Publish From Origin</span>
                        <span v-else>Un-Publish</span>

                      </CButton>             
                    </div>
                    <div v-else-if="(item.publish_status=='publish_global_accepted' || (item.publish_status=='publish_local' && item.is_publish_domain==0)) && item['domain_id.code']!='master'">
                      <CButton 
                        class="button-adt" 
                        :style="colorNeedPublish"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterviewDomain(item, true)"
                      >
                        <span v-if="activeOauthClientId == 1">Publish From Origin</span>
                        <span v-else>Publish</span>
                         
                      </CButton>             
                    </div>                
                    <div v-else-if="(item.publish_status=='publish_global_rejected' || item.publish_status=='publish_global_draft') && item['domain_id.code']!='master'">
                      <label class="text-info label-adt" :style="colorDraft" v-if="item.publish_status=='publish_global_draft'">Draft</label>
                      <label class="text-info label-adt" :style="colorRejectedPublished" v-else-if="item.publish_status=='publish_global_rejected'">Rejected show on WEB, but publish on your site</label>
                      <br>
                      <CButton  style="margin-right:5px;"
                        class="button-adt" 
                        :style="colorNeedApproval"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterviewDomainApproval(item)"
                      >
                        Request Approval 
                      </CButton>
                      <CButton v-if="item.publish_status!='publish_global_draft'"
                        class="button-adt" 
                        :style="colorUnpublished"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterviewDomainCancel(item)"
                      >
                        Cancel Publish 
                      </CButton>                                 
                    </div>

                  </div>
                  <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) != parseInt(activeSystemUserDomainId) && activeOauthClientId != 1)" style="padding-bottom:5px"> 
                    <!-- <div v-if="item['share_domain.is_publish_force']==1">
                      <label class="text-info">Auto publish from share</label>                
                    </div> -->
                    <div v-if="item.is_publish_domain_origin==0">
                      <label class="text-info label-adt" :style="colorUnpublished">Cannot publish, because on origin is not publish</label>                
                    </div>                    
                    <!-- <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_local' || item.publish_status=='publish_global_accepted')">
                      <label class="text-info label-adt" :style="colorUnpublished">Cannot publish, because on origin is not publish</label>                
                    </div>             
                    <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_global' || item.publish_status=='publish_global_rejected')">
                      <label class="text-info label-adt" :style="colorNeedApproval">Status Un-Publish, prosses approval from origin</label>                
                    </div>                    -->
                    <div v-else-if="item['share_domain.is_publish']==0 && item.is_publish_domain_origin==1">
                      <CButton
                        class="button-adt" 
                        :style="colorNeedPublish"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterviewShare(item)"
                      >
                        Publish from share
                      </CButton>                  
                    </div>
                    <div v-else-if="item['share_domain.is_publish']==1 && item.is_publish_domain_origin==1">
                      <CButton
                        class="button-adt" 
                        :style="colorUnpublished"
                        square
                        size="sm"
                        @click="prosessPublishAuthorInterviewShare(item)"
                      >
                        Un-Publish from share
                      </CButton>                  
                    </div> 
                  </div>                  
                </div>
                <div class="mfield-tools-detail border-right">
                  <div>
                    <CButton 
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="$router.push({ path: `/author-interview/edit/${item.id}` })"
                    >
                      Edit
                    </CButton>                
                  </div>                  
                </div>
                <div class="mfield-tools-detail">
                  <CButton
                    color="danger"
                    variant="outline"
                    square
                    size="sm"
                    @click="globalFunctions.toggleDeleteModal(vm, item, true, item.name)"
                  >
                    Delete
                  </CButton>                  
                </div>
              </div>

            </td>
          </template>
          <template #is_publish="{item}">
            <td class="tools-field">
              <div v-if="activeSystemUserDomain == 'master' || activeOauthClientId == 1" style="padding-bottom:5px"> 
                <!-- <div v-if="item.is_publish_force==1">
                  <label class="text-info">Auto publish on Web Master</label>                
                </div> -->
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
                      <span v-if="activeOauthClientId == 1">Published On WEB Author Interview</span>
                      <span v-else>Published</span>                   
                  </label>                       
                </div>
                <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==1">
                  <label class="text-info label-adt" :style="colorPublished">                        
                      <span v-if="activeOauthClientId == 1">Published On WEB Author Interview</span>
                      <span v-else>Published</span> 
                  </label>                                 
                </div>
                <div v-else-if="item.publish_status=='publish_global_accepted' && item['domain_id.code']=='master' && item.is_publish==0">
                  <label class="text-info label-adt" :style="colorUnpublished">
                        <span v-if="activeOauthClientId == 1">Un-Published On WEB Author Interview</span>
                        <span v-else>Un-Published</span> 
                  </label>                                  
                </div>                              
              </div>
              <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) == parseInt(activeSystemUserDomainId)) || activeOauthClientId == 1" style="padding-bottom:5px"> 
                <!-- <div v-if="item.is_publish_domain_force==1">
                  <label class="text-info">Auto publish on Web Origin</label>                
                </div> --> 
                <div v-if="item.publish_status=='publish_global' && item['domain_id.code']!='master'">
                    <label class="text-info label-adt" :style="colorNeedApproval">Prosess approval show on WEB, but has publish on your site </label>
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
                  <label class="text-info label-adt" :style="colorRejectedPublished" v-else-if="item.publish_status=='publish_global_rejected'">Rejected show on WEB, but publish on your site</label>             
                </div>

              </div>
              <div v-if="(activeSystemUserDomain != 'master' && parseInt(item.domain_id) != parseInt(activeSystemUserDomainId) && activeOauthClientId != 1)" style="padding-bottom:5px"> 
                <!-- <div v-if="item['share_domain.is_publish_force']==1">
                  <label class="text-info">Auto publish from share</label>                
                </div> -->
                <div v-if="item.is_publish_domain_origin==0">
                  <label class="text-info label-adt" :style="colorUnpublished">Cannot publish, because on origin is not publish</label>                
                </div>                  
                <!-- <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_local' || item.publish_status=='publish_global_accepted')">
                  <label class="text-info label-adt" :style="colorUnpublished">Cannot publish, because on origin is not publish</label>                
                </div>             
                <div v-if="item.is_publish_domain_origin==0 && (item.publish_status=='publish_global' || item.publish_status=='publish_global_rejected')">
                  <label class="text-info label-adt" :style="colorNeedApproval">Status Un-Publish, prosses approval from origin</label>                
                </div>                    -->
                <div v-else-if="item['share_domain.is_publish']==0 && item.is_publish_domain_origin==1">
                  <label class="text-info label-adt" :style="colorUnpublished">Un-Publish</label>                   
                </div>
                <div v-else-if="item['share_domain.is_publish']==1 && item.is_publish_domain_origin==1">
                  <label class="text-info label-adt" :style="colorPublished">Published</label>                 
                </div> 
              </div>  
            </td>
          
          </template>
          <!-- <template #created_on="{item}">
            <td>
              {{ item.created_on = moment(item.created_on).format('ll') }}
            </td>
          </template>                     -->         
          <template #details="{item}">
            <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
              <CCardBody style="background:#dadada !important;"> 
                <CRow class="sub-field-responsive">
                  <CCol md="2">
                    <div>Author : {{item['stories_author_id.name']}}</div>
                  </CCol>                              
                </CRow>  
                <CRow>
                  <CCol md="12">
                    <hr/>
                  </CCol> 
                </CRow>                                
                <div v-html="renderPublishMessage(item.publish_message)" ></div>
                <CRow>
                  <CCol md="12">
                    <hr/>
                  </CCol> 
                </CRow>
                <div>Author Interview : </div>
                <div v-html="item.author_interview_html"></div>            
              </CCardBody>
            </CCollapse>
          </template>          
        </CDataTable>

        <CRow>
            <CCol sm="10">
              <Pagination ref="Pagination_Bottom" />        
            </CCol>   

            <CCol sm="2">
              Per : 
              <CSelect style="display: inline-block !important;width: 70% !important;"
                name="dataPerPage"
                :value.sync="dataPerPage"
                @input="pageDataBase=1;globalFunctions.changeDataPerPage($event,vm,'processGetAuthorInterviewList','dataPerPage')"                
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
            @click="processDeleteAuthorInterview()"
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
      <label>{{dataAuthorInterviewModal.id}} : {{dataAuthorInterviewModal.name}}</label>
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
            @click="prosessApprovalUnpublish(dataAuthorInterviewModal, 0)"
          >
            Submit
          </CButton>
          <CButton v-if="(activeSystemUserDomain != 'master' && parseInt(dataAuthorInterviewModal.domain_id) == parseInt(activeSystemUserDomainId))"
            class="button-adt" 
            :style="colorUnpublished"
            square
            size="sm"
            @click="prosessPublishAuthorInterviewDomain(dataAuthorInterviewModal)"
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

  header {
    background:#f3f3f3 !important;
    .c-subheader{
      background:#f3f3f3 !important;
    }
  }
  // .card-body{
  //   background:#f3f3f3;
  // }

  .modal-title{
    color: #525252;
  }

  thead {
    display: none !important;    
    @media (min-width: 840px) {
      display: table-header-group !important;
    }
  }

  .tools-field {
      display: block !important;

    @media (min-width: 840px) {
      display: table-cell !important;
    }
  }

  .main-field {
    .main-field-tools {
      display: none;
    }

    @media (max-width: 840px) {
      width: 65% !important;
    }
  }

  .border-right {
    border-right: 1px solid #5a4d4d !important;
  }

  tr:hover  {
    .main-field-tools {
      display: flex;
      
      .mfield-tools-detail {
        padding: 10px;
      }
    }
  }

  .main-field:hover{
    .main-field-tools {
      display: flex;
      
      .mfield-tools-detail {
        padding: 10px;
      }
    }
  }

  .sub-field {
    display: none !important;
    @media (min-width: 840px) {
      display: table-cell !important;
    }    
  }

  .sub-field-responsive{
    @media (min-width: 840px) {
      display: none !important;
    }     
  }

  .guard-status-info{
    margin-left: 20px;
    margin-bottom: 20px;
    .status-info{
      margin-right:5px;
      a {
        cursor: pointer;
        color: var(--colorNormal);
      }

      a:hover {
        color: var(--colorHover);
      }
    }
  }

  .active-bold-adt {
    font-weight: bolder !important;
    text-decoration: underline !important;
  }

  .label-adt {
    color: var(--colorNormal) !important;
  }  

  .button-adt {
    cursor: pointer;
    color: var(--colorText) !important;
    background: var(--colorNormal) !important;
  }
  .button-adt:hover {
    cursor: pointer;
    color: var(--colorTextHover) !important;
    background: var(--colorHover) !important;
  }

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


export default {
  name: 'AuthorInterviewList',
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
        { key: 'id', label: 'ID', _classes:["sub-field"], _style:'width:20px', filter: false, isFields: true },
        { key: 'domain_id.code', label: 'Domain', _classes:["sub-field"], _style:'min-width:100px', filter: false, isFields: true },
 
        { key: 'name', label: 'Title', _classes:["main-field"], _style:'min-width:250px', filter: false, isFields: true },
        { key: 'stories_author_id.name', label: 'Author', _classes:["sub-field"], _style:'min-width:150px', filter: false, isFields: false },

        { key: 'modified_by.name', label: 'Modified By', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        // Classes d-none & sr_only make visibility hide on table
        { key: 'created_by.name', label: 'Created By', _classes:["d-none", "sr_only"], filter: false, isFields: true},
        { key: 'created_on', label: 'Created On', _classes:["d-none", "sr_only"], filter: false, isFields: true },
        { 
          key: 'is_publish', 
          label: 'Status', 
          _classes:["tools-field"],
          _style: 'width:185px',
          filter: false,
          sorter: false, 
          isFields: true 
        },
        // { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
        // { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
      ],
      titlePublishModal : 'Confirmation Rejected !!',
      labelPublishModal : 'Reject publish author interview :',
      showRejectedPublishModal:false,
      dataAuthorInterviewModal: {id: "", name:"", domain_id:null},
      search_name:"",
      author_interview_start:"",
      list_type:'all',
      list_domain : {
        value : [],
        tempValue : "",
        options: [],   
      },       
      is_publish:'all',
      publish_status:'all',
      countAll : 0,
      countPublished : 0,
      countUnpublished : 0,
      countNeedApproval : 0,
      countRequestApproval : 0,
      countNeedPublish : 0,
      countRejectedPublish : 0,
      countDraft : 0,
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
    this.processGetAuthorInterviewList(null);
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
    processGetAuthorInterviewList: function (action = null) {
      if (action === 'search' || action === 'delete') {
          this.pageDataBase = 1;
      }

        const data = {
          is_form : true,
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

        data.filter = data.filter + "(name like '%" + this.search_name + "%')";
        
      }

// { value: 'all', label: 'All' }, { value: 'my_domain', label: 'My Domain' },
// { value: 'from_share', label: 'From Share' }

      if(this.list_type != "all"
        && this.activeSystemUserDomain != 'master' && this.activeOauthClientId != 1) {
        data.filter = (data.filter != "") ? data.filter + " and " : "";
        if (this.list_type == 'my_domain') {
          data.filter = data.filter + '(domain_id = ' + this.activeSystemUserDomainId + ')';
        } else {
          data.filter = data.filter + '(domain_id <> ' + this.activeSystemUserDomainId + ')';
        }
      }

// "[{ value: 'all', label: 'All' }, { value: 'published', label: 'Published' },
// { value: 'unpublished', label: 'Unpublished' }, { value: 'unpublished_canpublish', label: 'Unpublished - can publish' },
// { value: 'unpublished_cannotpublish', label: 'Unpublished - can not publish' }]"  
      if(this.is_publish != "all") {
        data.filter = (data.filter != "") ? data.filter + " and " : "";
        if (this.is_publish == 'published') {
          if (this.activeSystemUserDomain == 'master' || this.activeOauthClientId == 1) {
            data.filter = data.filter + '(is_publish = 1)';
          } else {
            data.filter = data.filter + '((is_publish_domain = 1) ' + 
                                      'or (domain_id <> ' + this.activeSystemUserDomainId + ' and (share_domain.is_publish = 1)))';
          }
        } else if (this.is_publish == 'unpublished') {
          if (this.activeSystemUserDomain == 'master' || this.activeOauthClientId == 1) {
            data.filter = data.filter + '(is_publish = 0)';
          } else {
            data.filter = data.filter + '((is_publish_domain = 0 and domain_id = ' + this.activeSystemUserDomainId + ') ' + 
                                          'or ( domain_id <> ' + this.activeSystemUserDomainId + ' and (share_domain.is_publish = 0 or share_domain.is_publish is null)' + 
                                            '))';
          }
        } else if (this.is_publish == 'requestapproval') {
          if (this.activeSystemUserDomain == 'master' || this.activeOauthClientId == 1) {
          } else {
            data.filter = data.filter + '((is_publish_domain = 0 and domain_id = ' + this.activeSystemUserDomainId + 
                                          ' and (publish_status = "publish_global_draft" or publish_status = "publish_global_rejected")) ' + 
                                        ')';
          }          
          
        } else if (this.is_publish == 'unpublished_canpublish') {
          if (this.activeSystemUserDomain == 'master' || this.activeOauthClientId == 1) {
            data.filter = data.filter + '((is_publish = 0 and domain_id.code = "master"))';
          } else {
            data.filter = data.filter + '((is_publish_domain = 0 and domain_id = ' + this.activeSystemUserDomainId + ' and publish_status = "publish_local") ' + 
                                          'or ( domain_id <> ' + this.activeSystemUserDomainId + ' and (share_domain.is_publish = 0 or share_domain.is_publish is null)' + 
                                            ' and is_publish_domain = 1)' +
                                        ')';
          }          
          
        } else if (this.is_publish == 'unpublished_cannotpublish') {
          if (this.activeSystemUserDomain == 'master' || this.activeOauthClientId == 1) {
            data.filter = data.filter + '(is_publish = 1  domain_id.code = "master")';
          } else {
            data.filter = data.filter + '(( domain_id <> ' + this.activeSystemUserDomainId + ' and (share_domain.is_publish = 0 or share_domain.is_publish is null)' + 
                                            ' and is_publish_domain = 0)' +
                                        ')';
          }           
        }        
      }

// [{ value: 'all', label: 'All approval' }, { value: 'publish_global_draft', label: 'Draft status' },
//   { value: 'publish_global', label: 'Process Approval' }, { value: 'publish_global_accepted', label: 'Status Accepted Unpublish' },
//   { value: 'publish_global_rejected', label: 'Status Rejected Unpublish' }]

      if(this.publish_status != "all") {
        data.filter = (data.filter != "") ? data.filter + " and " : "";
        data.filter = data.filter + "(publish_status = '" + this.publish_status + "')";
        if (this.publish_status == 'publish_global_accepted') {
          data.filter = data.filter + "and (is_publish = 1)";
        }
      }

      if (this.activeSystemUserDomain == 'master') {

        data.filter = (data.filter != "") ? data.filter + " and " : "";
        data.filter = data.filter + "(publish_status <> 'publish_local' or domain_id = " + this.activeSystemUserDomainId + ")";
      }

      baseCallApiHelper.callApi(
          "Get author interview  list",
          null,
          api.author_interview.list.method,
          api.author_interview.list.url, 
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
              this.$refs.Pagination_Top.functionNameRefreshList = "processGetAuthorInterviewList";
              this.$refs.Pagination_Top.togglePagination(this.pageDataBase, data.last_page); 
              this.$refs.Pagination_Bottom.objectActive = this;
              this.$refs.Pagination_Bottom.fieldNamePageActive = "pageDataBase";
              this.$refs.Pagination_Bottom.functionNameRefreshList = "processGetAuthorInterviewList";
              this.$refs.Pagination_Bottom.togglePagination(this.pageDataBase, data.last_page); 
              this.processGetCountAuthorInterviewList();

            } else {
              this.listItems = [];
            }
          }, 
          true, 
          true,
          true
        );
    },
    processGetCountAuthorInterviewList: function (e) {
        const data = {};

        baseCallApiHelper.callApi(
          "Get author interview  list",
          null,
          api.author_interview.getcount.method,
          api.author_interview.getcount.url, 
          data, 
          (status, data, message) => {
            if(status) {

              this.countAll = data.countAll;
              this.countPublished = data.countPublished;
              this.countUnpublished = data.countUnpublished;
              this.countNeedApproval = data.countNeedApproval;
              this.countRequestApproval = data.countRequestApproval;
              this.countNeedPublish = data.countNeedPublish;
              this.countRejectedPublish = data.countRejectedPublish;
              this.countDraft = data.countDraft;      
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
      var renderMessage = "LOG PUBLISH : ";
      if(publishMessage != '-' && publishMessage != null && publishMessage != '') {
        const obj = JSON.parse(publishMessage);
        obj.forEach(function(message) {
          if (message.message != null && message.message != '') {
            renderMessage = renderMessage + message.name + ' (' + message.datetime + ') => ' +  message.message + '; ';
          }
        });
      }

      return renderMessage;
    },

    prosessApprovalUnpublish: function(item, acceptAction, allowCheckFieldForm = false) {
      this.showRejectedPublishModal = false;

      if (globalFunctions.validationForm(this, 'fieldFormPublish') || allowCheckFieldForm) {
        const data = {
          author_interview_id : item.id,
          is_publish : acceptAction,
          publish_message : this.fieldFormPublish.publish_message.value
        };

        baseCallApiHelper.callApi(
          "Proses approval unpublish author interview",
          null,
          api.author_interview.approvalunpublish.method,
          api.author_interview.approvalunpublish.url, 
          data, 
          (status, data, message) => {
            this.processGetAuthorInterviewList();
          }, 
          true, 
          true,
          true
        );
      }
    },    
    prosessPublishAuthorInterview: function(item) {
      this.showRejectedPublishModal = false;

        const data = {
          author_interview_id : item.id,
          is_publish : (item.is_publish === 1) ? 0 : 1
        };

        baseCallApiHelper.callApi(
          "Proses publish author interview",
          null,
          api.author_interview.publish.method,
          api.author_interview.publish.url, 
          data, 
          (status, data, message) => {
            this.processGetAuthorInterviewList();
          }, 
          true, 
          true,
          true
        );
    },
    prosessPublishAuthorInterviewDomain: function(item, allowCheckFieldForm = false)  {
      this.showRejectedPublishModal = false;
      if (globalFunctions.validationForm(this, 'fieldFormPublish') || allowCheckFieldForm) {

        const data = {
          author_interview_id : item.id,
          is_publish : (item.is_publish_domain === 1) ? 0 : 1,
          publish_message : this.fieldFormPublish.publish_message.value
        };

        baseCallApiHelper.callApi(
          "Proses publish author interview origin",
          null,
          api.author_interview.publishdomain.method,
          api.author_interview.publishdomain.url, 
          data, 
          (status, data, message) => {
            this.processGetAuthorInterviewList();
          }, 
          true, 
          true,
          true
        );
      }
    },
    prosessPublishAuthorInterviewDomainApproval: function(item)  {

        const data = {
          author_interview_id : item.id,
          is_publish : 1,
          publish_message : this.fieldFormPublish.publish_message.value
        };

        baseCallApiHelper.callApi(
          "Proses publish author interview origin",
          null,
          api.author_interview.publishdomain.method,
          api.author_interview.publishdomain.url, 
          data, 
          (status, data, message) => {
            this.processGetAuthorInterviewList();
          }, 
          true, 
          true,
          true
        );
      
    },    
    prosessPublishAuthorInterviewDomainCancel: function(item)  {
        const data = {
          author_interview_id : item.id,
          is_publish : 0,
          publish_message : 'Cancel Publish.'
        };

        baseCallApiHelper.callApi(
          "Proses publish author interview origin",
          null,
          api.author_interview.publishdomain.method,
          api.author_interview.publishdomain.url, 
          data, 
          (status, data, message) => {
            this.processGetAuthorInterviewList();
          }, 
          true, 
          true,
          true
        );
      
    },    
    prosessPublishAuthorInterviewShare: function(item) {
        const data = {
          author_interview_id : item.id,
          is_publish : (item['share_domain.is_publish'] === 1) ? 0 : 1
        };

        baseCallApiHelper.callApi(
          "Proses publish author interview share",
          null,
          api.author_interview.publishshare.method,
          api.author_interview.publishshare.url, 
          data, 
          (status, data, message) => {
            this.processGetAuthorInterviewList();
          }, 
          true, 
          true,
          true
        );
    },

    toggleRejectedPublishModal : function(item, titleModal = 'Confirmation Rejected !!', labelModal = 'Reject publish author interview :') {
      this.showRejectedPublishModal = !this.showRejectedPublishModal;
      this.titlePublishModal = titleModal;
      this.labelPublishModal = labelModal;
      if (this.showRejectedPublishModal) {
        this.dataAuthorInterviewModal = item;
      } else {
        this.fieldFormPublish.publish_message.value = "";
        this.dataAuthorInterviewModal = {id: "", name:"", domain_id:null};
      }
    },    
    
    processDeleteAuthorInterview: function () {
      const data = {
      };      
      if (this.itemDeleteID) {
        baseCallApiHelper.callApi(
          "Delete author interview ",
          null,
          api.author_interview.delete.method,
          api.author_interview.delete.url + '/' + this.itemDeleteID, 
          data, 
          (status, data, message) => {
            this.itemDeleteID = null;              

            if(status){
              this.processGetAuthorInterviewList('delete');
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
