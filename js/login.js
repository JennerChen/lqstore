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
