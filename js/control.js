function validateUser(){
	var currentUser = Bmob.User.current();
	if(currentUser && currentUser._isCurrentUser){
		
	}else{
		window.location='./login.html';
	}
}
$(function(){
	initBmob();
	validateUser();
})