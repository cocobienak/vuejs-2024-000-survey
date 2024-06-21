<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <!-- <CIcon 
        class="c-sidebar-brand-full" 
        name="logo" 
        size="custom-size" 
        :height="40" 
        viewBox="0 0 400 106.31479736098021"
      />
      <CIcon 
        class="c-sidebar-brand-minimized" 
        name="logo" 
        size="custom-size" 
        :height="40" 
        viewBox="0 0 100 106.31479736098021"
      /> -->
    </CSidebarBrand>

    <CRenderFunction :contentToRender="computedSidebar" flat/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import { api } from '../configurations/services';
import baseCallApiHelper from '../helpers/baseCallApi';

export default {
  name: 'TheSidebar',
  data () {
    return {
      accessRole : null
    }
  },  
  mounted() {
   
  },
  methods: {

  },
  computed: {
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    },
    currentItems() {

      //sidebar items are not shown until role is known
      const nav_event = [
        {
          _name: 'CSidebarNavItem',
          name: 'Dashboard',
          code: 'dashboard',
          to: '/dashboard',
          icon: 'cil-speedometer',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Degree',
          code: 'degree',
          to: '/degree',
          icon: 'cil-school',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Speaker',
          code: 'speaker',
          to: '/speaker',
          icon: 'cil-voice-over-record',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        }, 
        {
          _name: 'CSidebarNavItem',
          name: 'Event Category',
          code: 'event_category',
          to: '/event-category',
          icon: 'cil-calendar-check',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },                           
        {
          _name: 'CSidebarNavItem',
          name: 'Event',
          code: 'event',
          to: '/event',
          icon: 'cil-calendar',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        }, 
        {
          _name: 'CSidebarNavItem',
          name: 'Event Message',
          code: 'domain_message',
          to: '/domain-message',
          icon: 'cil-comment-square',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },                     
        {
          _name: 'CSidebarNavItem',
          name: 'Visitor',
          code: 'visitor',
          to: '/visitor',
          icon: 'cil-people',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },      
        {
          _name: 'CSidebarNavDropdown',
          name: 'System Administrator',
          code: 'system_administrator',
          icon: 'cil-settings',
          items: [
            {
              name: 'Configuration',
              code: 'configuration',
              to: '/configuration'
            },             
            {
              name: 'Module',
              code: 'module',
              to: '/module'
            }, 
            {
              name: 'Permission',
              code: 'permission',
              to: '/permission'
            },
            {
              name: 'Domain',
              code: 'domain',
              to: '/domain'
            },              
            {
              name: 'Domain Group',
              code: 'domain_group',
              to: '/domain-group'
            },                                 
            {
              name: 'Role',
              code: 'role',
              to: '/role'
            },
            {
              name: 'System User',
              code: 'system_user',
              to: '/system-user'
            }
          ]
        }
      ];

      const nav_sanctuary = [
        {
          _name: 'CSidebarNavItem',
          name: 'Dashboard',
          code: 'dashboard',
          to: '/dashboard',
          icon: 'cil-speedometer',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Degree',
          code: 'degree',
          to: '/degree',
          icon: 'cil-school',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        }, 
        {
          _name: 'CSidebarNavItem',
          name: 'Stories Author',
          code: 'stories_author',
          to: '/stories-author',
          icon: 'cil-address-book',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },            
        {
          _name: 'CSidebarNavItem',
          name: 'Stories Genre',
          code: 'stories_genre',
          to: '/stories-genre',
          icon: 'cil-list-rich',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },
        {
          _name: 'CSidebarNavItem',
          name: 'Stories',
          code: 'stories',
          to: '/stories',
          icon: 'cil-book',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        }, 
        {
          _name: 'CSidebarNavItem',
          name: 'Stories Message',
          code: 'domain_message_stories',
          to: '/domain-message-stories',
          icon: 'cil-comment-square',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },         
        {
          _name: 'CSidebarNavItem',
          name: 'Author Interview',
          code: 'author_interview',
          to: '/author-interview',
          icon: 'cil-speak',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },           
        {
          _name: 'CSidebarNavItem',
          name: 'Editorial Letter',
          code: 'editorial_letter',
          to: '/editorial-letter',
          icon: 'cil-envelope-letter',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },                    
        {
          _name: 'CSidebarNavItem',
          name: 'Visitor',
          code: 'visitor',
          to: '/visitor',
          icon: 'cil-people',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },      
        {
          _name: 'CSidebarNavDropdown',
          name: 'System Administrator',
          code: 'system_administrator',
          icon: 'cil-settings',
          items: [
            {
              name: 'Configuration',
              code: 'configuration',
              to: '/configuration'
            },             
            {
              name: 'Module',
              code: 'module',
              to: '/module'
            }, 
            {
              name: 'Permission',
              code: 'permission',
              to: '/permission'
            },
            {
              name: 'Domain',
              code: 'domain',
              to: '/domain'
            },              
            {
              name: 'Domain Group',
              code: 'domain_group',
              to: '/domain-group'
            },                                 
            {
              name: 'Role',
              code: 'role',
              to: '/role'
            },
            {
              name: 'System User',
              code: 'system_user',
              to: '/system-user'
            }
          ]
        }
      ];

      const nav_survey = [
        {
          _name: 'CSidebarNavItem',
          name: 'Dashboard',
          code: 'dashboard',
          to: '/dashboard',
          icon: 'cil-speedometer',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },                 
        {
          _name: 'CSidebarNavItem',
          name: 'Form Survey',
          code: 'form_survey',
          to: '/form-survey',
          icon: 'cil-list-rich',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },                     
        {
          _name: 'CSidebarNavItem',
          name: 'Visitor',
          code: 'visitor',
          to: '/visitor',
          icon: 'cil-people',
          items: []
          // badge: {
          //   color: 'primary'
          // }
        },      
        {
          _name: 'CSidebarNavDropdown',
          name: 'System Administrator',
          code: 'system_administrator',
          icon: 'cil-settings',
          items: [
            {
              name: 'Configuration',
              code: 'configuration',
              to: '/configuration'
            },             
            {
              name: 'Module',
              code: 'module',
              to: '/module'
            }, 
            {
              name: 'Permission',
              code: 'permission',
              to: '/permission'
            },
            {
              name: 'Domain',
              code: 'domain',
              to: '/domain'
            },              
            {
              name: 'Domain Group',
              code: 'domain_group',
              to: '/domain-group'
            },                                 
            {
              name: 'Role',
              code: 'role',
              to: '/role'
            },
            {
              name: 'System User',
              code: 'system_user',
              to: '/system-user'
            }
          ]
        }
      ];

      // ubah 'nav' yang untuk dipakai
      const nav = nav_survey;

      var accessRole = localStorage.getItem('accessRoleMenu');
      accessRole = JSON.parse(accessRole);
      if (accessRole !== null && typeof(accessRole) !== 'undefined') {
        var navFilter = [];
        nav.forEach(function (item, index) {
          if (item.items.length > 0) {
            var itemItemsFil = [];
            item.items.forEach(function (item, index) {
              var check = false;
              for (let i = 0; i < accessRole.length; i++) {
                if (accessRole[i].code == item.code && accessRole[i].allow == 1) {
                  check = true;
                  break;
                }
              }
              if (check) {
                itemItemsFil.push(item);
              }             
            });
            if (itemItemsFil.length > 0) {

              item.items = itemItemsFil;

              navFilter.push(item);
            }
          } else {
              var check = false;
              for (let i = 0; i < accessRole.length; i++) {
                if ((accessRole[i].code == item.code && accessRole[i].allow == 1) || item.code =='dashboard') {
                  check = true;
                  break;
                }
              }
              if (check) {
                navFilter.push(item);
              } 
          }
        });

        return navFilter;

      } else {
        if (localStorage.getItem('oauthClientId') != 1 && localStorage.getItem('systemUserId') != 2) {
          

          var activeSystemUserDomain = localStorage.getItem('systemUserDomain');
          var navFilter = [];


          nav.forEach(function (item, index) {
            if (item.items.length > 0) {
              var itemItemsFil = item.items.filter(item => {
                  return item.code != 'permission' 
                    && item.code != 'module' 
                    && item.code != 'configuration' 
                    && (item.code != 'domain' || activeSystemUserDomain == 'master')
                    && (item.code != 'domain_group' || activeSystemUserDomain == 'master')
                });
              item.items = itemItemsFil;
              navFilter.push(item);
            } else {

              navFilter.push(item);
            }
          });

          return navFilter;
        } else {
          return nav;
        }
      }
    },
    computedSidebar() {
      return [
        {
          _name: "CSidebarNav",
          _children: this.currentItems
        }
      ];
    }

  }
}
</script>
