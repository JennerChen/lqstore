requirejs.config({
	"baseUrl": "./js",
	"paths": {
		"jquery": "vendor/jquery.min",
		"bmob":"vendor/bmob-min",
		"sprintf":"vendor/sprintf",
		"blob":"vendor/fileinput/plugins/canvas-to-blob.min",
		"scrolly":"front/jquery.scrolly.min",
		"poptrox":"front/jquery.poptrox.min",
		"skel":"front/skel.min",
		"util":"front/util",
		"main":"front/main",
		"communicate":"front/communicate"
	},
	"shim": {
		"bmob":{
			exports:"Bmob"
		},
		"scrolly":['jquery'],
		"poptrox":['jquery'],
		"util":['jquery'],
		"main":['jquery'],
		"communicate":['jquery','bmob']
	}
});

// Load the main app module to start the app
define(function(require) {
	require('jquery');
	require('scrolly');
	require('poptrox');
	require('skel');
	require('bmob');
	require('util');
	require('main');
	var communicate = require('communicate');
	// exports to global
	// window.Common = require('common');

	$(function() {
		Bmob.initialize("1b49af298cddc355a5c309baefe984db", "8a4edb689366a78ab92285bd3d052c64");
	})
});