;(function(amd) {
	var sayGood = function() {
		console.log('good day');
	}
	var loadProducts= function(){
		var Product = Bmob.Object.extend("Product");
        var query = new Bmob.Query(Product);
	}
	if (amd) {
		define(["jquery", "bmob"], function($) {
			return {
				"good": sayGood
			}
		})
	}else{
		// exports method to global
		window.sayGood = sayGood;
	}
})(typeof define === "function" && define.amd);