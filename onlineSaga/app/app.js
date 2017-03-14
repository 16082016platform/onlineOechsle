var application = require('application'),
    // mainModule = 'navigation/navigation';
    mainModule = 'components/homeView/homeView';

// START_CUSTOM_CODE_nativeScriptApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_nativeScriptApp

/* desabilitar el back buttom*/
var application = require('application');
if (application.android) {
    application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args) {
    args.cancel = true;
}

application.start({
    moduleName: mainModule
});
