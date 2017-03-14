'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    viewModel = require('./splashScreen-view-model');

/*Mis vars*/
var frameModule = require("ui/frame");
/* */

function pageLoaded(args) {
    var page = args.object;

    // helpers.platformInit(page); //para que no se vea el header
    // Hide the iOS UINavigationBar so it doesn't get in the way of the animation
    if (frameModule.topmost().ios) {
        frameModule.topmost().ios.navBarVisibility = "never";
    } else {
        frameModule.topmost().android.navBarVisibility = "never";
    }

    page.bindingContext = viewModel;


    var context = page.navigationContext;
    viewModel.set('cliente', context.cliente);
    viewModel.set('codigo', context.codigo);



    page.animate({
        scale: { x: 1, y: 1 },
        duration: 2000,
    }).then(function () {
        return page.animate({
            scale: { x: 1.4, y: 1.4 },
            opacity: 0.7,
            duration: 10000
        });
    }).then(function () {
        helpers.navigate({
            moduleName: "components/homeView/homeView",
            animated: false,
            clearHistory: true,
        });
    });
}
exports.pageLoaded = pageLoaded;
