requirejs.config({
	"baseUrl": "../js",
	"paths": {
		"jquery": "vendor/jquery.min",
		"bmob":"vendor/bmob-min",
		// "sprintf":"vendor/sprintf",
		"common":"global"
	},
	"shim": {
		"bmob":{
			exports:"Bmob"
		}
	}
});

// Load the main app module to start the app
// requirejs(["app/main"]);
// ["jquery","bmob","common"], 
define(function(require) {
	require('vendor/sprintf');
	require('bmob');
	require('jquery');
	window.Common = require('common');
	function login(name, pwd){
		 Bmob.User.logIn(name, pwd, {
	        success: function(user) {
	        	window.location = './control.html';
	        },
	        error: function(user, error) {
	        	alert('error');
	        }
	    });
	}
	$(function(){
		Common.initBmob();
		$('#signin').click(function(event) {
			var username = $('#username').val(),
				pwd = $('#password').val(); 
			if(username && pwd ){
				login(username,pwd);
			}
		});
	})
});