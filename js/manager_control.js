requirejs.config({
	"baseUrl": "../js",
	"paths": {
		"jquery": "vendor/jquery.min",
		"bmob":"vendor/bmob-min",
		"sprintf":"vendor/sprintf",
		"common":"global",
		"bootstrap":"vendor/bootstrap",
		"blob":"vendor/fileinput/plugins/canvas-to-blob.min",
		"fileupload":"vendor/fileinput/fileinput.min",
		"fileuploadzh":"vendor/fileinput/fileinput_locale_zh",
		"geraltTable":"geraltTable",
		"control":"control"
	},
	"shim": {
		"bmob":{
			exports:"Bmob"
		},
	}
});

// Load the main app module to start the app
define(function(require) {
	require('jquery');
	require('bmob');
	require('sprintf');
	require('bootstrap');
	// exports to global
	window.Common = require('common');
	require('geraltTable');
	window.Control = require('control');

	$(function() {
		Common.initBmob();
		Control.validateUser();
		Control.initSideBar();
		Control.initAddNewProduct();
		$('#addNewProduct').click(function(){
			Control.addNewProduct();
		});
		$('#fileupload').change(function(event) {
			if ($(this).val() && $(this).val() != '') {
				$('#uploadImg').removeAttr('disabled');
			} else {
				$('#uploadImg').prop('disabled', true);
			}
		});
		Control.queryData();
	})
});