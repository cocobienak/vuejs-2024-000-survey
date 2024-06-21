import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// Containers
  const TheContainer = () => import('@/containers/TheContainer')

// Login && Register
  const Login = () => import('@/views/pages/Login')
  const Register = () => import('@/views/pages/Register')
  const ActivationVisitor = () => import('@/views/pages/ActivationVisitor')
  const ResetPasswordVisitor = () => import('@/views/pages/ResetPasswordVisitor')
  const DirectLogin =() => import('@/views/pages/DirectLogin')

// Form Survey  
  const Form = () => import('@/views/pages/Form')

// Views
  const Dashboard = () => import('@/views/home/Dashboard')

  const AuthorInterviewForm = () => import('@/views/author_interview/Form')
  const AuthorInterviewList = () => import('@/views/author_interview/List')

  const ConfigurationForm = () => import('@/views/configuration/Form')
  const ConfigurationList = () => import('@/views/configuration/List')

  const DegreeForm = () => import('@/views/degree/Form')
  const DegreeList = () => import('@/views/degree/List')

  const DomainForm = () => import('@/views/domain/Form')
  const DomainList = () => import('@/views/domain/List')

  const DomainGroupForm = () => import('@/views/domain_group/Form')
  const DomainGroupList = () => import('@/views/domain_group/List')

  const DomainMessageForm  = () => import('@/views/domain_message/Form')
  const DomainMessageList = () => import('@/views/domain_message/List')

  const DomainMessageStoriesForm  = () => import('@/views/domain_message_stories/Form')
  const DomainMessageStoriesList = () => import('@/views/domain_message_stories/List')

  const EditorialLetterForm = () => import('@/views/editorial_letter/Form')
  const EditorialLetterList = () => import('@/views/editorial_letter/List')

  const EventForm = () => import('@/views/event/Form')
  const EventList = () => import('@/views/event/List')

  const EventCategoryForm = () => import('@/views/event_category/Form')
  const EventCategoryList = () => import('@/views/event_category/List')

  const FormSurveyForm = () => import('@/views/form_survey/Form')
  const FormSurveyList = () => import('@/views/form_survey/List')

  const ModuleForm = () => import('@/views/module/Form')
  const ModuleList = () => import('@/views/module/List')

  const PermissionForm = () => import('@/views/permission/Form')
  const PermissionList = () => import('@/views/permission/List')

  const RoleForm = () => import('@/views/role/Form')
  const RoleList = () => import('@/views/role/List')

  const SpeakerForm = () => import('@/views/speaker/Form')
  const SpeakerList = () => import('@/views/speaker/List')
  
  const StoriesForm = () => import('@/views/stories/Form')
  const StoriesList = () => import('@/views/stories/List')

  const StoriesAuthorForm = () => import('@/views/stories_author/Form')
  const StoriesAuthorList = () => import('@/views/stories_author/List')

  const StoriesGenreForm = () => import('@/views/stories_genre/Form')
  const StoriesGenreList = () => import('@/views/stories_genre/List')

  const SystemUserForm = () => import('@/views/system_user/Form')
  const SystemUserList = () => import('@/views/system_user/List')

  const VisitorForm = () => import('@/views/visitor/Form')
  const VisitorList = () => import('@/views/visitor/List')  

// Views - Pages
  const Page404 = () => import('@/views/pages/Page404')
  const Page500 = () => import('@/views/pages/Page500')



Vue.use(Router)


const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  // Deployment & Installment
  
  // // Beta
  // base: '/survey-manage/',
  // // Local
  base: '/',

  // // For Event
  // base: '/manage/',
  
  // // For Sanctuary
  // base: '/sanctuary-manage/',
  
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({ x:0, y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
  //Login
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },

  //Register
    {
      path: '/register',
      name: 'Register',
      component: Register,
      beforeEnter: ifNotAuthenticated
    },

  //Activation Visitor  
    {
      path: '/activation/visitor',
      name: 'activation-visitor',
      component: ActivationVisitor,
    },

  //Form Survey  
  {
    path: '/form',
    name: 'form',
    component: Form,
  },    

  //Forgot Password  
    {
      path: '/forgot-password/visitor',
      name: 'forgot-password-visitor',
      component: ResetPasswordVisitor,
    },

  //Direct Login  
    {
      path: '/direct-login',
      name: 'direct-login',
      component: DirectLogin,
    },  

  // Dashboard
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          beforeEnter: ifAuthenticated
        }  
      ]
    },

  // Author Interview  
    {
      path: '/author-interview',
      redirect: '/author-interview/list',
      name: 'Author-Interview',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Author-Interview-List',
          component: AuthorInterviewList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Author-Interview-Form-edit',
          component: AuthorInterviewForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Author-Interview-Form-add',
          component: AuthorInterviewForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },  

  // Configuration
    {
      path: '/configuration',
      redirect: '/configuration/list',
      name: 'Configuration',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Configuration-List',
          component: ConfigurationList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Configuration-Form-edit',
          component: ConfigurationForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Configuration-Form-add',
          component: ConfigurationForm,
          beforeEnter: ifAuthenticated
        },        
      ]
    },

  // Degree
    {
      path: '/degree',
      redirect: '/degree/list',
      name: 'Degree',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'degree-List',
          component: DegreeList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'degree-Form-edit',
          component: DegreeForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'degree-Form-add',
          component: DegreeForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    },

  // Domain
    {
      path: '/domain',
      redirect: '/domain/list',
      name: 'Domain',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'domain-List',
          component: DomainList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'domain-Form-edit',
          component: DomainForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'domain-Form-add',
          component: DomainForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    },    

  // Domain Group
    {
      path: '/domain-group',
      redirect: '/domain-group/list',
      name: 'Domain-Group',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'domain-group-List',
          component: DomainGroupList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'domain-group-Form-edit',
          component: DomainGroupForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'domain-group-Form-add',
          component: DomainGroupForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    },

  // Domain Message
    {
      path: '/domain-message',
      redirect: '/domain-message/list',
      name: 'Domain-Message',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'domain-message-List',
          component: DomainMessageList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'domain-message-Form-edit',
          component: DomainMessageForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'domain-message-Form-add',
          component: DomainMessageForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    },    

  // Domain Message Stories
    {
      path: '/domain-message-stories',
      redirect: '/domain-message-stories/list',
      name: 'Domain-Message-Stories',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'domain-message-stories-List',
          component: DomainMessageStoriesList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'domain-message-stories-Form-edit',
          component: DomainMessageStoriesForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'domain-message-stories-Form-add',
          component: DomainMessageStoriesForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    }, 

  // Editorial Letter  
    {
      path: '/editorial-letter',
      redirect: '/editorial-letter/list',
      name: 'Editorial-Letter',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Editorial-Letter-List',
          component: EditorialLetterList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Editorial-Letter-Form-edit',
          component: EditorialLetterForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Editorial-Letter-Form-add',
          component: EditorialLetterForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },     

  // Event  
    {
      path: '/event',
      redirect: '/event/list',
      name: 'Event',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Event-List',
          component: EventList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Event-Form-edit',
          component: EventForm,
          beforeEnter: ifAuthenticated
        },  
        {
          path: 'summary/:id',
          name: 'Event-Form-summary',
          component: EventForm,
          beforeEnter: ifAuthenticated
        }, 
        {
          path: 'attendance/:id',
          name: 'Event-Form-attendance',
          component: EventForm,
          beforeEnter: ifAuthenticated
        },                       
        {
          path: 'add',
          name: 'Event-Form-add',
          component: EventForm,
          beforeEnter: ifAuthenticated
        },        
      ]
    },    

  // Event Category  
    {
      path: '/event-category',
      redirect: '/event-category/list',
      name: 'Event-Category',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Event-Category-List',
          component: EventCategoryList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Event-Category-Form-edit',
          component: EventCategoryForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Event-Category-Form-add',
          component: EventCategoryForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },

  // Form Survey  
    {
      path: '/form-survey',
      redirect: '/form-survey/list',
      name: 'Form-Survey',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Form-Survey-List',
          component: FormSurveyList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Form-Survey-Form-edit',
          component: FormSurveyForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Form-Survey-Form-add',
          component: FormSurveyForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },      
    
  // Module
    {
      path: '/module',
      redirect: '/module/list',
      name: 'Module',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Module-List',
          component: ModuleList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Module-Form-edit',
          component: ModuleForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Module-Form-add',
          component: ModuleForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },

  // Permission
    {
      path: '/permission',
      redirect: '/permission/list',
      name: 'Permission',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Permission-List',
          component: PermissionList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Permission-Form-edit',
          component: PermissionForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Permission-Form-add',
          component: PermissionForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },

  // Role     
    {
      path: '/role',
      redirect: '/role/list',
      name: 'Role',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Role-List',
          component: RoleList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Role-Form-edit',
          component: RoleForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Role-Form-add',
          component: RoleForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    }, 

  // Stories  
    {
      path: '/stories',
      redirect: '/stories/list',
      name: 'Stories',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Stories-List',
          component: StoriesList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Stories-Form-edit',
          component: StoriesForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Stories-Form-add',
          component: StoriesForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    }, 

  // Stories Author  
    {
      path: '/stories-author',
      redirect: '/stories-author/list',
      name: 'Stories-Author',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Stories-Author-List',
          component: StoriesAuthorList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Stories-Author-Form-edit',
          component: StoriesAuthorForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Stories-Author-Form-add',
          component: StoriesAuthorForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },    

  // Stories Genre  
    {
      path: '/stories-genre',
      redirect: '/stories-genre/list',
      name: 'Stories-Genre',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Stories-Genre-List',
          component: StoriesGenreList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Stories-Genre-Form-edit',
          component: StoriesGenreForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Stories-Genre-Form-add',
          component: StoriesGenreForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    },    

  // System User     
    {
      path: '/system-user',
      redirect: '/system-user/list',
      name: 'System-User',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'System-User-List',
          component: SystemUserList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'System-User-Form-edit',
          component: SystemUserForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit-self/:id',
          name: 'System-User-Form-edit-self',
          component: SystemUserForm,
          beforeEnter: ifAuthenticated
        },         
        {
          path: 'add',
          name: 'System-User-Form-add',
          component: SystemUserForm,
          beforeEnter: ifAuthenticated
        },      
      ]
    }, 

  // Speaker
    {
      path: '/speaker',
      redirect: '/speaker/list',
      name: 'Speaker',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'speaker-List',
          component: SpeakerList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'speaker-Form-edit',
          component: SpeakerForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'speaker-Form-add',
          component: SpeakerForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    },

  // Visitor     
    {
      path: '/visitor',
      redirect: '/visitor/list',
      name: 'Visitor',
      component: TheContainer,
      children: [
        {
          path: 'list',
          name: 'Visitor-List',
          component: VisitorList,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'edit/:id',
          name: 'Visitor-Form-edit',
          component: VisitorForm,
          beforeEnter: ifAuthenticated
        },
        {
          path: 'add',
          name: 'Visitor-Form-add',
          component: VisitorForm,
          beforeEnter: ifAuthenticated
        },       
      ]
    }, 
    
  // Another Page
    {
      path: '/*',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        }
      ]
    }
  ]
}

