// if (typeof define === "function" && define.amd){
    
// }
    
define(["jquery", "bmob"], function($) {
    function initBmob() {
        Bmob.initialize("1b49af298cddc355a5c309baefe984db", "8a4edb689366a78ab92285bd3d052c64");
    }

    function flashMessage(text, params) {
        var template = '<div class="%(style)s" id="%(uniqueId)s" ><strong>%(importMsg)s</strong>%(text)s</div>',
            $selector = $('#notificationMsg');
        const style = {
            DANAGER: 'alert alert-danger',
            INFO: 'alert alert-info',
            SUCCESS: 'alert alert-success',
            WARNING: 'alert alert-warning'
        }
        params = params ? params : {};
        var uniqueId = Date.now();
        $selector.html(sprintf(template, {
            style: params.style ? style[params.style] : style.INFO,
            text: text,
            importMsg: params.importMsg ? params.importMsg : "",
            uniqueId: uniqueId
        }))
        $('#' + uniqueId).coolAnimate('fadeInDown');
        setTimeout(function() {
            $('#' + uniqueId).coolAnimate('fadeOutUp', function(target) {
                $(target).remove();
            })
        }, params.timeout ? parseInt(params.timeout) : 5000)
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
    /**
     * 使用animate.css的动画
     * @param  {string}   animate  [动画名字]
     * @param  {Function} callback [动画完成回调函数]
     *
     */
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
    return {
        initBmob:initBmob,
        flashMessage:flashMessage,
        loading:loading
    }
})



