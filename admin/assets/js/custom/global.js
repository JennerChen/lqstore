$.fn.coolAnimate = function(animate, callback) {
    var self = this;
    animate = "animated fast " + animate;
    $(self).addClass(animate).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass(animate);
        if ($.isFunction(callback)) {
            callback(self)
        }
    })
    return $(self);
}
function loading(params) {
    params = params ? params : {};
    var template = $('<div style="color:#835BED;position:absolute;top:48%;left:48%;z-index:99999" class="la-ball-triangle-path la-2x"><div></div><div></div><div></div></div>');
    var container = params.container ? params.container : "",
        loader = {},
        selector = $(container).length ? $(container) : $('body');
    selector.append(template).css('opacity', '0.5');
    loader.dismiss = function() {
        template.remove();
        selector.css('opacity', 1)
    }
    return loader;
}
// function coolAnimate(target, x,callback) {
//     $(target).removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
//         // $(this).removeClass();
//         if(callback){
//             callback(this);
//         }
//     });
// }
function initBmob() {
    Bmob.initialize("1b49af298cddc355a5c309baefe984db", "8a4edb689366a78ab92285bd3d052c64");
}
function getBmobObject(){
    
}