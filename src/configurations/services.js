// Deployment & Installment
const ENVIRONTMENT_URL = {
    LOCAL              : "http://localhost/apilumen-2023-000-survey/api/",
    BETA              : "https://beta.binus.ac.id/survey-rest/api/"

}

export const ENVIRONTMENT = ENVIRONTMENT_URL["LOCAL"];

export const apiPerfix = {
    author_interview: `${ENVIRONTMENT}authorinterview`,
    configuration: `${ENVIRONTMENT}configuration`,
    degree: `${ENVIRONTMENT}degree`,
    domain: `${ENVIRONTMENT}domain`, 
    domain_group: `${ENVIRONTMENT}domaingroup`,
    domain_message_stories: `${ENVIRONTMENT}domainmessagestories`,  
    editorial_letter: `${ENVIRONTMENT}editorialletter`,
    event: `${ENVIRONTMENT}event`,
    event_category: `${ENVIRONTMENT}eventcategory`,
    event_message: `${ENVIRONTMENT}eventmessage`,
    file: `${ENVIRONTMENT}file`,
    form_survey: `${ENVIRONTMENT}formsurvey`,
    respond_survey: `${ENVIRONTMENT}respondsurvey`,
    image: `${ENVIRONTMENT}image`,
    module: `${ENVIRONTMENT}module`,
    oauth_clients: `${ENVIRONTMENT}oauthclients`,
    permission: `${ENVIRONTMENT}permission`,
    role: `${ENVIRONTMENT}role`,
    speaker: `${ENVIRONTMENT}speaker`,
    stories: `${ENVIRONTMENT}stories`,
    stories_author: `${ENVIRONTMENT}storiesauthor`,
    stories_genre: `${ENVIRONTMENT}storiesgenre`,
    system_user: `${ENVIRONTMENT}systemuser`,
    visitor:`${ENVIRONTMENT}visitor`
}

export const api = {
// Must be sort by alphabet
    author_interview: {
        create              : {url:`${apiPerfix.author_interview}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.author_interview}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.author_interview}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.author_interview}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.author_interview}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.author_interview}/updatecode`, method: 'PATCH'},
        getcount            : {url:`${apiPerfix.author_interview}/getcount`, method: 'POST'},

        approvalunpublish       : {url:`${apiPerfix.author_interview}/approvalunpublish`, method: 'PATCH'},
        publish                 : {url:`${apiPerfix.author_interview}/publish`, method: 'PATCH'},
        publishdomain           : {url:`${apiPerfix.author_interview}/publishdomain`, method: 'PATCH'},
        publishshare            : {url:`${apiPerfix.author_interview}/publishshare`, method: 'PATCH'},

        updateshareauthorinterview        : {url:`${apiPerfix.author_interview}/updateshareauthorinterview`, method: 'PATCH'},

    },

    configuration: {
        create              : {url:`${apiPerfix.configuration}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.configuration}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.configuration}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.configuration}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.configuration}/delete`, method: 'DELETE'},
    },

    degree: {
        create                  : {url:`${apiPerfix.degree}/create`, method: 'PUT'},
        read                    : {url:`${apiPerfix.degree}/read`, method: 'GET'},
        update                  : {url:`${apiPerfix.degree}/update`, method: 'PATCH'},
        list		            : {url:`${apiPerfix.degree}/list`, method: 'POST'},
        delete                  : {url:`${apiPerfix.degree}/delete`, method: 'DELETE'},
    },

    domain: {
        create                  : {url:`${apiPerfix.domain}/create`, method: 'PUT'},
        read                    : {url:`${apiPerfix.domain}/read`, method: 'GET'},
        update                  : {url:`${apiPerfix.domain}/update`, method: 'PATCH'},
        list		            : {url:`${apiPerfix.domain}/list`, method: 'POST'},
        delete                  : {url:`${apiPerfix.domain}/delete`, method: 'DELETE'},
        updatecode              : {url:`${apiPerfix.domain}/updatecode`, method: 'PATCH'},

        updateforcepublish      : {url:`${apiPerfix.domain}/updateforcepublish`, method: 'PATCH'},
        updateforcepublishshare : {url:`${apiPerfix.domain}/updateforcepublishshare`, method: 'PATCH'},
    },

    domain_group: {
        create              : {url:`${apiPerfix.domain_group}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.domain_group}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.domain_group}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.domain_group}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.domain_group}/delete`, method: 'DELETE'},
    },

    domain_message_stories: {
        create              : {url:`${apiPerfix.domain_message_stories}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.domain_message_stories}/read`, method: 'GET'},
        list		        : {url:`${apiPerfix.domain_message_stories}/list`, method: 'POST'}
    },    

    editorial_letter: {
        create              : {url:`${apiPerfix.editorial_letter}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.editorial_letter}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.editorial_letter}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.editorial_letter}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.editorial_letter}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.editorial_letter}/updatecode`, method: 'PATCH'},
        getcount            : {url:`${apiPerfix.editorial_letter}/getcount`, method: 'POST'},

        approvalunpublish       : {url:`${apiPerfix.editorial_letter}/approvalunpublish`, method: 'PATCH'},
        publish                 : {url:`${apiPerfix.editorial_letter}/publish`, method: 'PATCH'},
        publishdomain           : {url:`${apiPerfix.editorial_letter}/publishdomain`, method: 'PATCH'},
        publishshare            : {url:`${apiPerfix.editorial_letter}/publishshare`, method: 'PATCH'},

        updateshareeditorialletter        : {url:`${apiPerfix.editorial_letter}/updateshareeditorialletter`, method: 'PATCH'},

    },

    event: {
        create                  : {url:`${apiPerfix.event}/create`, method: 'PUT'},
        read                    : {url:`${apiPerfix.event}/read`, method: 'GET'},
        update                  : {url:`${apiPerfix.event}/update`, method: 'PATCH'},
        list		            : {url:`${apiPerfix.event}/list`, method: 'POST'},
        delete                  : {url:`${apiPerfix.event}/delete`, method: 'DELETE'},
        updatecode              : {url:`${apiPerfix.event}/updatecode`, method: 'PATCH'},
        getcount                : {url:`${apiPerfix.event}/getcount`, method: 'POST'},

        listdomainsharedevent   : {url:`${apiPerfix.event}/listdomainsharedevent`, method: 'GET'},

        approvalunpublish       : {url:`${apiPerfix.event}/approvalunpublish`, method: 'PATCH'},
        publish                 : {url:`${apiPerfix.event}/publish`, method: 'PATCH'},
        publishdomain           : {url:`${apiPerfix.event}/publishdomain`, method: 'PATCH'},
        publishshare            : {url:`${apiPerfix.event}/publishshare`, method: 'PATCH'},

        updateshareevent        : {url:`${apiPerfix.event}/updateshareevent`, method: 'PATCH'},

        uploadImage		        : {url:`${apiPerfix.event}/uploadimage`, method: 'PUT'},
        listEventImage          : {url:`${apiPerfix.event}/listeventimage`, method: 'GET'},
        listImageEvent          : {url:`${apiPerfix.event}/listimage`, method: 'POST'},

        registerBanner          : {url:`${apiPerfix.event}/registerbanner`, method: 'PATCH'},
        shownImage              : {url:`${apiPerfix.event}/shownimage`, method: 'PATCH'},
        lockImage               : {url:`${apiPerfix.event}/lockimage`, method: 'PATCH'},
        deleteEventImage        : {url:`${apiPerfix.event}/deleteeventimage`, method: 'DELETE'},
        createEventImage        : {url:`${apiPerfix.event}/createeventimage`, method: 'PUT'},
        updateEventImageOrder   : {url:`${apiPerfix.event}/updateeventimageorder`, method: 'PATCH'},

        listvisitorevent		: {url:`${apiPerfix.event}/listvisitorevent`, method: 'POST'},
        updateattendance		: {url:`${apiPerfix.event}/updateattendance`, method: 'PATCH'},

    },

    event_category: {
        create              : {url:`${apiPerfix.event_category}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.event_category}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.event_category}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.event_category}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.event_category}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.event_category}/updatecode`, method: 'PATCH'},

        listParent	        : {url:`${apiPerfix.event_category}/listparent`, method: 'GET'},
        getTree 	        : {url:`${apiPerfix.event_category}/gettree`, method: 'GET'},

    },

    event_message: {
        create              : {url:`${apiPerfix.event_message}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.event_message}/read`, method: 'GET'},
        list		        : {url:`${apiPerfix.event_message}/list`, method: 'POST'}
    },

    file: {
        create              : {url:`${apiPerfix.file}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.file}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.file}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.file}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.file}/delete`, method: 'DELETE'},
    },

    form_survey: {
        create              : {url:`${apiPerfix.form_survey}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.form_survey}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.form_survey}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.form_survey}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.form_survey}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.form_survey}/updatecode`, method: 'PATCH'},

    },

    image: {
        create              : {url:`${apiPerfix.image}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.image}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.image}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.image}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.image}/delete`, method: 'DELETE'},
    },

    module: {
        create              : {url:`${apiPerfix.module}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.module}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.module}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.module}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.module}/delete`, method: 'DELETE'},
    },

    oauth_clients: {
        create              : {url:`${apiPerfix.oauth_clients}/create`, method: 'PUT'},
        list		        : {url:`${apiPerfix.oauth_clients}/list`, method: 'POST'},
    },

    permission: {
        create              : {url:`${apiPerfix.permission}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.permission}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.permission}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.permission}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.permission}/delete`, method: 'DELETE'},

        generateToken	    : {url:`${apiPerfix.permission}/generatetoken`, method: 'GET'}
    },

    respond_survey: {
        create              : {url:`${apiPerfix.respond_survey}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.respond_survey}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.respond_survey}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.respond_survey}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.respond_survey}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.respond_survey}/updatecode`, method: 'PATCH'},

    },
    
    role: {
        create              : {url:`${apiPerfix.role}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.role}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.role}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.role}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.role}/delete`, method: 'DELETE'},
        templatePermission  : {url:`${apiPerfix.role}/templatepermission`, method: 'GET'}     
    },

    speaker: {
        create                  : {url:`${apiPerfix.speaker}/create`, method: 'PUT'},
        read                    : {url:`${apiPerfix.speaker}/read`, method: 'GET'},
        update                  : {url:`${apiPerfix.speaker}/update`, method: 'PATCH'},
        list		            : {url:`${apiPerfix.speaker}/list`, method: 'POST'},
        delete                  : {url:`${apiPerfix.speaker}/delete`, method: 'DELETE'},
        updatecode              : {url:`${apiPerfix.speaker}/updatecode`, method: 'PATCH'},

    },

    stories: {
        create              : {url:`${apiPerfix.stories}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.stories}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.stories}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.stories}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.stories}/delete`, method: 'DELETE'},
        getcount            : {url:`${apiPerfix.stories}/getcount`, method: 'POST'},
        updatecode          : {url:`${apiPerfix.stories}/updatecode`, method: 'PATCH'},

        listdomainsharedstories   : {url:`${apiPerfix.event}/listdomainsharedstories`, method: 'GET'},

        approvalunpublish       : {url:`${apiPerfix.stories}/approvalunpublish`, method: 'PATCH'},
        publish                 : {url:`${apiPerfix.stories}/publish`, method: 'PATCH'},
        publishdomain           : {url:`${apiPerfix.stories}/publishdomain`, method: 'PATCH'},
        publishshare            : {url:`${apiPerfix.stories}/publishshare`, method: 'PATCH'},

        updatesharestories        : {url:`${apiPerfix.stories}/updatesharestories`, method: 'PATCH'},

    },

    stories_author: {
        create              : {url:`${apiPerfix.stories_author}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.stories_author}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.stories_author}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.stories_author}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.stories_author}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.stories_author}/updatecode`, method: 'PATCH'},

    },

    stories_genre: {
        create              : {url:`${apiPerfix.stories_genre}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.stories_genre}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.stories_genre}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.stories_genre}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.stories_genre}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.stories_genre}/updatecode`, method: 'PATCH'},

        listParent	        : {url:`${apiPerfix.stories_genre}/listparent`, method: 'GET'},
        getTree 	        : {url:`${apiPerfix.stories_genre}/gettree`, method: 'GET'},
    },

    system_user: {
        login		        : {url:`${apiPerfix.system_user}/login`, method: 'POST'},
        loginRefresh        : {url:`${apiPerfix.system_user}/loginrefresh`, method: 'POST'},
        logout		        : {url:`${apiPerfix.system_user}/logout`, method: 'GET'},
        bdloginValidation   : {url:`${apiPerfix.system_user}/bdloginvalidation`, method: 'POST'},

        accessrole          : {url:`${apiPerfix.system_user}/accessrole`, method: 'GET'},
        
        create              : {url:`${apiPerfix.system_user}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.system_user}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.system_user}/update`, method: 'PATCH'},
        readSelf            : {url:`${apiPerfix.system_user}/readself`, method: 'GET'},
        updateSelf          : {url:`${apiPerfix.system_user}/updateself`, method: 'PATCH'},
        updatecode          : {url:`${apiPerfix.system_user}/updatecode`, method: 'PATCH'},

        list		        : {url:`${apiPerfix.system_user}/list`, method: 'POST'},
        inactive	        : {url:`${apiPerfix.system_user}/inactive`, method: 'POST'},
        updateRole		    : {url:`${apiPerfix.system_user}/updaterole`, method: 'POST'}
    },
    
    visitor: {
        create              : {url:`${apiPerfix.visitor}/create`, method: 'PUT'},
        read                : {url:`${apiPerfix.visitor}/read`, method: 'GET'},
        update              : {url:`${apiPerfix.visitor}/update`, method: 'PATCH'},
        list		        : {url:`${apiPerfix.visitor}/list`, method: 'POST'},
        delete              : {url:`${apiPerfix.visitor}/delete`, method: 'DELETE'},
        updatecode          : {url:`${apiPerfix.visitor}/updatecode`, method: 'PATCH'},

        activation		    : {url:`${apiPerfix.visitor}/activation`, method: 'POST'},
        resetPassword		: {url:`${apiPerfix.visitor}/resetpassword`, method: 'POST'},

    },

}