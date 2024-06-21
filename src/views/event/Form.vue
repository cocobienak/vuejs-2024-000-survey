<template>
  <div class="page-form">
    <CCard>
      <CCardBody>

        <!-- Section Main Form -->
        <hr/>
        <div class="pos-button-guard guard-toggle-show-form" @click="showMainForm = !showMainForm">
          <div class="pos-button-right ">
            <span class="toggle-show-form"> Event Information</span>
            <span class="menu-icon"><i class="md" :class="(showMainForm)?'up-arrow':'down-arrow'"></i></span>
          </div>
        </div>
        <CForm
          @submit.prevent="processFormEvent" v-if="showMainForm"
        >
          <br>
          <!-- Info Created By -->
          <div v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" style="float:left">
                <div class="text-info-form-gray" >Created by : {{createdBy}} , {{ moment(createdOn).format('LLL') }}</div>
                <div class="text-info-form-gray" >Modified by : {{modifiedBy}} , {{ moment(modifiedOn).format('LLL') }}</div>
          </div>

          <!-- Button Save -->
          <div class="pos-button-right">
            <button type="submit" class="button-save-form">SAVE EVENT</button> 
          </div>
          <br>
          
          <!-- Button Add New -->
          <!-- <div style="float:right" v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                @click="globalFunctions.reloadAddNew($router, 'event/add')"
              >
              Add new
            </CButton>
          </div> -->
 
                                 
          <!-- Jika Super Administrator yang login -->
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
                placeholder="Name Event ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'name')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'name')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'name')"                
                label="Event Name"
              />
              <!-- <div class="box-permission">
                <div v-if="activeSystemUserDomain != 'master'">
                  <div class="box-permission-title">Publish on WEB Event</div>
                  <div class="box-permission-info">
                    If you choose to publish on web you will need 
                    to get approval from WEB Event admin.
                    Upon approval, this event will appear on your website too.
                  </div>
                  <div>
                    <label class="c-switch form-check-label c-switch-success">
                      <input type="checkbox" class="c-switch-input form-check-input"                           
                        v-model="fieldForm.publish_status_form.value">
                        -- @change="processChecklistUseDegree()" --
                      <span class="c-switch-slider"></span>
                    </label> 
                    <span class="info-checkbox" v-if="fieldForm.publish_status_form.value == 1">Yes</span>
                    <span class="info-checkbox" v-else>No</span>

                  </div>
                </div>
                <div v-if="activeSystemUserDomain == 'master'">
                  <div class="box-permission-info">
                    This event need approval from you as WEB Event admin. 
                    Please review before giving approval.
                  </div>
                </div>

              </div> -->

              <!-- <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.publish_status_form.isValid === null) ? false : !fieldForm.publish_status_form.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'publish_status_form')}}
              </label> -->

            </CCol>
            <CCol sm="6" v-if="showFieldFormValidation">
              <div v-for="(fieldFormValidation, index) in  fieldForm" :key="index">
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353; padding-left:20px" 
                    v-show="(fieldFormValidation.isValid === null || fieldFormValidation.isValid) ? false : true" >
                    {{index + " " + globalFunctions.getInvalidFeedback(vm, 'fieldForm', index)}}
                </label>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <div>
                <label>Select Speaker</label>
                <multiselect 
                  v-model="fieldForm.speaker.value" 
                  :options="fieldForm.speaker.options" 
                  :custom-label="optionsSpeaker" 
                  :allow-empty="true"
                  :multiple="true"
                  placeholder="Select Speaker"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'speaker'); "                 
                  label="name" track-by="name">
                </multiselect>
                <!-- processChecklistUseDegree(); -->
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.speaker.isValid === null) ? false : !fieldForm.speaker.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'speaker')}}
                  </label>
              </div> 
            </CCol>
          </CRow>
          <CRow>
            <CCol sm="12">            
              <!-- <div>
                <label class="c-switch form-check-label c-switch-success">
                  <input type="checkbox" class="c-switch-input form-check-input"                           
                    v-model="fieldForm.speaker_use_degree.value">
                  <span class="c-switch-slider"></span>
                </label>
                <label style="margin-left:5px; font-weight:bold;">Show speaker degree on page</label>
              </div>      -->
              <div class="guard-speaker">
                <div v-for="(speakerSelected, index) in fieldForm.speaker.value" :key="'speaker_select_' + index"
                class="box-speaker">
                  <div class="tool-delete" @click="fieldForm.speaker.value.splice(index, 1)">x</div>
                  <div class="speaker-label">
                    NAMA
                  </div>
                  <div class="speaker-value">
                    <span v-if="fieldForm.speaker_use_degree.value">
                        {{
                          optionsSpeaker(
                              {name: speakerSelected.name, prefix_degree: speakerSelected.prefix_degree, sufix_degree: speakerSelected.sufix_degree}
                            )
                        }}
                    </span> 
                    <span v-else>{{speakerSelected.name}}</span> 
                  </div>
                  <div class="speaker-label">
                    EMAIL
                  </div>
                  <div class="speaker-value">
                    {{(speakerSelected.email === '' || speakerSelected.email === null) ? '-' : speakerSelected.email}}
                  </div>                  
                  <div class="speaker-label">
                    Key Speaker
                  </div>
                  <div>
                    <input type="radio" :id="'is_main_' + speakerSelected.id" :value="speakerSelected.id" 
                    v-model="fieldForm.speaker_id.value" name="option_is_main_speaker">
                    <label :for="'is_main_' + speakerSelected.id" class="info-radio" v-if="fieldForm.speaker_id.value == speakerSelected.id">Yes</label>
                    <label :for="'is_main_' + speakerSelected.id" class="info-radio" v-else>No</label>
                  </div>

                  <!-- <label :for="'is_main_' + speakerSelected.id" style="margin-right:5px;cursor:pointer;">This is main speaker</label>                  
                  <input type="radio" :id="'is_main_' + speakerSelected.id" :value="speakerSelected.id" 
                    v-model="fieldForm.speaker_id.value" name="option_is_main_speaker"> -->
                  <!-- <select :id="'category_speaker_' + speakerSelected.id" :name="'category_speaker_' + speakerSelected.id"
                  v-model="speakerSelected.category" @change="processSetCategorySpeaker($event, speakerSelected.id)"
                    class="form-control" style="width:20% !important; display:inline !important;">
                      <option>pembicara</option>
                      <option>notulen</option>
                      <option>moderator</option>
                  </select> -->
                </div>
              </div>
            </CCol>
          </CRow>                  
          <CRow>
            <CCol sm="6">
              <div>
                <label>Category</label>
                <multiselect 
                  v-model="fieldForm.event_category.value" 
                  :options="fieldForm.event_category.options" 
                  :custom-label="optionsEventCategory" 
                  :allow-empty="true"
                  :multiple="true"
                  placeholder="Select Event Category"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'event_category')"
                  label="name" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.event_category.isValid === null) ? false : !fieldForm.event_category.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'event_category')}}
                  </label>
              </div>
            </CCol>
            <CCol sm="6">
              <div role="group" class="form-group">
                <label for="uid-xoci4l4u4gh" class="">Main Category</label>
                <select v-model="fieldForm.event_category_id.value" class="form-control">
                  <option v-for="(categorySelected, index) in fieldForm.event_category.value" :value="categorySelected.id" :key="'category_select_' + index">{{categorySelected.name}}</option>
                </select>
              </div>            
              <!-- <div>
                <div v-for="(categorySelected, index) in fieldForm.event_category.value" :key="'category_select_' + index">
                  <label :for="'is_main_' + categorySelected.id" style="margin-right:5px;cursor:pointer;">This is main category</label>                  
                  <input type="radio" :id="'is_main_' + categorySelected.id" :value="categorySelected.id" 
                    v-model="fieldForm.event_category_id.value" name="option_is_main_category" style="cursor:pointer;margin-right:10px;">
                  <label style="margin-left:20px">{{categorySelected.name}}</label> 
                </div>
              </div>            -->
            </CCol>
          </CRow>          
          <CRow>
            <CCol sm="6">
              <CSelect
                name="member_type"
                :value.sync="fieldForm.member_type.value"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'member_type')"                
                label="Member Type"
                :options="['free','internal', 'external']"
              />            
            </CCol>            
            <CCol sm="6">
              <CSelect
                name="event_type"
                :value.sync="fieldForm.event_type.value"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'event_type')"                
                label="Event Type"
                :options="['national', 'international']"
              />
            </CCol>
          </CRow> 
          <CRow>
            <CCol sm="6">
              <div role="group" class="form-group">              
                <label>Event Start</label>              
                <VueCtkDateTimePicker 
                  v-model="fieldForm.event_start.value"
                  id="event_start_input"
                  format="YYYY-MM-DD HH:mm:ss"
                  formatted="ddd, YYYY MMM DD, HH:mm"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'event_start')"
                  :no-value-to-custom-elem="false">  
                </VueCtkDateTimePicker>   
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldForm.event_start.isValid === null) ? false : !fieldForm.event_start.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'event_start')}}
                </label>   
              </div>     
            </CCol>
            <CCol sm="6">
              <div role="group" class="form-group">              
                <label>Event End</label>              
                <VueCtkDateTimePicker 
                  v-model="fieldForm.event_end.value"
                  id="event_end_input"
                  format="YYYY-MM-DD HH:mm:ss"
                  formatted="ddd, YYYY MMM DD, HH:mm"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'event_end')"
                  :no-value-to-custom-elem="false">  
                </VueCtkDateTimePicker>   
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                    v-show="(fieldForm.event_end.isValid === null) ? false : !fieldForm.event_end.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'event_end')}}
                </label> 
              </div>       
            </CCol>            
          </CRow>
          <CRow>
            <CCol sm="6">
              <CInput
                name="link_event"
                v-model="fieldForm.link_event.value"
                placeholder="Link Event ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'link_event')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'link_event')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'link_event')"
                label="Link Event"
              />
            </CCol>
            <CCol sm="6">
              <CInput
                name="participant_limit"
                v-model="fieldForm.participant_limit.value"
                placeholder="Participant limit ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'participant_limit')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'participant_limit')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'participant_limit')"
                label="Participant Limit"
              />
              <label class="text-info-form">
                Fill `0` if not limited. 
              </label>                 
            </CCol>             
          </CRow>           
          <CRow>
            <CCol sm="6">
              <CSelect
                name="location_type"
                :value.sync="fieldForm.location_type.value"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'location_type')"                
                label="Location Type"
                :options="['online', 'onsite']"
              />
            </CCol>            
            <CCol sm="6">
              <CTextarea
                name="location_address"
                v-model="fieldForm.location_address.value"
                placeholder="Location Address ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'location_address')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'location_address')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'location_address')"
                label="Location Address"
                />   
            </CCol>            
            <!-- <CCol sm="6">

              <CInput
                name="location_longitude"
                v-model="fieldForm.location_longitude.value"
                placeholder="Longitude ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'location_longitude')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'location_longitude')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'location_longitude')"                
                label="Longitude"
              />
              <CInput
                name="location_latitude"
                v-model="fieldForm.location_latitude.value"
                placeholder="Latitude ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'location_latitude')"
                :is-valid="globalFunctions.getIsValidfield(this, 'fieldForm', 'location_latitude')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'location_latitude')"                
                label="Latitude"
              />                            
            </CCol>           -->
          </CRow>
          <CRow>
            <CCol sm="6">
              <CTextarea 
                rows="5"
                name="location_embed_map"
                v-model="fieldForm.location_embed_map.value"
                placeholder="<iframe src='... ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'location_embed_map')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'location_embed_map')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'location_embed_map')"
                label="Embed map"             
                />               
            </CCol>
            <CCol sm="6">
              <div v-html="fieldForm.location_embed_map.value">
              </div>
            </CCol>
          </CRow>       
          <CRow>
            <CCol sm="12">
              <div>
                <label>Description</label>&nbsp;&nbsp;              
                <CButton variant="outline" color="info" square size="sm" @click="fieldForm.content_html.showHTML = false">HTML Code</CButton>&nbsp;&nbsp;&nbsp;
                <CButton variant="outline" color="info" square size="sm" @click="fieldForm.content_html.showHTML = true">Visual</CButton> :
              </div>
              <div v-if="fieldForm.content_html.showHTML">
                <div id="editor-toolbar-content_html">
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
                  ref="fieldForm_content_html" 
                  v-model="fieldForm.content_html.value" 
                  :editorOptions="fieldForm.content_html.editorSettings"
                  :customModules="fieldForm.content_html.modulesForEditor"
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'content_html')"
                >
                </vue-editor>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldForm.content_html.isValid === null) ? false : !fieldForm.content_html.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'content_html')}}
                </label>
              </div>
              <CTextarea 
                v-if="!fieldForm.content_html.showHTML"
                rows="10"
                name="description"
                v-model="fieldForm.content_html.value"
                placeholder="Description ..."
                :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'content_html')"
                :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'content_html')"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'content_html')"
             
                />   
            </CCol>          
          </CRow>
          <!-- Button Save -->
          <br>
          <div class="pos-button-guard">
            <div class="pos-button-right">
              <button type="submit" class="button-save-form">SAVE EVENT</button> 
            </div>
          </div>  
        </CForm>

        <!-- Section Event Image -->
        <hr v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"/>
        <div v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" 
        class="pos-button-guard guard-toggle-show-form" @click="showEventImageForm = !showEventImageForm">
          <div class="pos-button-right">
            <span class="toggle-show-form"> Event Image</span>
            <span class="menu-icon"><i class="md" :class="(showEventImageForm)?'up-arrow':'down-arrow'"></i></span>
          </div>
        </div>
        <div v-if="showEventImageForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')" 
        class="event-image" style="clear:both">
          <label class="">Event Image</label>
          <CRow>
            <CCol sm="6">
              <!-- From External Link -->
              <div class="box-group-form">
                <label class="semibold">External Link Image URL </label>
                <hr/>
                <CForm 
                  @submit.prevent="processFromExternalLinkImage"
                  v-if="renderFormUploadEventImage"
                >    
                  <CInput
                    name="external_link"
                    v-model="fieldFromExternalLinkImage.external_link.value"
                    placeholder="External Link Image ..."
                    :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFromExternalLinkImage', 'external_link')"
                    :is-valid="globalFunctions.getIsValidfield(this, 'fieldFromExternalLinkImage', 'external_link')"
                    @input="globalFunctions.processCheckFieldForm(vm, 'fieldFromExternalLinkImage', 'external_link')"                
                  />               
                  <div class="pos-button-guard box-group-form-button">
                    <div class="pos-button-right">
                      <button type="submit"  class="button-save-form">SAVE IMAGE</button> 
                    </div>
                  </div>
                </CForm>
              </div>
            </Ccol>
            <CCol sm="6">
              <!-- From Internal Server -->
              <div class="box-group-form">
                <label class="semibold">Feature Image</label>
                <hr/>
                <CForm 
                  @submit.prevent="processFormUploadEventImage"
                  v-if="renderFormUploadEventImage"
                >   
                  <div v-if="!fieldFormUploadEventImage.image.value">
                    <input 
                      type="file" 
                      @change="globalFunctions.onInputFileChange(vm, $event,'fieldFormUploadEventImage', 'image')"
                      accept="image/x-png,image/gif,image/jpeg,image/svg+xml,image/webp">
                  </div>
                  <div v-else style="display:block; vertical-align: middle; text-align: left; width:500px">
                    <div style="text-align: left;">
                      <CInput
                        name="title"
                        v-model="fieldFormUploadEventImage.title.value"
                        placeholder="Title ..."
                        :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldFormUploadEventImage', 'title')"
                        :is-valid="globalFunctions.getIsValidfield(this, 'fieldFormUploadEventImage', 'title')"
                        @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormUploadEventImage', 'title')" 
                        label="Title"               
                      />

                      <label>Lock : </label><br>
                      <label class="c-switch form-check-label c-switch-success">
                        <input type="checkbox" class="c-switch-input form-check-input"                           
                          v-model="fieldFormUploadEventImage.is_lock.value">
                        <span class="c-switch-slider"></span>
                      </label> 
                      <span class="info-checkbox" v-if="fieldFormUploadEventImage.is_lock.value == 1">Yes</span>
                      <span class="info-checkbox" v-else>No</span>  
                      <br>                                  
                      <label class="text-info-form">(if lock is 'yes' then your image cannot be use by other domain / unit / department)</label><br>                  
                    </div>
                    <div>
                      <span style="background: #e2e2e2; vertical-align: middle; text-align: center; display:table-cell; width: 600px; height: 300px; border: 2px solid rgb(216, 216, 216); border-radius: 6px;">                
                        <img 
                          style="margin: 0 auto;display: block;height: auto;width: auto;max-width:590px;max-height:290px;"
                          :src="fieldFormUploadEventImage.image.value" 
                        />  
                      </span>
                    </div>
                  </div>
                  <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                      v-show="(fieldFormUploadEventImage.image.isValid === null) ? false : !fieldFormUploadEventImage.image.isValid">
                      {{globalFunctions.getInvalidFeedback(this, 'fieldFormUploadEventImage', 'image')}}
                  </label> 
                  <div class="pos-button-guard box-group-form-button">
                    <div class="pos-button-left">
                      <button v-if="fieldFormUploadEventImage.image.value" 
                      @click="globalFunctions.removeInputFile(vm,'fieldFormUploadEventImage', 'image')" class="button-cancel-form">
                        Remove image
                      </button>
                      <button v-if="fieldFormUploadEventImage.image.value" type="submit" 
                      class="button-save-form">
                        UPLOAD
                      </button> 
                    </div>
                    <div class="pos-button-right">


                      <button @click="toggleModalListEventImage()"  class="button-save-form">CHOOSE FROM SERVER</button> 
                    </div>
                  </div>                  
                </CForm> 
              </div>
            </Ccol>
          </CRow>
          <CRow>
            <CCol sm="12">
              <!-- From External Link -->
              <div class="box-group-form">
                <label class="semibold">Order Event Image</label>
                <hr/>
                <CForm
                  @submit.prevent="processSaveOrderImage"
                  v-if="renderFormUploadEventImage"        
                >
   
                    <div style="display: flex;flex-wrap: wrap;justify-content: flex-start;">
                      <div v-for="(item) in listEventImage" :key="item.id" style="margin-bottom:15px;">
                          <div style="margin:0px 30px 0px 30px">
                              <span class="span_image_thumbnail">                
                                <img 
                                  class="image_thumbnail"
                                  :src="parseImageURL(item['image_id.url_public'])" 
                                />  
                              </span>
                          </div>
                          <div style="display: flex;flex-wrap: wrap;justify-content: flex-start; margin:6px 30px 0px 30px;">
                            <div style="margin-right:6px"> 
                                <CSelect
                                  name="image_order"
                                  :value="item.order"
                                  @change="imageOrderChange($event, item)"               
                                  :options="vm.listEventImage.map(o => parseInt(o.order))"
                                />  
                            </div>
                            <div style="margin-right:6px">  
                              <label v-if="item.is_banner" style="font-weight:600;">it's banner</label>  
                              <CButton
                                v-if="!item.is_banner"
                                color="success"
                                square
                                size="sm"
                                @click="processRegisterBaner(item.id)"
                              >
                                Put it as banner
                              </CButton>                          
                            </div>                  
                            <div style="margin-right:6px">  
                              <CButton
                                v-if="item.is_show"
                                color="info"
                                square
                                size="sm"
                                @click="processShownImage(item.id, 0)"
                              >
                                Click to not show
                              </CButton>   
                              <CButton
                                v-if="!item.is_show"
                                color="success"
                                square
                                size="sm"
                                @click="processShownImage(item.id, 1)"
                              >
                                Click to show
                              </CButton>                          
                            </div>
                            <!-- <div style="margin-right:6px">  
                              <CButton
                                v-if="item['image_id.is_lock']"
                                color="primary"
                                square
                                size="sm"
                                @click="processLockImage(item.id, 0)"
                              >
                                Click to unlock
                              </CButton>   
                              <CButton
                                v-if="!item['image_id.is_lock']"
                                color="warning"
                                square
                                size="sm"
                                @click="processLockImage(item.id, 1)"
                              >
                                Click to Lock
                              </CButton> 
                            </div> -->
                            <div style="margin-right:6px">  
                              <CButton
                                color="danger"
                                variant="outline"
                                square
                                size="sm"
                                @click="globalFunctions.toggleDeleteModal(vm, item, true, item['image_id.path'], 'showDeleteModalEventImage', 'itemDeleteIDEventImage', 'labelDeleteModalEventImage')"
                              >
                                Delete
                              </CButton>
                            </div>
                          </div>     
                      </div>            
                    </div>                    

                  <div class="pos-button-guard box-group-form-button">
                    <div class="pos-button-right">
                      <button type="submit"  class="button-save-form">SET ORDER IMAGE</button> 
                    </div>
                  </div>
                </CForm>
              </div>
            </CCol>
          </CRow>        
        </div>

        <!-- Section Event Share -->
        <hr v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"/>
        <div v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" 
        class="pos-button-guard guard-toggle-show-form" @click="showEventShareForm = !showEventShareForm">        
          <div  class="pos-button-right">
            <span class="toggle-show-form"> Event Share</span>
            <span class="menu-icon"><i class="md" :class="(showEventShareForm)?'up-arrow':'down-arrow'"></i></span>
          </div>
        </div>
        <div v-if="showEventShareForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')" style="clear:both">
          <CRow>
            <CCol sm="12">
              <label class="">Event Share</label>

              <div class="box-group-form">
                <label class="semibold">Set Share to domain</label>
                <hr/>
                <multiselect 
                  v-model="fieldFormShare.event_share_domain.value" 
                  :options="fieldFormShare.event_share_domain.options" 
                  :custom-label="optionsDomain" 
                  :allow-empty="true"
                  :multiple="true"
                  placeholder="Select Domain To Share..."
                  @input="globalFunctions.processCheckFieldForm(vm, 'fieldFormShare', 'event_share_domain')"                 
                  label="code" track-by="name">
                </multiselect>
                <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                  v-show="(fieldFormShare.event_share_domain.isValid === null) ? false : !fieldFormShare.event_share_domain.isValid">
                    {{globalFunctions.getInvalidFeedback(this, 'fieldFormShare', 'event_share_domain')}}
                  </label>
                  <div class="pos-button-guard box-group-form-button">
                    <div class="pos-button-right">
                      <button  class="button-save-form" @click="processSaveShareToDomain()">SHARE EVENT</button> 
                    </div>
                  </div>                  
              </div> 
            </CCol>
          </CRow>
        </div>

        <!-- Section Event Summary -->
        <hr v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"/>
        <div v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" 
        class="pos-button-guard guard-toggle-show-form" @click="showSummaryForm = !showSummaryForm">         
          <div class="pos-button-right">
            <span class="toggle-show-form"> Event Summary</span>
            <span class="menu-icon"><i class="md" :class="(showSummaryForm)?'up-arrow':'down-arrow'"></i></span>
          </div>
        </div>
        <CRow v-if="showSummaryForm && (fieldForm.id.value !== null && fieldForm.id.value !== '')">
          <CCol sm="12">
            <div>
              <label>Summary Event</label>&nbsp;&nbsp;              
              <CButton variant="outline" color="info" square size="sm" @click="fieldForm.summary_html.showHTML = false">HTML Code</CButton>&nbsp;&nbsp;&nbsp;
              <CButton variant="outline" color="info" square size="sm" @click="fieldForm.summary_html.showHTML = true">Visual</CButton> :
            </div>
            <div v-if="fieldForm.summary_html.showHTML">
              <div id="editor-toolbar-summary_html">
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
                ref="fieldForm_summary_html" 
                v-model="fieldForm.summary_html.value" 
                :editorOptions="fieldForm.summary_html.editorSettings"
                :customModules="fieldForm.summary_html.modulesForEditor"
                @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'summary_html')"
              >
              </vue-editor>
              <label style ="width: 100%;margin-top: 0.25rem;font-size: 80%;color: #e55353;" 
                v-show="(fieldForm.summary_html.isValid === null) ? false : !fieldForm.summary_html.isValid">
                  {{globalFunctions.getInvalidFeedback(this, 'fieldForm', 'summary_html')}}
              </label>
            </div>
            <CTextarea 
              v-if="!fieldForm.summary_html.showHTML"
              rows="10"
              name="summary"
              v-model="fieldForm.summary_html.value"
              placeholder="Summary ..."
              :invalid-feedback="globalFunctions.getInvalidFeedback(this, 'fieldForm', 'summary_html')"
              :is-valid="globalFunctions.getIsValidfield(this,'fieldForm', 'summary_html')"
              @input="globalFunctions.processCheckFieldForm(vm, 'fieldForm', 'summary_html')"
            
              />
            <div class="pos-button-guard box-group-form-button" style="margin-top:20px">
              <div class="pos-button-right">
                <button  class="button-save-form" @click="processFormEvent(null)">SAVE SUMMARY</button> 
              </div>
            </div>                

          </CCol>          
        </CRow>

        <!-- Section Event Attendance -->
        <hr v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"/>
        <div v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')" 
        class="pos-button-guard guard-toggle-show-form" @click="showAttendanceList = !showAttendanceList">            
          <div class="pos-button-right">
            <span class="toggle-show-form"> Event Attendace</span>
            <span class="menu-icon"><i class="md" :class="(showAttendanceList)?'up-arrow':'down-arrow'"></i></span>
          </div>      
        </div>  
        <div v-if="showAttendanceList && (fieldForm.id.value !== null && fieldForm.id.value !== '')" style="clear:both">
          <hr/>
          <CRow>
            <CCol sm="12">
              <div style="padding-bottom:26px">
                <div style="padding-bottom:20px;font-weight:bold;">Import Attendace Data</div>
                <div style="font-size: 14px;color: #5E5E5E;letter-spacing: 0;">
                  You can import participant data from online meeting services (zoom) to be synchronized with our registered participants. 
                  Please use our attached template before uploading file. </div>
                <div class="box-group-form">
                  <label class="semibold">Import Data</label>
                  <hr/>                
                  <div style="padding-bottom:20px">
                    <a href="" download>Download Template</a><br>
                    <label class="text-info">sparate by comma (<font style="color:#ff0000">,</font>) and row format => name<font style="color:#ff0000">,</font>email<font style="color:#ff0000">,</font>join_time<font style="color:#ff0000">,</font>leave_time<font style="color:#ff0000">,</font>duration</label><br>
                    <label class="text-info">for example => 
                        Didit P<font style="color:#ff0000">,</font>email.dev@gmail.com<font style="color:#ff0000">,</font>07/15/2021 10:37:35 AM<font style="color:#ff0000">,</font>07/15/2021 11:50:30 AM<font style="color:#ff0000">,</font>73 
                        <font style="color:#424242">/OR/</font> email.dev<font style="color:#ff0000">,</font>email.dev@gmail.com<font style="color:#ff0000">,,,</font>
                    </label>
                  </div>
                  <div v-if="!showSaveBulkAttendance">
                    <input 
                      type="file" 
                      @change="processCheckBulkAttendance($event)"
                      accept=".csv">
                  </div>
                  <div v-if="showSaveBulkAttendance">
                    {{nameFileBulkAttendance}}
                    <CButton color="warning" square size="sm" @click="processSaveAttendance('cancel')">
                      Cancel
                    </CButton>
                  </div>
                  <div style="padding-bottom:20px;font-weight:bold;" v-html="infoProcessBulkAttendance"></div>
                  <CButton color="success" v-if="showSaveBulkAttendance" square size="sm" @click="processSaveAttendance(null)">
                    Save All
                  </CButton>
                </div>
              </div>
            </CCol>                                              
          </CRow>
          <hr/>    
          <CRow>
            <CCol sm="2" style="text-align: center;">
                <CButton color="warning" variant="outline" square size="sm" @click="processDownloadAttendanceCsv()">
                  Download CSV
                </CButton>
            </CCol> 
            <CCol sm="2">
              <label class="text-info" style="font-weight:bold;">Visitor Joined : {{countVisitor}}</label><br>
            </CCol>   
            <CCol sm="2">
              <label class="text-info" style="font-weight:bold;">Presence : {{tableVisitorEventAttendance.countPresence}}</label>                
            </CCol>  
            <CCol sm="2">
              <label class="text-info" style="font-weight:bold;">Presence Sync : {{tableVisitorEventAttendance.countPresenceSync}}</label>                
            </CCol>  
            <CCol sm="2">
              <label class="text-info" style="font-weight:bold;">Get Link : {{tableVisitorEventAttendance.countGetLink}}</label>                
            </CCol>               
          </CRow>        
          <hr/>          
          <CDataTable
            id="table-attendance"

            :items="tableVisitorEventAttendance.listItems"
            :fields="tableVisitorEventAttendance.fields"
            column-filter
            :tableFilter='{ label:"Search"}'
            items-per-page-select
            :items-per-page="20"
            hover
            sorter
            pagination
          >      
          <template #action_get_link="{item}">
            <td style="text-align: center;"> 
              <div v-if="item.action_get_link" style="background: #4ace00;
                color: #fff;
                font-weight: bold;
                width: 30px;
                text-align: center;
                border-radius: 100%;
                height: 30px;
                display: table-cell;
                vertical-align: middle;"
                >Ya</div>
              <div v-else style="background: #ce0000;
                color: #fff;
                font-weight: bold;
                width: 30px;
                text-align: center;
                border-radius: 100%;
                height: 30px;
                display: table-cell;
                vertical-align: middle;"
                >No</div>                
            </td>
          </template>                    
          <template #presence="{item}">
            <td>
              <label class="c-switch form-check-label c-switch-success">
                <input type="checkbox" class="c-switch-input form-check-input"                           
                  v-model="item.presence">
                <span class="c-switch-slider"></span>
              </label>
            </td>
          </template>
          <template #presence_sync="{item}">
            <td style="text-align: center;"> 
              <div v-if="item.presence_sync" style="background: #4ace00;
                color: #fff;
                font-weight: bold;
                width: 30px;
                text-align: center;
                border-radius: 100%;
                height: 30px;
                display: table-cell;
                vertical-align: middle;"
                >Ya</div>
              <div v-else style="background: #ce0000;
                color: #fff;
                font-weight: bold;
                width: 30px;
                text-align: center;
                border-radius: 100%;
                height: 30px;
                display: table-cell;
                vertical-align: middle;"
                >No</div>                
            </td>
          </template>
          <template #join_time_show="{item}">
            <td> 
                  <!-- :minDate="moment(item['event_id.event_start']).format('YYYY-MM-DD HH:mm:ss')"
                  :maxDate="moment(item['event_id.event_end']).format('YYYY-MM-DD HH:mm:ss')" -->
                <!-- <VueCtkDateTimePicker 
                  v-model="item.join_time"
                  v-bind:id="'join_time_' +item.id"
                  format="YYYY-MM-DD HH:mm:ss"
                  formatted="YYYY-MM-DD HH:mm"
                  @input="processJoinTimeDuration(item)"
                  :enabledDates="globalFunctions.createDateRange(moment(item['event_id.event_start']),moment(item['event_id.event_end']))"
                  position="bottom"
                  :onlyTime="false" 
                  :no-value-to-custom-elem="false">  
                </VueCtkDateTimePicker> -->
              <span v-if="item.join_time !== null && item.join_time != '' && item.join_time  != '-'">{{ item.join_time_show = moment(item.join_time).format('HH:mm:ss') }}</span>
              <span v-else>-</span>
            </td>
          </template>
          <template #leave_time_show="{item}">
            <td>
                  <!-- :minDate="moment(item['event_id.event_start']).format('YYYY-MM-DD HH:mm:ss')"
                  :maxDate="moment(item['event_id.event_end']).format('YYYY-MM-DD HH:mm:ss')" -->              
                <!-- <VueCtkDateTimePicker 
                  v-model="item.leave_time"
                  v-bind:id="'leave_time_' +item.id"
                  format="YYYY-MM-DD HH:mm:ss"
                  formatted="YYYY-MM-DD HH:mm"
                  @input="processJoinTimeDuration(item)"
                  :enabledDates="globalFunctions.createDateRange(moment(item['event_id.event_start']),moment(item['event_id.event_end']))"
                  position="bottom"
                  :onlyTime="false" 
                  :no-value-to-custom-elem="false">  
                </VueCtkDateTimePicker>               -->
              <span v-if="item.leave_time !== null && item.leave_time != '' && item.leave_time  != '-'">{{ item.leave_time_show = moment(item.leave_time).format('HH:mm:ss') }}</span>
              <span v-else>-</span>
            </td>
          </template>
          <template #save_button="{item}">
            <td class="py-2">
              <CButton
                color="success"
                square
                size="sm"
                @click="processSaveAttendance(item)"
              >
                Save All
              </CButton>
            </td>
          </template>
          </CDataTable>
          <div v-if="tableVisitorEventAttendance.isNeedPrevious100k | tableVisitorEventAttendance.isNeedNext100k">
            <label style="color:#ff0000">Only fetch 100k record per request from database, because perfomance !!!</label>
          </div>
          <CButton
            v-if="tableVisitorEventAttendance.isNeedPrevious100k"
            color="warning"
            variant="outline"
            square
            size="sm"
            @click="globalFunctions.togglePrevious100k(vm, vm.processGetVisitorEventList)"
          >
            Previous 100k record
          </CButton> 
          <CButton
            v-if="tableVisitorEventAttendance.isNeedNext100k"
            color="warning"
            variant="outline"
            square
            size="sm"
            @click="globalFunctions.toggleNext100k(vm, vm.processGetVisitorEventList)"
          >
            Next 100k record
          </CButton>          
        </div>

        <hr v-if="(fieldForm.id.value !== null && fieldForm.id.value !== '')"/>

      </CCardBody>
    </CCard>
    <CModal
      :centered="true"
      title="Confirmation Delete !!"
      color="warning"
      :show.sync="showDeleteModalEventImage"
    >
      <label>{{labelDeleteModalEventImage}}</label>

      <div slot="footer-wrapper" class="w-100">
        <div class="modal-footer">
          <CButton
            color="warning"
            square
            size="sm"
            @click="processDeleteEventImage()"
          >
            Delete
          </CButton>
          <CButton
            color="secondary"
            square
            size="sm"
            @click="globalFunctions.toggleDeleteModal(vm, null, false, null, 'showDeleteModalEventImage', 'itemDeleteIDEventImage', 'labelDeleteModalEventImage')"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>
    <CModal
      size="xl"
      :centered="true"
      title="Choose your image !!"
      color="info"
      :show.sync="showModalListEventImage"
    >

      <CRow style="justify-content: center;">
          <CCol sm="4">

              <CInput
                name="search"
                v-model="searchEventImage"
                placeholder="search title ..."
              />    
          </CCol>  
          <CButton
            style="margin-right: 20px;"
            color="success"
            square
            size="sm"
            @click="processSearchFirstEventImage()"
          >
            Search
          </CButton>
          <CButton
            color="warning"
            square
            size="sm"
            @click="processSaveEventImage()"
          >
            Save
          </CButton>        
      </CRow>    
      <div class="box_list_image">
        <div v-for="(item) in listImageEvent" :key="item.id" class="item_image">
            <div>
                <span class="span_image_thumbnail_modal" v-bind:class="{ image_selected: item['is_select'] }" @click="processChooseImageEvent(item)">                
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
            @click="processLoadMoreEventImage()"
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
            @click="processSaveEventImage()"
          >
            Save
          </CButton>
          <CButton
            color="secondary"
            square
            size="sm"
            @click="toggleModalListEventImage()"
          >
            Cancel
          </CButton>
        </div>  
      </div>
    </CModal>

    <ModalAddImageEditor ref="ModalAddImageEditor" />        

  </div>
</template>

<style lang="scss">
  @import '../../assets/scss/page_form';
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

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

export default {
  name: 'EventForm',
  components: {
    Multiselect,
    VueCtkDateTimePicker,
    VueEditor,
    // For ModalAddImageEditor must add :
      // import baseCallApiHelper from '../../helpers/baseCallApi';    
    ModalAddImageEditor    
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
      speakerTemp : [],
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
        event_category_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        event_category : {
          value : [],
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },        
        event_category_sub : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        speaker_use_degree : {
          value : 1,
          selected : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        speaker_id : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        speaker : {
          value : [],
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null
        },
        member_type : {
          value : "internal",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.20'],
          isValid : null        
        },
        event_type : {
          value : "national",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.20'],
          isValid : null        
        },
        event_start : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'less_than_datetime.event_end'],
          isValid : null        
        }, 
        event_end : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'greater_than_datetime.event_start'],
          isValid : null        
        },
        location_type : {
          value : "onsite",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.20'],
          isValid : null        
        },    
        location_address : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required'],
          isValid : null        
        },         
        location_longitude : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        }, 
        location_latitude : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        participant_limit : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        }, 
        link_event : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },                
        location_embed_map : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },           
        content_html : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3', 'max.65535'],
          isValid : null,
          showHTML : true,
          modulesForEditor: [{ alias: "imageDrop", module: ImageDrop }, { alias: "imageResize", module: ImageResize }],
          editorSettings: {
            modules: {
              imageDrop: true,
              imageResize: {},
              toolbar: {
                container: "#editor-toolbar-content_html",
                handlers: {
                  customImage: () => {  
                  this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;

                    this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_content_html.quill;
                    this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                  }
                }           
              }          
            }    
          }              
        },
        summary_html : {
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
                container: "#editor-toolbar-summary_html",
                handlers: {
                  customImage: () => {  
                  this.$refs.ModalAddImageEditor.baseCallApiHelper = baseCallApiHelper;

                    this.$refs.ModalAddImageEditor.objectEditor = this.$refs.fieldForm_summary_html.quill;
                    this.$refs.ModalAddImageEditor.toggleModalListImageEditor();
                  }
                }           
              }          
            }    
          }              
        },
        publish_status : {
          value : "",
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },
        publish_status_form : {
          value : 0,
          tempValue : 0,         
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
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
        event_share_domain : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : [],
          isValid : null        
        },  
      },
      renderFormUploadEventImage : false,      
      fieldFormUploadEventImage : {
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
      fieldFromExternalLinkImage : {
        external_link : {
          value : "",
          tempValue : "",
          options: [],
          prefixInvalidFeedback : "This field must be",
          invalidFeedback : "This field must be check !!!",
          validationRules : ['required', 'min.3'],
          isValid : null        
        },  
      },

      showMainForm : true,    
      showSummaryForm : true,    
      showEventImageForm : true,
      showEventShareForm : true,
      showAttendanceList : true,

      listEventImage : [],
      itemDeleteIDEventImage : null,
      showDeleteModalEventImage : false,
      labelDeleteModalEventImage : "",
      showModalListEventImage : false,

      pageImageEvent: 0,
      searchEventImage: "",
      listImageEvent : [],

      countVisitor: 0,
      infoProcessBulkAttendance : "",
      nameFileBulkAttendance : "",
      showSaveBulkAttendance: 0,
      tableVisitorEventAttendance  : {
        listItemsTemp: [],
        listItems: [],
        pageDataBase : 1,
        isNeedPrevious100k : false,
        isNeedNext100k : false,
        labelDeleteModal : "",
        showDeleteModal: false,
        itemDeleteID: null,
        fields : [
          { key: 'id', label: 'ID', _classes:["d-none", "sr_only"], isFields: true }, 
          { key: 'visitor_id.name', label: 'Name', _style:'width:10%', isFields: true }, 
          { key: 'visitor_id.email', label: 'Email', _style:'width:10%', isFields: true }, 
          { key: 'action_get_link', label: 'Get Link (1/0)', _style:'width:5%', isFields: true }, 
          { key: 'presence', label: 'Presence (1/0)', _style:'width:5%', isFields: true }, 
          { key: 'presence_sync', label: 'Sync Presence (1/0)', _style:'width:5%', isFields: true }, 
          // { key: 'join_time', label: 'Join Time (choose event date)', _style:'width:10%', isFields: true }, 
          // { key: 'leave_time', label: 'Leave Time (choose event date)', _style:'width:10%', isFields: true }, 
          // { key: 'event_id.event_start', label: 'Event Date', _style:'width:10%', isFields: true }, 

          { key: 'join_time_show', label: 'Join Time', _style:'width:10%'}, 
          { key: 'leave_time_show', label: 'Leave Time', _style:'width:10%'},           
          { key: 'minutes_duration', label: 'Duration (minutes)', _style:'width:10%', isFields: true }, 
          { key: 'event_id', label: 'Event ID', _classes:["d-none", "sr_only"], isFields: true },
          { key: 'visitor_id', label: 'Visitor ID', _classes:["d-none", "sr_only"], isFields: true },
          { key: 'modified_by.name', label: 'Modified By', _classes:["d-none", "sr_only"], isFields: true },
          { key: 'modified_on', label: 'Modified On', _classes:["d-none", "sr_only"], isFields: true },
          // Classes d-none & sr_only make visibility hide on table
          { key: 'created_by.name', label: 'Created By', _classes:["d-none", "sr_only"], isFields: true },
          { key: 'created_on', label: 'Created On', _classes:["d-none", "sr_only"], isFields: true },
          { 
            key: 'save_button', 
            label: '', 
            _style: 'width:5%', 
            sorter: false, 
            filter: false
          }
        ],
        countPresence: 0,
        countPresenceSync: 0,
        countGetLink: 0  
      }

    }
  },
  created () {
    this.processGetEventCategoryList();
    this.processGetSpeakerList();
    if (this.$route.params.id) {
      this.renderFormUploadEventImage = true;
      this.fieldForm.id.value = this.$route.params.id;

      if (this.$route.path.includes('/summary/')) {
        this.showMainForm = false;    
        this.showEventImageForm = false;
        this.showSummaryForm = true; 
        this.showAttendanceList = true;          
      } else if (this.$route.path.includes('/attendance/')) {
        this.showMainForm = false;    
        this.showEventImageForm = false;
        this.showSummaryForm = false ; 
        this.showAttendanceList = true;          
      } else {
        this.showMainForm = false;     
        this.showEventImageForm = false;
        this.showEventShareForm = false;
        this.showSummaryForm = false;
        this.showAttendanceList = false;              
      }
      
      this.processGetEventDetail();
      this.processGetEventImageList();

      this.processGetVisitorEventList();
      // this.processGetCountVisitorEventList();
    } else {
        this.showMainForm = true;     
        this.showEventImageForm = false;
        this.showSummaryForm = false;
        this.showAttendanceList = false;    

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
    processGetEventDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get event  detail",
        null,
        api.event.read.method,
        api.event.read.url + '/' + this.$route.params.id + '?is_form=1', 
        data, 
        (status, data, message) => {
          if(status) {

            this.oauthClientsIdForm = data.data.oauth_clients_id;
            this.fieldForm.domain_id.tempValue = data.data.domain_id;
            this.fieldForm.domain_id.value = this.fieldForm.domain_id.options.find(element => element.id === data.data.domain_id);

            this.fieldForm.id.value = data.data.id;
            this.fieldForm.name.value = data.data.name;
            this.fieldForm.publish_status.value = data.data.publish_status;

            if (this.fieldForm.publish_status.value === 'publish_local') {
              this.fieldForm.publish_status_form.value = 0;
              this.fieldForm.publish_status_form.tempValue = 0;

            } else {
              this.fieldForm.publish_status_form.value = 1;
              this.fieldForm.publish_status_form.tempValue = 1;
            }

            // event category ------------------------
              this.fieldForm.event_category_id.value = data.data.event_category_id;
              // this.fieldForm.event_category_id.value = this.fieldForm.event_category_id.options.find(element => element.id === data.data.event_category_id);
              
              this.fieldForm.event_category.tempValue = data.data['event_category.list'];

              var valueEventCategory = [];
              var optionsEventCategory= this.fieldForm.event_category.options;
              data.data['event_category.list'].forEach(function(item) {
                valueEventCategory.push(optionsEventCategory.find((element) => { if (element.id === item.id) { element.is_main=item.is_main; return element;} }));

              });
              this.fieldForm.event_category.value = valueEventCategory;
            // ------------------------ event category

            // Speaker ------------------------
              this.fieldForm.speaker_id.value = data.data.speaker_id;
              this.fieldForm.speaker_use_degree.tempValue = this.fieldForm.speaker_use_degree.value = data.data.speaker_use_degree;

              this.fieldForm.speaker.tempValue = data.data['speaker.list'];

              var valueSpeaker = [];
              var optionsSpeaker = this.fieldForm.speaker.options;
              data.data['speaker.list'].forEach(function(item) {
                // valueSpeaker.push(optionsSpeaker.find(element => element.id === item.id));
                valueSpeaker.push(optionsSpeaker.find((element) => { if (element.id === item.id) { element.category=item.category; return element;} }));

              });
              this.fieldForm.speaker.value = valueSpeaker;
            // ------------------------ Speaker

            this.fieldForm.member_type.value = data.data.member_type;
            this.fieldForm.event_type.value = data.data.event_type;
            this.fieldForm.event_start.value = data.data.event_start;
            this.fieldForm.event_end.value = data.data.event_end;
            this.fieldForm.location_type.value = data.data.location_type;
            this.fieldForm.content_html.value = data.data.content_html;
            this.fieldForm.summary_html.value = data.data.summary_html;

            this.fieldForm.location_address.value = data.data.location_address;
            this.fieldForm.location_longitude.value = data.data.location_longitude;
            this.fieldForm.location_latitude.value = data.data.location_latitude;
            this.fieldForm.location_embed_map.value = data.data.location_embed_map;
            this.fieldForm.participant_limit.value = data.data.participant_limit;
            this.fieldForm.link_event.value = data.data.link_event;

            this.createdBy = data.data["created_by.name"];
            this.createdOn = data.data["created_on"];
            this.modifiedBy = data.data["modified_by.name"];
            this.modifiedOn = data.data["modified_on"];

            // Share Domain ------------------------
              this.processGetListDomainForShare();
              this.fieldFormShare.event_share_domain.tempValue = data.event_share_domain;

                var valueShareToDomain = [];
                var optionsShareToDomain = this.fieldFormShare.event_share_domain.options;
                data.event_share_domain.forEach(function(item) {
                  valueShareToDomain.push(optionsShareToDomain.find(element => element.id === item.domain_id));
                });
                this.fieldFormShare.event_share_domain.value = valueShareToDomain;
            // ------------------------ Share Domain

            // try {
            //   this.fieldForm.event_category_sub.tempValue = JSON.parse(data.data.event_category_sub);
            //   var eventCategorySubVal = [];
            //   var eventCategorySubOpt = this.fieldForm.event_category_sub.options;            
            //   this.fieldForm.event_category_sub.tempValue.forEach(function(item) {
            //     eventCategorySubVal.push(eventCategorySubOpt.find(element => element.id === item.id));
            //   });
            //   this.fieldForm.event_category_sub.value = eventCategorySubVal;
            // } catch (e) {
            //   this.fieldForm.event_category_sub.value = [];
            // }

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
    processFormEvent: function (e) {
      if (globalFunctions.validationForm(this, 'fieldForm')) {

        // var eventCategorySubVal = [];
        // if (typeof(this.fieldForm.event_category_sub.value) !== 'undefined' && this.fieldForm.event_category_sub.value !== '') { 
        //   eventCategorySubVal = this.fieldForm.event_category_sub.value;
        // }
        
        const data = {
            name              : this.fieldForm.name.value,
            event_category_id : this.fieldForm.event_category_id.value,
            event_category     : (typeof(this.fieldForm.event_category.value) === 'undefined' || this.fieldForm.event_category.value ==='') 
              ? null : this.fieldForm.event_category.value,
            // event_category_sub : eventCategorySubVal,
            speaker_use_degree : this.fieldForm.speaker_use_degree.value,
            speaker_id        : this.fieldForm.speaker_id.value,
            speaker           : (typeof(this.fieldForm.speaker.value) === 'undefined' || this.fieldForm.speaker.value ==='') 
              ? null : this.fieldForm.speaker.value,
            member_type       : this.fieldForm.member_type.value,
            event_start       : (this.fieldForm.event_start.value === "") ? null : this.fieldForm.event_start.value,
            event_end         : (this.fieldForm.event_end.value === "") ? null : this.fieldForm.event_end.value,
            event_type        : this.fieldForm.event_type.value,
            location_type     : this.fieldForm.location_type.value,
            participant_limit     : this.fieldForm.participant_limit.value,
            link_event     : this.fieldForm.link_event.value,

            content_html      : this.fieldForm.content_html.value,
            summary_html      : this.fieldForm.summary_html.value,

            location_address    : this.fieldForm.location_address.value,
            location_longitude: this.fieldForm.location_longitude.value,
            location_latitude : this.fieldForm.location_latitude.value,
            location_embed_map  : this.fieldForm.location_embed_map.value

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


          if (this.fieldForm.publish_status_form.value == 1) {
            data.publish_status = this.fieldForm.publish_status.value = 'publish_global';
            this.fieldForm.publish_status_form.tempValue = 1;            
          } else {
            data.publish_status = this.fieldForm.publish_status.value = 'publish_local';
            this.fieldForm.publish_status_form.tempValue = 0;
          }

          if (allowForSuAdmin) {
            baseCallApiHelper.callApi(
              "Create event ",
              null,
              api.event.create.method,
              api.event.create.url, 
              data, 
              (status, data, message) => {
                if(status) {
                  this.fieldForm.id.value = this.$route.params.id = data.data.id
                  this.renderFormUploadEventImage = true; 

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
            if (this.fieldForm.publish_status_form.value == 1) {
              data.publish_status = this.fieldForm.publish_status.value = 'publish_global';
              this.fieldForm.publish_status_form.tempValue = 1;              
            } else {
              data.publish_status = this.fieldForm.publish_status.value = 'publish_local';
              this.fieldForm.publish_status_form.tempValue = 0;
            }
          }

          data.id = this.fieldForm.id.value;
          baseCallApiHelper.callApi(
            "Update event ",
            null,
            api.event.update.method,
            api.event.update.url,  
            data, 
            (status, data, message) => {
              if(status) {

                this.modifiedBy = this.activeSystemUserName;
                this.modifiedOn = data.data["modified_on"];
                this.showEventImageForm = true;
                this.processGetEventDetail();

              } 
            }, 
            true, 
            true,
            true
          );

        }
        e.preventDefault(); 
      } else {
        this.showFieldFormValidation = true;
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
        {"Privilege": "readevent"},
        api.domain.list.method,
        api.domain.list.url, 
        data, 
        (status, data, message) => {
          if(status) {
          this.fieldFormShare.event_share_domain.options = data.data;

          if (this.fieldFormShare.event_share_domain.tempValue !== "") {
            var valueShareToDomain = [];
            var optionsShareToDomain = this.fieldFormShare.event_share_domain.options;
            this.fieldFormShare.event_share_domain.tempValue.forEach(function(item) {
              valueShareToDomain.push(optionsShareToDomain.find(element => element.id === item.domain_id));
            });
            this.fieldFormShare.event_share_domain.value = valueShareToDomain; 
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
            event_id  : this.fieldForm.id.value,
            event_share_domain     : this.fieldFormShare.event_share_domain.value,
        }; 

          baseCallApiHelper.callApi(
            "Share event",
            null,
            api.event.updateshareevent.method,
            api.event.updateshareevent.url, 
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

    optionsEventCategory ({ name, description }) {
      description = (description === null) ? '-' : description;
      return `${name} : ${description}`
    },              
    processGetEventCategoryList: function () {
        const data = {
          select : ["id", "name", "description"],
          filter : "",
          order_by : "name asc"
        };
      baseCallApiHelper.callApi(
        "Get event category list",
        {"Privilege": "readevent"},
        api.event_category.list.method,
        api.event_category.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.event_category.options =  data.data;

            if (this.fieldForm.event_category.tempValue !== "") {
              var valueEventCategory = [];
              var optionsEventCategory = this.fieldForm.event_category.options;
              this.fieldForm.event_category.tempValue.forEach(function(item) {
                valueEventCategory.push(optionsEventCategory.find((element) => { if (element.id === item.id) { element.is_main=item.is_main; return element;} }));
              });
              this.fieldForm.event_category.value = valueEventCategory; 
            }
          }
        }, 
        false, 
        true,
        true
      );
    },

    optionsSpeaker ({ name, prefix_degree, sufix_degree  }) {
      var prefix = (prefix_degree === null) ? "" : prefix_degree + " ";
      var sufix = (sufix_degree === null) ? "" : " " + sufix_degree;

      return `${prefix}${name}${sufix}`
    },              
    processGetSpeakerList: function () {
        const data = {
          select : ["id", "name", "email", "prefix_degree", "sufix_degree"],
          filter : "",
          order_by : "name asc"
        };
      baseCallApiHelper.callApi(
        "Get speaker list",
        {},
        api.speaker.list.method,
        api.speaker.list.url, 
        data, 
        (status, data, message) => {
          if(status) {

            this.fieldForm.speaker.options =  data.data;

            if (this.fieldForm.speaker.tempValue !== "") {
              var valueSpeaker = [];
              var optionsSpeaker = this.fieldForm.speaker.options;
              this.fieldForm.speaker.tempValue.forEach(function(item) {
                // valueSpeaker.push(optionsSpeaker.find(element => element.id === item.id));
                valueSpeaker.push(optionsSpeaker.find((element) => { if (element.id === item.id) { element.category=item.category; return element;} }));
              });
              this.fieldForm.speaker.value = valueSpeaker; 
            }
          }
        }, 
        false, 
        true,
        true
      );
    },
    processSetCategorySpeaker: function(event, speakerID) {
      this.fieldForm.speaker.value.find(e => e.id == speakerID)['category'] = event.target.value;
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

    processFormUploadEventImage: function (e) {
      if (globalFunctions.validationForm(this, 'fieldFormUploadEventImage')) {

        const data = {
            event_id      : this.fieldForm.id.value,
            image         : this.fieldFormUploadEventImage.image.value,
            title         : this.fieldFormUploadEventImage.title.value,
            is_lock       : this.fieldFormUploadEventImage.is_lock.value
        };

          baseCallApiHelper.callApi(
            "Upload Image",
            null,
            api.event.uploadImage.method,
            api.event.uploadImage.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.fieldFormUploadEventImage.image.value = "";
                this.fieldFormUploadEventImage.title.value = "";
                this.fieldFormUploadEventImage.is_lock.value = false;
                this.processGetEventImageList();

              } 
            }, 
            true, 
            true,
            true
          );        
      }

    },
    parseImageURL: function(publicImageURL) {
      var isJsonParse = true;
      var ImageURLJsonParse = "";
      publicImageURL = publicImageURL.replace(/\\"/g, '"');

      try {
          ImageURLJsonParse = JSON.parse(publicImageURL);
      } catch (e) {
          isJsonParse = false;
      }

      if(isJsonParse) {
        return ImageURLJsonParse.md;

      } else {
        return publicImageURL;
      }
    },
    processGetEventImageList: function () {
      const data = {};
      baseCallApiHelper.callApi(
        "Get event image list",
        null,
        api.event.listEventImage.method,
        api.event.listEventImage.url + '/' + this.fieldForm.id.value, 
        data, 
        (status, data, message) => {
          if(status) {
          data.data.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));


            this.listEventImage = data.data;
          }
        }, 
        false, 
        true,
        true
      );
    },       
    processDeleteEventImage: function () {
      const data = {
      };      
      if (this.itemDeleteIDEventImage) {
        baseCallApiHelper.callApi(
          "Delete event image",
          null,
          api.event.deleteEventImage.method,
          api.event.deleteEventImage.url + '/' + this.itemDeleteIDEventImage, 
          data, 
          (status, data, message) => {
            this.itemDeleteIDEventImage = null;              
            if(status){
                this.processGetEventImageList();
            }
          }, 
          true, 
          true,
          true
        );
      }
      this.showDeleteModalEventImage = false;
    },    
    processRegisterBaner: function (id) {
      const data = {
        event_image_id : id
      };      
      baseCallApiHelper.callApi(
        "Register banner",
        null,
        api.event.registerBanner.method,
        api.event.registerBanner.url, 
        data, 
        (status, data, message) => {
          if(status){
              this.processGetEventImageList();
          }
        }, 
        true, 
        true,
        true
      );
      
    },
    processShownImage: function (id, isShow) {
      const data = {
        event_image_id : id,
        is_show : isShow
      };      
      baseCallApiHelper.callApi(
        "Shown image",
        null,
        api.event.shownImage.method,
        api.event.shownImage.url, 
        data, 
        (status, data, message) => {
          if(status){
              this.processGetEventImageList();
          }
        }, 
        true, 
        true,
        true
      );
    },
    processLockImage: function (id, isLock) {
      const data = {
        event_image_id : id,
        is_lock : isLock
      };      
      baseCallApiHelper.callApi(
        "Lock Image",
        null,
        api.event.lockImage.method,
        api.event.lockImage.url, 
        data, 
        (status, data, message) => {
          if(status){
              this.processGetEventImageList();
          }
        }, 
        true, 
        true,
        true
      );
    },

    toggleModalListEventImage: function () {
      if (this.showModalListEventImage) {
        this.showModalListEventImage = false;
      } else {
        this.pageImageEvent = this.pageImageEvent + 1;
        const data = {
            event_id : this.fieldForm.id.value,
            order_by : "created_on desc",
            page     : this.pageImageEvent,
            data_per_page : 16
        };      
        baseCallApiHelper.callApi(
          "Get List Image Event",
          null,
          api.event.listImageEvent.method,
          api.event.listImageEvent.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.showModalListEventImage = true;
              this.listImageEvent = data.data;
            }
          }, 
          true, 
          true,
          true
        );
      }
    },
    processSearchFirstEventImage: function() {
        this.pageImageEvent = 1;
        const data = {
            event_id : this.fieldForm.id.value,
            order_by : "created_on desc",
            page     : this.pageImageEvent,
            data_per_page : 16
        };   
        if (this.searchEventImage !== "") {
          data.filter = "title like '%"+ this.searchEventImage +"%'";
        }

        baseCallApiHelper.callApi(
          "Get List Image Event",
          null,
          api.event.listImageEvent.method,
          api.event.listImageEvent.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.listImageEvent = data.data;
            }
          }, 
          true, 
          true,
          true
        );
    },
    processLoadMoreEventImage: function() {
        this.pageImageEvent = this.pageImageEvent + 1;
        const data = {
            event_id : this.fieldForm.id.value,
            order_by : "created_on desc",
            page     : this.pageImageEvent,
            data_per_page : 16
        };      
        if (this.searchEventImage !== "") {
          data.filter = "title like '%"+ this.searchEventImage +"%'";
        }

        baseCallApiHelper.callApi(
          "Get List Image Event",
          null,
          api.event.listImageEvent.method,
          api.event.listImageEvent.url,   
          data, 
          (status, data, message) => {
            if(status){
              var vm = this;
              data.data.forEach(function(row) {
                vm.listImageEvent.push(row);

              });
            }
          }, 
          true, 
          true,
          true
        );
    },
    processChooseImageEvent: function(item) {
      var itemIndex = this.listImageEvent.find(e => e.id === item.id)['is_select'];
      if (typeof(itemIndex) === 'undefined' || itemIndex === false) {
        this.listImageEvent.find(e => e.id === item.id)['is_select'] = true;
      } else {
        this.listImageEvent.find(e => e.id === item.id)['is_select'] = false;
      }
       this.showModalListEventImage = false;

        this.$nextTick(() => {

          // Add the component back in
          this.showModalListEventImage = true;
        });
    },
    processSaveEventImage: function() {
      var listImageSelected = this.listImageEvent.filter(e => e.is_select === true).map(e => e.id);
      if (listImageSelected.length > 0) {

        const data = {
          event_id : this.fieldForm.id.value,
          array_event_image : listImageSelected
        };      

        baseCallApiHelper.callApi(
          "Create event image",
          null,
          api.event.createEventImage.method,
          api.event.createEventImage.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.processGetEventImageList();
              this.showModalListEventImage = false;

            }
          }, 
          true, 
          true,
          true
        );
      }
    },

    processFromExternalLinkImage: function() {
      if (this.fieldFromExternalLinkImage.external_link.value !== '') {

        const data = {
          event_id : this.fieldForm.id.value,
          external_link : this.fieldFromExternalLinkImage.external_link.value
        };      

        baseCallApiHelper.callApi(
          "Create event image",
          null,
          api.event.createEventImage.method,
          api.event.createEventImage.url,  
          data, 
          (status, data, message) => {
            if(status){
              this.processGetEventImageList();
              this.fieldFromExternalLinkImage.external_link.value = "";
            }
          }, 
          true, 
          true,
          true
        );
      }
    },    
    imageOrderChange: function(event, item) {
      this.listEventImage.find(e => parseInt(e.order) == parseInt(event.target.value))['order'] = parseInt(this.listEventImage.find(e => e.id == item.id)['order']);
      this.listEventImage.find(e => e.id == item.id)['order'] = parseInt(event.target.value);
      this.listEventImage.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
      this.renderFormUploadEventImage = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderFormUploadEventImage = true;
      });
    },
    processSaveOrderImage: function(e) {
      if (this.listEventImage.length > 0) {

        const data = {
          event_id : this.fieldForm.id.value,
          array_event_image : this.listEventImage
        };

        baseCallApiHelper.callApi(
          "Update event image order",
          null,
          api.event.updateEventImageOrder.method,
          api.event.updateEventImageOrder.url,  
          data, 
          (status, data, message) => {
            if(status){

            }
          }, 
          true, 
          true,
          true
        );
        

      }
    },

    processGetVisitorEventList: function() {
        const data = {
          // select : globalFunctions.mapFields(this.fields),
          event_id: this.$route.params.id,
          filter : "",
          // order_by : "created_on desc", // always include 'created_on desc' for grab the new data from database
          page: this.tableVisitorEventAttendance.pageDataBase,
          data_per_page: 100000 // set 100000 record per request for perfomance
        };

        baseCallApiHelper.callApi(
          "Get Visitor Event list",
          null,
          api.event.listvisitorevent.method,
          api.event.listvisitorevent.url, 
          data, 
          (status, data, message) => {
            if(status) {
              (data.from === 1 || data.from === null) ? this.tableVisitorEventAttendance.isNeedPrevious100k = false : this.tableVisitorEventAttendance.isNeedPrevious100k = true;
              (data.to === data.total || data.total === 0) ? this.tableVisitorEventAttendance.isNeedNext100k = false : this.tableVisitorEventAttendance.isNeedNext100k = true;             
              var listItems = this.tableVisitorEventAttendance.listItems = data.data.map((item) => { return {...item}});

              this.tableVisitorEventAttendance.listItemsTemp = JSON.parse(JSON.stringify(this.tableVisitorEventAttendance.listItems));
              this.countVisitor = listItems.length;
              this.tableVisitorEventAttendance.countPresence = listItems.filter
                          (t => t.presence === 1).length;
              this.tableVisitorEventAttendance.countPresenceSync = listItems.filter
                          (t => t.presence_sync === 1).length;
              this.tableVisitorEventAttendance.countGetLink = listItems.filter
                          (t => t.action_get_link === 1).length;

            } else {
              this.tableVisitorEventAttendance.listItems = [];
            }
          }, 
          false, 
          true,
          true
        );
    
    },
    processGetCountVisitorEventList: function() {
      const data = {
        // select : globalFunctions.mapFields(this.fields),
        event_id: this.$route.params.id,
        filter : "",
        // order_by : "created_on desc", // always include 'created_on desc' for grab the new data from database
        page: this.tableVisitorEventAttendance.pageDataBase,
        data_per_page: 100000 // set 100000 record per request for perfomance
      };

      baseCallApiHelper.callApi(
        "Get Visitor Event list",
        null,
        api.event.listvisitorevent.method,
        api.event.listvisitorevent.url, 
        data, 
        (status, data, message) => {
          if(status) {
            var listItems = data.data.map((item) => { return {...item}});
            this.countVisitor = listItems.length;
            this.tableVisitorEventAttendance.countPresence = listItems.filter
                        (t => t.presence === 1).length;
            this.tableVisitorEventAttendance.countPresenceSync = listItems.filter
                        (t => t.presence_sync === 1).length;
            this.tableVisitorEventAttendance.countGetLink = listItems.filter
                        (t => t.action_get_link === 1).length;
          }
        }, 
        false, 
        true,
        true
      );
    
    },
    processCheckBulkAttendance: function(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;

        this.nameFileBulkAttendance = files[0].name;

        var reader = new FileReader();

        reader.onload = (e) => {
          var dataList = e.target.result.split(/\r\n|\r|\n/);
          if (e.target.result.trim() === '' || dataList.length <= 0) {
            this.infoProcessBulkAttendance = "Format data is wrong !!"
          } else {
            var vm = this;
            var countSync = 0;
            var countNotSync = 0;
            dataList.forEach(function(row, index) {
                if (row.trim() !== '') {
                  var data = row.split(",");
                  var index = null;
                  index = vm.tableVisitorEventAttendance.listItems.findIndex(x => x['visitor_id.email'] == data[1]);
                  if (index >= 0) {
                    vm.tableVisitorEventAttendance.listItems[index]['presence'] = 1;
                    vm.tableVisitorEventAttendance.listItems[index]['presence_sync'] = 1;


                    if (data[2].trim() !== '') {
                      vm.tableVisitorEventAttendance.listItems[index]['join_time'] = moment(data[2]).format('YYYY-MM-DD HH:mm:ss');
                      vm.tableVisitorEventAttendance.listItems[index]['join_time_show'] = moment(data[2]).format('HH:mm:ss');
                    }

                    if (data[3].trim() !== '') {
                      vm.tableVisitorEventAttendance.listItems[index]['leave_time'] = moment(data[3]).format('YYYY-MM-DD HH:mm:ss');
                      vm.tableVisitorEventAttendance.listItems[index]['join_time_show'] = moment(data[3]).format('HH:mm:ss');
                    }
                    vm.tableVisitorEventAttendance.listItems[index]['minutes_duration'] = data[4];

                    countSync++;
                  } else {
                    countNotSync++;
                  }
                }
            });           
            this.infoProcessBulkAttendance = "Success Sync : " + countSync + "; Not Found Email : " + countNotSync +
                                          "<br> You can check the table below, before execute !! ";
            if(countSync > 0) {
              this.showSaveBulkAttendance = 1;

              var listItems = this.tableVisitorEventAttendance.listItems;

              this.countVisitor = listItems.length;
              this.tableVisitorEventAttendance.countPresence = listItems.filter
                          (t => t.presence === 1).length;
              this.tableVisitorEventAttendance.countPresenceSync = listItems.filter
                          (t => t.presence_sync === 1).length;

            }         
          }
        };
        reader.readAsText(files[0]);
    },
    processJoinTimeDuration: function(item) {
      if (item.leave_time == '' || item.leave_time == null || item.leave_time.toLowerCase == 'null'
          || item.join_time == '' || item.join_time == null || item.leave_time.join_time == 'null') {
        item.minutes_duration = 0;
      } else {
        var duration = moment.duration(moment(item.leave_time).diff(moment(item.join_time)));
        item.minutes_duration = duration.asMinutes();

        if (item.minutes_duration > 0 ){
          item.presence = 1;

          var listItems = this.tableVisitorEventAttendance.listItems;

          this.countVisitor = listItems.length;
          this.tableVisitorEventAttendance.countPresence = listItems.filter
                      (t => t.presence === 1).length;
          this.tableVisitorEventAttendance.countPresenceSync = listItems.filter
                      (t => t.presence_sync === 1).length;

        }
      }
    },
    focusDatetimeAttendance: function(item) {
      item.leave_time = item['event_id.event_end'];
    },
    processSaveAttendance: function(item) {
      this.showSaveBulkAttendance = 0;
      this.infoProcessBulkAttendance = "";
      if (item !== 'cancel') {
        if(this.tableVisitorEventAttendance.listItems.length > 0) {
            var index = this.tableVisitorEventAttendance.listItems.findIndex(x => x['minutes_duration'] < 0 );
            if (index >= 0) {
              alert("Duration cannot be minus, please check the table !!");
              return false;
            }

          const data = {
            event_id: this.$route.params.id,
            list_attendance : this.tableVisitorEventAttendance.listItems
          };

          baseCallApiHelper.callApi(
            "Get Update Attendace",
            null,
            api.event.updateattendance.method,
            api.event.updateattendance.url, 
            data, 
            (status, data, message) => {
              if(status) {
                this.processGetVisitorEventList();
              }
            }, 
            true, 
            true,
            true
          );
        }
      } else {
        this.tableVisitorEventAttendance.listItems = JSON.parse(JSON.stringify(this.tableVisitorEventAttendance.listItemsTemp));

        var listItems = this.tableVisitorEventAttendance.listItems;
        this.countVisitor = listItems.length;
        this.tableVisitorEventAttendance.countPresence = listItems.filter
                    (t => t.presence === 1).length;
        this.tableVisitorEventAttendance.countPresenceSync = listItems.filter
                    (t => t.presence_sync === 1).length;
        this.tableVisitorEventAttendance.countGetLink = listItems.filter
                    (t => t.action_get_link === 1).length;
      }

    },
    processDownloadAttendanceCsv: function() {

      let csvContent = "data:text/csv;charset=utf-8,";

      const includeToCsv = ["action_get_link", "presence", "presence_sync", "join_time",
            "leave_time", "minutes_duration", 

            "visitor_id","visitor_id.name", "visitor_id.email", "visitor_id.phone_number",
            "visitor_id.is_active", "visitor_id.birth_date", "visitor_id.gender",

            "event_id","event_id.name", "event_id.event_type", "event_id.member_type",
            "event_id.event_start", "event_id.event_end"];

      var vm = this;
      var firstStep = 0;
      this.tableVisitorEventAttendance.listItems.forEach(function(rowArray) {
          let rowHeader = "";
          let row = "";
          for (const property in rowArray) {
            
            if (rowArray[property] === null || rowArray[property] === "") {
              rowArray[property] = '-';
            } else if (rowArray[property].toString().toLowerCase() === 'null') {
              rowArray[property] = '-';
            }
            
            if (includeToCsv.findIndex(x => x == property.toLowerCase()) >= 0 ) {
              if (row == "") {
                row = rowArray[property];
                rowHeader = property;
              } else {
                row = row + "," + rowArray[property];
                rowHeader = rowHeader + "," + property;
              }
            }


          };
          // let row = rowArray.join(",");
          if (firstStep == 0) {
            csvContent += rowHeader + "\r\n";
            firstStep++;
          }

          csvContent += row + "\r\n";
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", vm.fieldForm.name.value + "_attendance.csv");
      document.body.appendChild(link); // Required for FF

      link.click();      
      
    }

  }
}

</script>
