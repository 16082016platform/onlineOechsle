'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),

    service = require('./pedidos-service'),
    // additional requires

    viewModel = require('./pedidos-view-model');

/*Mis vars*/
var common = require('~/common.js'),
    dataService = require('../../dataProviders/backendServices'),
    colorModule = require("color"),
    enums = require("ui/enums");
/* */

exports.buttonBackTap = function () {
    common.stopCount();
    helpers.back();
}
exports.resetCount = function () {
    common.resetCount();
}

var page;
function pageLoaded(args) {
    page = args.object;

    helpers.platformInit(page);
    page.bindingContext = viewModel;

    common.startCount();
    colorHint();
    animarNombreCliente();
}
exports.pageLoaded = pageLoaded;




function colorHint() {
    var color = new colorModule.Color("#ff0000"),
        Email = page.getViewById("nombreCliente");
    if (page.android) {
        Email.android.setHintTextColor(color.android);
        // Email.parent.android.bringToFront();
    }
    else if (page.ios) {
        var placeholder = Email.ios.valueForKey("placeholderLabel");
        placeholder.textColor = color.ios;
    }
}


exports.eliminarProducto = function (args) {
    var item = args.view.bindingContext;
    var index = viewModel.listItems.indexOf(item);
    viewModel.listItems.splice(index, 1);
    page.getViewById("lista").refresh();
    // args.object.parent.parent.parent.animate({
    //     translate: { x: 0, y: 500 },
    //     // scale: { x: 0, y: 0 },
    //     duration: 1000,
    //     // opacity: 0,
    //     curve: enums.AnimationCurve.easeIn
    // }).then(function () {

    // }).then(function () {
    //     page.getViewById("lista").refresh();
    // });

    if (viewModel.listItems.length == 0) {
        common.stopCount();
        helpers.back();
    }
}

exports.enviarPedido = function () {

    if (validaNombreCliente()) {
        var codigo = 0;
        var Everlive = require('../../everlive/everlive.all.min');
        var el = new Everlive('zqjwonr6y522c6ca');
        var data = el.data('pedidos');
        data.count()
            .then(function (data) {
                codigo = data.result + 1;

                for (var i = 0; i < viewModel.listItems.length; i++) {
                    var data = dataService.data('pedidos');
                    data.save({
                        producto: viewModel.listItems[i].producto.Id,
                        estado: "Pendiente",
                        color: viewModel.listItems[i].color,
                        nombreColor: viewModel.listItems[i].nombreColor,
                        talla: viewModel.listItems[i].talla,
                        nombre: viewModel.listItems[i].producto.nombre,
                        cliente: page.getViewById("nombreCliente").text,
                        codigo: codigo
                    })
                        .then(onRequestSuccess.bind())
                        .catch(onRequestFail.bind(this));
                }

                page.animate({
                    scale: { x: 0, y: 0 },
                    backgroundColor: "#ff0000",
                    duration: 1000,
                }).then(function () {
                    viewModel.set("listItems", []);
                }).then(function () {
                    helpers.navigate({
                        moduleName: "components/splashScreen/splashScreen",
                        animated: false,
                        clearHistory: true,
                        context: {
                            codigo: codigo,
                            cliente: page.getViewById("nombreCliente").text
                        }
                    });
                });



            },
            function (error) {
                alert(JSON.stringify(error));
            });
    } else {
        animarNombreCliente();
    }
}

function animarNombreCliente() {
    page.getViewById("nombreCliente").parent.translateY = "-400";
    page.getViewById("nombreCliente").parent.animate({
        translate: { x: 0, y: 0 },
        duration: 1000,
        curve: enums.AnimationCurve.spring
    });
}
function validaNombreCliente() {
    if (page.getViewById("nombreCliente").text == "") {
        return false;
    } else {
        return true;
    }
}

function onRequestSuccess() {

}

function onRequestFail(err) {
    alert(JSON.stringify(err));
    return err;
}