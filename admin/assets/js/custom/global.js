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