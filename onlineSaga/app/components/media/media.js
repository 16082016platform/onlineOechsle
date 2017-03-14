'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),

    service = require('./media-service'),
    // additional requires

    viewModel = require('./media-view-model');

/*Mis vars*/
var frameModule = require("ui/frame");
var common = require('~/common.js');
var vmPedidos = require('../pedidos/pedidos-view-model');
/* */

exports.buttonBackTap = function () {
    viewModel.set('tallaSelected', '');
    viewModel.set('colorSelected', '');
    common.stopCount();
    helpers.back();
}
exports.resetCount = function () {
    common.resetCount();
}


function onListViewItemTap(args) {
    var itemData = viewModel.get('listItems')[args.index];

    helpers.navigate({
        moduleName: 'components/media/itemDetails/itemDetails',
        context: itemData.details
    });
}
exports.onListViewItemTap = onListViewItemTap;

function flattenLocationProperties(dataItem) {
    var propName, propValue,
        isLocation = function (value) {
            return propValue && typeof propValue === 'object' &&
                propValue.longitude && propValue.latitude;
        };

    for (propName in dataItem) {
        if (dataItem.hasOwnProperty(propName)) {
            propValue = dataItem[propName];
            if (isLocation(propValue)) {
                dataItem[propName] =
                    'Latitude: ' + propValue.latitude +
                    'Longitude: ' + propValue.longitude;
            }
        }
    }
}
// additional functions
var page;
function pageLoaded(args) {
    page = args.object;
    // helpers.platformInit(page); //para que no se vea el header
    // Hide the iOS UINavigationBar so it doesn't get in the way of the animation
    if (frameModule.topmost().ios) {
        frameModule.topmost().ios.navBarVisibility = "never";
    } else {
        frameModule.topmost().android.navBarVisibility = "never";
    }

    var context = page.navigationContext;
    viewModel.set('producto', context.producto);

    var itemsList = viewModel.get('listItems');
    var menor = -1;
    for (var i = 0; i < itemsList.length; i++) {
        if (context.producto.Id == itemsList[i].details.producto && itemsList[i].details.activo) {
            itemsList[i].details.visible = true;
            menor == -1 ? menor = i : menor;
        } else {
            itemsList[i].details.visible = false;
        }

        // if (context.producto.Id == itemsList[i].details.producto && itemsList[i].details.value) {
        //     itemsList[i].details.value.visible = true;
        // } else {
        //     itemsList[i].details.value.visible = false;
        // }
    }

    page.bindingContext = viewModel;

    try {
        if (viewModel.get('tallaSelected') == '') {
            viewModel.set('tallaSelected', viewModel.get('producto').tallas[0]);
        }

        if (menor > -1) {
            if (viewModel.get('colorSelected') == '') {
                viewModel.set('colorSelected', itemsList[menor].details.color);
            }
            viewModel.set('imagenSelected', itemsList[menor].image)
            viewModel.set('listItems', itemsList);
            viewModel.set('isLoading', false);
            page.getViewById("talla" + viewModel.get('tallaSelected')).cssClass = "tallaProductoSelected";
            page.getViewById("color" + viewModel.get('colorSelected')).cssClass = "colorProductoSelected";
        } else {
            viewModel.set('imagenSelected', "~/images/logoActivity.png");
            viewModel.set('colorSelected', "");
            viewModel.set('listItems', itemsList);
            viewModel.set('isLoading', false);
            page.getViewById("talla" + viewModel.get('tallaSelected')).cssClass = "tallaProductoSelected";
        }
    }
    catch (err) {
        // alert(err.message);
    }



    // viewModel.set('isLoading', true);
    // viewModel.set('listItems', []);
    // function _fetchData() {
    //     var context = page.navigationContext;

    //     viewModel.set('producto', context.producto);

    //     if (context && context.filter) {
    //         return service.getAllRecords(context.filter);
    //     }

    //     return service.getAllRecords();
    // };

    // _fetchData()
    //     .then(function (result) {
    //         var itemsList = [];

    //         result.forEach(function (item) {

    //             flattenLocationProperties(item);

    //             itemsList.push({

    //                 image: item.imagen,

    //                 // singleItem properties
    //                 details: item
    //             });
    //         });

    //         viewModel.set('tallaSelected', viewModel.get('producto').tallas[0]);
    //         if (itemsList.length > 0) {
    //             viewModel.set('colorSelected', itemsList[0].details.color);

    //             viewModel.set('imagenSelected', itemsList[0].image)
    //             viewModel.set('listItems', itemsList);
    //             viewModel.set('isLoading', false);
    //             page.getViewById("talla" + viewModel.get('tallaSelected')).cssClass = "tallaProductoSelected";
    //             page.getViewById("color" + viewModel.get('colorSelected')).cssClass = "colorProductoSelected";
    //         } else {
    //             viewModel.set('imagenSelected', "~/images/logoActivity.png");
    //             viewModel.set('colorSelected', "");
    //             viewModel.set('listItems', itemsList);
    //             viewModel.set('isLoading', false);
    //             page.getViewById("talla" + viewModel.get('tallaSelected')).cssClass = "tallaProductoSelected";
    //         }

    //     })
    //     .catch(function onCatch() {
    //         viewModel.set('isLoading', false);
    //     });
    // // additional pageLoaded
    if (isInit) {
        isInit = false;
        // additional pageInit
    }
    common.startCount();
}
exports.pageLoaded = pageLoaded;

function selectImagen(args) {
    var image = args.object;
    page.getViewById("imagenGrande").src = image.src;
}
exports.selectImagen = selectImagen;

function selectColor(args) {
    var color = args.object;
    args.object
        .animate({
            scale: { x: 0.8, y: 0.8 },
            duration: 100
        })
        .then(function () {
            page.getViewById("color" + viewModel.get('colorSelected')).cssClass = "colorProducto";
            page.getViewById("imagenGrande").src = color.image;
            return args.object.animate({
                scale: { x: 1, y: 1 },
                duration: 100
            });
        })
        .then(function () {
            viewModel.set('colorSelected', color.text);
            page.getViewById("color" + color.text).cssClass = "colorProductoSelected";
        });
}
exports.selectColor = selectColor;


function selectTalla(args) {
    var talla = args.object;
    args.object
        .animate({
            scale: { x: 0.8, y: 0.8 },
            duration: 100
        })
        .then(function () {
            page.getViewById("talla" + viewModel.get('tallaSelected')).cssClass = "tallaProducto";
            return args.object.animate({
                scale: { x: 1, y: 1 },
                duration: 100
            });
        })
        .then(function () {
            viewModel.set('tallaSelected', talla.text);
            page.getViewById("talla" + talla.text).cssClass = "tallaProductoSelected";
        });
}
exports.selectTalla = selectTalla;


exports.agregarMas = function () {
    vmPedidos.listItems.unshift({
        producto: viewModel.get('producto'),
        talla: viewModel.get('tallaSelected'),
        nombreColor: viewModel.get('colorSelected'),
        color: (viewModel.get('colorSelected') == "") ? "" : page.getViewById("color" + viewModel.get('colorSelected')).valor,

    });
    common.stopCount();
    helpers.back();
}

var observable = require('data/observable');
var observableArray = require('data/observable-array');
exports.selectSolicitar = function () {

    // new vmPedidos.ListItem(
    //     viewModel.get('producto'),
    //     viewModel.get('tallaSelected'),
    //     viewModel.get('colorSelected'),
    //     (viewModel.get('colorSelected') == "") ? "" : page.getViewById("color" + viewModel.get('colorSelected')).valor
    // );

    vmPedidos.listItems.unshift({
        producto: viewModel.get('producto'),
        talla: viewModel.get('tallaSelected'),
        nombreColor: viewModel.get('colorSelected'),
        color: (viewModel.get('colorSelected') == "") ? "" : page.getViewById("color" + viewModel.get('colorSelected')).valor,
    });

    // vmPedidos.listItems.unshift({
    //     producto: viewModel.get('producto'),
    //     talla: viewModel.get('tallaSelected'),
    //     nombreColor: viewModel.get('colorSelected'),
    //     color: (viewModel.get('colorSelected') == "") ? "" : page.getViewById("color" + viewModel.get('colorSelected')).valor,
    // });
    helpers.navigate({
        moduleName: 'components/pedidos/pedidos',
        animated: true,
        transition: {
            name: "slide"
        }
    });
}