'use strict';
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
	initBmob();
	$('#signin').click(function(event) {
		var username = $('#username').val(),
			pwd = $('#password').val(); 
		if(username && pwd ){
			login(username,pwd);
		}
	});
})
// requirejs.config({
//     //By default load any module IDs from js/lib
//     baseUrl: 'js',
//     //except, if the module ID starts with "app",
//     //load it from the js/app directory. paths
//     //config is relative to the baseUrl, and
//     //never includes a ".js" extension since
//     //the paths config could be for a directory.
//     paths: {
//         jquery: 'vendor/jquery.min',
//         Bmob: 'vendor/bmob-min',
//         main: 'global'
//     }
// });
// require(["jquery","Bmob","main"], function($,Bmob,Global) {
// 	function login(name, pwd){
// 		 Bmob.User.logIn(name, pwd, {
// 	        success: function(user) {
// 	        	window.location = './control.html';
// 	        },
// 	        error: function(user, error) {
// 	        	alert('error');
// 	        }
// 	    });
// 	}
	
// 	Global.initBmob();
// 	$('#signin').click(function(event) {
// 		var username = $('#username').val(),
// 			pwd = $('#password').val(); 
// 		if(username && pwd ){
// 			login(username,pwd);
// 		}
// 	});
	
// }