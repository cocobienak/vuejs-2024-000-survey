<template>
  <div class="section-dashboard">
    <div class="row-adt row-1">
      <div class="card-adt card-1">
        <div class="figure">
          <div class="guard-vertical-middle">
            <picture>
              <img 
                :src="dataDomain.avatar_path" 
                :alt="dataDomain.name">
            </picture>
          </div>
        </div>
        <div class="detail">
          <div class="guard-vertical-middle">
            <div class="name">{{dataDomain.name}}</div>
            <div class="email">{{dataDomain.email}}</div>    
            <!-- <div v-if="activesystemUserDomainId !== '0'">               
              <a style="cursor:pointer; color:#F3931B;" v-on:click="$router.push({ path: `/domain/edit/${activesystemUserDomainId}` })" >Edit Domain</a>       
            </div>         -->
          </div>
        </div>
      </div>
      <div class="card-adt card-2">
        <div class="title" v-if="showDashboardEvent">CREATE EVENT</div>
        <div class="quote">{{dataDomain.description_text}}</div>
        <div class="tools" v-if="showDashboardEvent">                      
          <CButton class="btn-create-event" type="submit" color="warning" @click="$router.push({path: '/event/add'})">Add</CButton>
        </div>
      </div>
    </div>
    <div class="row-adt row-2" v-if="showDashboardEvent">
      <div class="card-adt card-1">
        <div class="headline-ongoing-event headline-event">
          <div class="title">ONGOING EVENT</div>
          <div class="circle-count">
            <div class="guard-vertical-middle">
              <div class="total">{{countListEventOngoing}}</div>
              <div class="title">EVENT</div>
            </div>
          </div>

          <div class="tools">                      
            <a class="view-all" v-on:click="$router.push({ path: `/event/list` })">View All ></a>
          </div>
        </div>
        <div class="list-ongoing-event">
          <VueSlickCarousel v-bind="cfCarOnggoingEvent" class="guard-carousel" v-if="listEventOngoing.length > 0">
            <div class="card-carousel" v-for="eventOngoing in listEventOngoing" :key="eventOngoing.id">
              <div class="head-image">
                <picture>
                  <img :src="eventOngoing['banner_image_id.url_public']" :alt="eventOngoing.name">
                </picture>
              </div>
              <div class="guard-detail">
                <div class="title-event">{{eventOngoing.name}}</div>
                <div class="date-event">{{(eventOngoing.event_start !== null) ? moment(eventOngoing.event_start).format('LLLL') : '-'}}</div>
                <div class="detail-event"></div>
                <div class="tools-event">
                  <CButton class="btn-edit-event" type="submit" color="warning" 
                    @click="$router.push({ path: `/event/edit/${eventOngoing.id}` })">edit</CButton>
                </div>                
              </div>
            </div> 
                                     
          </VueSlickCarousel>
        </div>
      </div>
    </div>
    <div class="row-adt row-3" v-if="showDashboardEvent">
      <div class="card-adt card-1">
        <div class="headline-event">
          <div class="title">MY EVENT</div>
          <div class="circle-count">
            <div class="guard-vertical-middle">
              <div class="total">{{countListEvent}}</div>
              <div class="title">EVENT</div>
            </div>
          </div>
        </div>
        <div class="list-event">
          <div class="row-event">          
          </div>
          <div class="row-event" v-for="event in listEvent.slice(0, 5)" :key="event.id">
              <div class="guard-detail">
                <div class="title-event">{{event.name}}</div>
                <div class="date-event">{{(event.event_start !== null) ? moment(event.event_start).format('LLLL') : '-'}}</div>
              </div>   
              <div class="tools-event">
                <div class="guard-tools">
                  <CButton class="btn-edit-event" type="submit" color="warning" 
                    @click="$router.push({ path: `/event/edit/${event.id}` })">edit</CButton>
                </div>
              </div>           
          </div>                 
        </div>
        <div class="tools">                      
            <a class="view-all" v-on:click="$router.push({ path: `/event/list` })">View All ></a>
        </div>
      </div>
      <div class="card-adt card-2">
        <div class="headline-event">
          <div class="title">HISTORY EVENT</div>
          <div class="circle-count">
            <div class="guard-vertical-middle">
              <div class="total">{{countListEventPast}}</div>
              <div class="title">EVENT</div>
            </div>
          </div>
        </div>
        <div class="list-event">
          <div class="row-event">          
          </div>
          <div class="row-event" v-for="eventPast in listEventPast.slice(0, 5)" :key="eventPast.id">
              <div class="guard-detail">
                <div class="title-event">{{eventPast.name}}</div>
                <div class="date-event">{{(eventPast.event_start !== null) ? moment(eventPast.event_start).format('LLLL') : '-'}}</div>
              </div>   
              <div class="tools-event">
                <div class="guard-tools">
                  <CButton class="btn-edit-event" type="submit" color="warning" 
                    @click="$router.push({ path: `/event/summary/${eventPast.id}` })">Summary</CButton>
                </div>
              </div>          
          </div>                
        </div>
        <div class="tools">                      
            <a class="view-all" v-on:click="$router.push({ path: `/event/list` })">View All ></a>
        </div>             
      </div>
    </div>

  </div>
</template>


<style lang="scss">
  .section-dashboard{
    padding: 0px 24px 24px 24px;
              
    .btn-warning {
      background-color: #F3931B !important;
    }

    .btn-warning:hover {
      background-color: #a8620c !important;
    }

    .row-adt {
      display: block;

      @media (min-width: 800px) {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

    }

    .card-adt {
      background: #fff;
      display: block;
      padding: 24px;
      border-radius: 6px;
      margin-bottom: 32px;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.16);
    }
    
    .guard-vertical-middle {
      vertical-align: middle;
      display: table-cell;
    }

    .circle-count {
      margin: 0 auto;
      background: rgba(136,56,143,0.10);
      width: 180px;
      height: 180px;
      display: table;
      border-radius: 100%;
      text-align: center;
      margin-top: 24px;

      .total {
        font-size: 64px;
        color: #88388F;
        letter-spacing: 0;
        text-align: center;
        line-height: 72px;
      }

      .title {
        font-size: 21px;
        color: #88388F;
        letter-spacing: 0;
        text-align: center;        
      }
    }

    .tools {
      margin-top: 32px;
      text-align: center;
      .view-all{
        font-size: 16px;
        color: #F18700;
        letter-spacing: 0;
        text-align: right; 
        cursor: pointer;             
      }
    }

    .headline-event{
      padding: 0px 35px;
      text-align: center;
      margin-bottom: 32px;

      .title{
        font-size: 21px;
        color: #5E5E5E;
        letter-spacing: 0;
        text-align: center;
        line-height: 38px;            
      }
    } 

    .title-event{
      font-size: 16px;
      font-weight: 400;
      height: 48px;
      color: #5E5E5E;
      letter-spacing: 0;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;                            
    }

    .date-event{
      margin-top: 8px;
      font-size: 14px;
      color: rgba(94,94,94,0.60);
      letter-spacing: 0;              
    }

    .detail-event{
      height: 55px;
      font-size: 14px;
      color: rgba(94,94,94,0.60);
      letter-spacing: 0;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;                 
    }

    .tools-event{
      text-align: center;    
      .btn-edit-event{
        width: 75%;
        color: #fff !important;
        border-radius: 22px !important;
      }  
    }
    

    .row-1{
      .card-1{
        background-image: linear-gradient(180deg, #88388F 1%, #56175D 100%);
        width: 100%;
        display: block;

        @media (min-width: 380px) {
          display: flex;
        }

        @media (min-width: 800px) {
          width: 61%;
        }

        .figure {
          display: table;

        @media (max-width: 380px) {
          margin: 0 auto;
        }

          picture {
            display: inline-block;
            width: 120px;
            height: 120px;
            overflow: hidden;
            background-color: #fff;
            -webkit-border-radius: 100%;
            -moz-border-radius: 100%;
            -ms-border-radius: 100%;
            -o-border-radius: 100%;
            border-radius: 100%;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }

        .detail {
          margin-left: 32px;
          display: table;

          .name{
            font-size: 26px;
            color: #FFFFFF;
            letter-spacing: 0;
          }

          .email{
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;            
          }
        }

      }
      .card-2{
        background-image: linear-gradient(180deg, #88388F 1%, #56175D 100%);
        width: 100%;
        @media (min-width: 800px) {
          width: 37%;
        }

        .title {
          margin: 0 auto;
          font-size: 21px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          line-height: 38px;
        }

        .quote {
          font-size: 16px;
          color: rgba(255,255,255,0.60);
          letter-spacing: 0;
          text-align: center;
          line-height: 24px;          
        }

        .tools{
          margin-top: 22px;
          text-align: center;
          .btn-create-event{
            width: 120px;
            color: #fff !important;
            border-radius: 22px !important;
          }
        }

      }
    }

    .row-2{      
      .card-1{
        display: block;
        width: 100%;

        @media (min-width: 1189px) {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .headline-ongoing-event{

          @media (min-width: 1189px) {
            border-right: 1px solid #c5c5c5;
            margin-bottom: 0px;
          }

        }

        .list-ongoing-event{
          flex: none;
          width: 100%;
          padding: 0px 35px;

          @media (min-width: 1189px) {
            width: 70%;
          }  
          
          @media (min-width: 1400px) {
            width: 76%;
          } 
          
          @media (min-width: 1610px) {
            width: 80%;
          }          

          .guard-carousel {
            display: block;
          }

          .slick-slide{
            padding:0px 12px;
            width: 250px;
            height: 324px;
          }

          .slick-prev, .slick-next {
            z-index: 9;
          }

          .slick-next{
            right: 5px !important;
          }

          .slick-prev:before, .slick-next:before {
            font-size: 50px !important;
            color: #88388F !important; 
            opacity: 0.5 !important;         
          }

          .card-carousel{
            width: 250px;
            height: 324px;
            border-radius: 6px;
            background: #F7F7F7;
          }

          .head-image {
            picture {
              border-radius: 6px 6px 0px 0px;
              display: inline-block;
              width: 100%;
              height: 100px;
              overflow: hidden;
              background-color: #fff;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }           
          }

          .guard-detail{
            padding: 16px;
          }
        }
      }
    }

    .row-3 {
      .card-1, .card-2 {
        width: 100%;



        .list-event {
          .row-event {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 14px 0px;
            border-bottom: 1px solid #c5c5c5;

            .guard-detail{
              width: 74%;
            }

            .tools-event {
              display: table;
              width: 25%;
              .guard-tools {
                display: table-cell;
                vertical-align: bottom;

              }
            }
          }
        }

      }

      @media (min-width: 800px) {
        .card-1 {
          width: 49.5%;
        }
        .card-2 {
          width: 49.5%;
        }        
      }


     
    }

  }
</style>

<script>
import router from '../../router';
import store from '../../store';

import moment from "moment";
import { api } from '../../configurations/services';
import globalFunctions from '../../helpers/globalFunctions';
import baseCallApiHelper from '../../helpers/baseCallApi';

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'Dashboard',
  components: {
    VueSlickCarousel 
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
      activesystemUserDomainId : localStorage.getItem('systemUserDomainId'),
      createdBy : "-",
      createdOn : "-",
      modifiedBy : "-",
      modifiedOn : "-",
      cfCarOnggoingEvent : {
        "dots": true,
        "infinite": false,
        "speed": 500,
        "slidesToShow": 4,
        "slidesToScroll": 4,
        "initialSlide": 0,
         "autoplay": true,
        "responsive": [
          {
            "breakpoint": 1300,
            "settings": {
              "slidesToShow": 2,
              "slidesToScroll": 2,
              "infinite": true,
              "dots": true
            }
          },
          {
            "breakpoint": 600,
            "settings": {
              "slidesToShow": 1,
              "slidesToScroll": 1,
              "initialSlide": 0
            }
          }
        ]
      },

      dataDomain : {
        email : "",
        name : "",
        description_text : "",
        avatar_path: ""
      },
      listEventOngoing : [],
      countListEventOngoing : 0,

      listEvent : [],
      countListEvent : 0,

      listEventPast : [],
      countListEventPast : 0,   
      showDashboardEvent : false

    }
  },
  created () {


    if (this.activesystemUserDomainId !== '0') {
      this.processGetDomainDetail();

      var accessRole = localStorage.getItem('accessRoleMenu');
      accessRole = JSON.parse(accessRole);
      this.showDashboardEvent = false;
      if (accessRole !== null && typeof(accessRole) !== 'undefined') {
        for (let i = 0; i < accessRole.length; i++) {
          if (accessRole[i].code == 'event' && accessRole[i].allow == 1) {
            this.showDashboardEvent = true;
            break;
          }
        }
      }

      if (this.showDashboardEvent) {
        this.processGetEventListOngoing();
        this.processGetEventList();
        this.processGetEventListPast();
      }

    }
  },  
  methods: {
    processGetDomainDetail: function () {
      const data = {
      };
      baseCallApiHelper.callApi(
        "Get domain detail",
        null,
        api.domain.read.method,
        api.domain.read.url + '/' + this.activesystemUserDomainId, 
        data, 
        (status, data, message) => {
          if(status) {
            // this.fieldForm.id.value  = data.data.id;
            // this.fieldForm.code.value = data.data.code;
            // this.fieldForm.name.value = data.data.name;
            // this.fieldForm.email.value = data.data.email;
            // this.fieldForm.email_cc.value = data.data.email_cc;
            // this.fieldForm.phone_number.value = data.data.phone_number;
            // this.fieldForm.description_html.value = data.data.description_html;
            // this.fieldForm.avatar_path.value = this.fieldForm.avatar_path.tempValue = data.data.avatar_path;
            // this.fieldForm.link_web.value = data.data.link_web;

            this.dataDomain.name = data.data.name;
            this.dataDomain.email = data.data.email;
            this.dataDomain.description_text = data.data.description_text;
            this.dataDomain.avatar_path = data.data.avatar_path; 

          } else {
          }
        }, 
        true, 
        true,
        true
      );
    },
    processGetEventListOngoing: function () {
        const data = {
          is_form : true,
          filter : '(event_start > "' + moment().format('YYYY-MM-DD HH:mm:ss') + '" and (is_publish = 1 or is_publish_force = 1))',
          order_by : "event_start asc", // always include 'created_on desc' for grab the new data from database
          // page: 1,
          // data_per_page: 5          
        };

        baseCallApiHelper.callApi(
          "Get event  list",
          null,
          api.event.list.method,
          api.event.list.url, 
          data, 
          (status, data, message) => {
            if(status) {
              this.listEventOngoing = data.data.map((item) => { return {...item}});
              this.countListEventOngoing = this.listEventOngoing.length;
            } else {
            }
          }, 
          true, 
          true,
          true
        );
    },
    processGetEventList: function () {
        var data = {
          is_form : true,
          filter : '(is_publish = 1 or is_publish_force = 1)',
          order_by : "event_start asc", // always include 'created_on desc' for grab the new data from database
          page: 1,
          data_per_page: 5   
        };

        baseCallApiHelper.callApi(
          "Get event  list",
          null,
          api.event.list.method,
          api.event.list.url, 
          data, 
          (status, data, message) => {
            if(status) {
              this.listEvent = data.data.map((item) => { return {...item}});
              this.countListEvent = this.listEvent.length;

            } else {
            }
          }, 
          true, 
          true,
          true
        );

        data = {
          select: ['id'],
          is_form : true,
          filter : '(is_publish = 1 or is_publish_force = 1)',
          order_by : "event_start asc", // always include 'created_on desc' for grab the new data from database 
        };

        baseCallApiHelper.callApi(
          "Get event  list",
          null,
          api.event.list.method,
          api.event.list.url, 
          data, 
          (status, data, message) => {
            if(status) {
              this.countListEvent = data.data.length;

            } else {
            }
          }, 
          true, 
          true,
          true
        );

    },
    processGetEventListPast: function () {
        var data = {
          is_form : true,
          filter : '(event_start <= "' + moment().format('YYYY-MM-DD HH:mm:ss') + '"  and (is_publish = 1 or is_publish_force = 1))',
          order_by : "event_start asc", // always include 'created_on desc' for grab the new data from database
          page: 1,
          data_per_page: 5          
        };

        baseCallApiHelper.callApi(
          "Get event  list",
          null,
          api.event.list.method,
          api.event.list.url, 
          data, 
          (status, data, message) => {
            if(status) {
              this.listEventPast = data.data.map((item) => { return {...item}});
            } else {
            }
          }, 
          true, 
          true,
          true
        );

        data = {
          select: ['id'],
          is_form : true,
          filter : '(event_start <= "' + moment().format('YYYY-MM-DD HH:mm:ss') + '"  and (is_publish = 1 or is_publish_force = 1))',
          order_by : "event_start asc", // always include 'created_on desc' for grab the new data from database     
        };

        baseCallApiHelper.callApi(
          "Get event  list",
          null,
          api.event.list.method,
          api.event.list.url, 
          data, 
          (status, data, message) => {
            if(status) {
              this.countListEventPast = data.data.length;
            } else {
            }
          }, 
          true, 
          true,
          true
        );

    },
  }
}
</script>
