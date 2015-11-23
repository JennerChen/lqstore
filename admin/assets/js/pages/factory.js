var table = null;
function queryData() {
    var Factory = Bmob.Object.extend("Factory");
    var query = new Bmob.Query(Factory);
    // 查询所有数据
    table = geraltTable({
        selector: $('#tb_content'),
        tableStyle: 'TRTD',
        paging: {
            pageSize: 5,
            paginationSelector: $('#tb_content').siblings('tfoot'),
            generateCallback: function(t,sub,page){
                var dataSet = [];
                for (var i = page.pageTotal(); i > 0; i--) {
                    dataSet.splice(0,0,i);
                };
                var template = _.template($('#paginationTemp').html());
                this.paginationSelector.html(template({dataSet:dataSet}));
            },
            generatedCallback: function(page){
                $('button',this.paginationSelector).click(function(event) {
                    var pnum = $(this).data('go');
                    $(this).addClass('active').siblings('button').removeClass('active');
                    page.goPage(pnum);
                });
            }
        },
        dataRemote: {
            bmob: query,
            callback: function(results) {
                var ds = [];
                // 循环处理查询到的数据
                for (var i = 0; i < results.length; i++) {
                    var temp = results[i].attributes;
                    temp.id = results[i].id;
                    temp.createdAt = results[i].createdAt;
                    ds.push(temp);
                }
                return ds;
            },
            loading: {
                start: function() {
                    return loading($('#tb_content'));
                },
                stop: function(loader) {
                    loader.dismiss();
                }
            }
        },
        rowCreated: function(row, metaData) {
            $(row).data('meta', metaData);
            $('td:first', $(row)).addClass('overflow col-md-2');
            $('td:eq(1)', $(row)).addClass('overflow col-md-1');
            $('td:eq(2)', $(row)).addClass('overflow col-md-2');
            $('td:eq(3)', $(row)).addClass('col-md-4');
            $('td:eq(4)', $(row)).addClass('overflow col-md-2');
        },
        rowMap: {
            factoryId: function(data) {
                return '<button type="button" class="bk-margin-5 btn btn-link btn-sm" data-showdetail><i class="fa fa-chevron-down"></i>'+data+'</button>';
            },
            name: function(data) {
                return data;
            },
            description: function(data, row) {
                return data;
            },
            contact: function(data) {
                return data;
            },
            createdAt: function(data) {
                return data;
            },
            GERALTTABLE_COL_HOLDER: function(){
                return $('#factoryOperationTemp').html();
            }
        },
    });
}
function addNewFactory(callback) {
    var Factory = Bmob.Object.extend("Factory"),
        factory = new Factory();
    var f_fId = $('input:first', $('#addFactory')).val(),
        f_name = $('input:eq(1)', $('#addFactory')).val(),
        f_description = $('textarea:first', $('#addFactory')).val(),
        f_contact = $('textarea:last', $('#addFactory')).val();

    factory.save({
        factoryId: f_fId,
        name: f_name,
        description: f_description,
        contact: f_contact
    }, {
        success: function(object) {
            if (table) {
                var ds = object.attributes;
                ds.id = object.id;
                ds.createdAt = object.createdAt;
                table.drawRow(ds, function(row) {
                    $(row).css('background-color', '#5BC0DE');
                })
            }
            if(callback){
                callback();
            }
            $('input', $('#addFactory')).val('');
            $('textarea', $('#addFactory')).val('');
        },
        error: function(model, error) {
            console.log(error);
        }
    });
}

var disableAction = false;
/**
 * 根据row中 meta 数据更新一行数据
 * @param  {[type]} row [description]
 * @return {[type]}     [description]
 */
function generateTableRow(row) {
    if (!row || $(row).length == 0) return false;
    var template = $('#factoryRowTemp').html(),
        meta = $(row).data('meta'),
        output = sprintf(template, {
            id: meta.factoryId,
            name: meta.name,
            desc: meta.description,
            contact: meta.contact,
            time: meta.createdAt,
            operation: function() {
                return $('#factoryOperationTemp').html();
            }
        })
    $(row).empty().html(output);
}
function showBackendBusyMsg(){
    new PNotify({
        title: '操作失败',
        text: '请稍后,服务器忙!',
        type: 'error',
        addclass: 'stack-bar-top',
        stack: {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0},
        width: "100%"
    });
}
$(function(){
    initBmob();
    queryData();
    /*
    Modal Dismiss
    */
    $(document).on('click', '.modal-dismiss', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });

    /*
    Modal Confirm
    */
    $(document).on('click', '.modal-confirm', function (e) {
        e.preventDefault();
        addNewFactory(function(){
            $.magnificPopup.close();

            new PNotify({
                title: '成功!',
                text: '添加制造商成功.',
                type: 'success'
            });
        });
    });
    /*
    Form
    */
    $('i[data-target=#addFactory]').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
        modal: true,

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function() {
                if($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#name';
                }
            }
        }
    });

    $('#tb_content').delegate('[data-confirm]', 'click', function(event) {
        if (disableAction) {
            return showBackendBusyMsg();
        }
        disableAction = true;
        var Factory = Bmob.Object.extend("Factory"),
            query = new Bmob.Query(Factory);
        var row = $(this).closest('tr')
            meta = row.data('meta'),
            factoryId = $('input:first',$(this).closest('tr')).val(),
            name = $('input:eq(1)',$(this).closest('tr')).val(),
            description = $('input:eq(2)',$(this).closest('tr')).val(),
            contact = $('input:eq(3)',$(this).closest('tr')).val();
        query.get(meta.id, {
            success: function(factory) {
                factory.set('factoryId', factoryId);
                factory.set('name',name);
                factory.set('description',description);
                factory.set('contact',contact);
                factory.save(null,{
                    success: function(factory){
                        var d = factory.attributes;
                            d.id = factory.id,
                            d.createdAt = factory.createdAt;
                        generateTableRow(row.data('meta',d))
                        disableAction = false;
                        new PNotify({
                            title: '成功!',
                            text: '制造商信息修改成功.',
                            type: 'success'
                        });
                    },
                });
            }
        });
    });
    $('#tb_content').delegate('[data-cancel]', 'click', function(event) {
        if (disableAction) {
            return showBackendBusyMsg();
        }
        generateTableRow($(this).closest('tr'));
    });
    $('#tb_content').delegate('[data-edit]', 'click', function(event) {
        var row = $(this).closest('tr'),
            meta = row.data('meta'),
            template = $('#factoryEditTemp').html(),
            output = sprintf(template,{
                id: meta.factoryId,
                name:meta.name,
                desc: meta.description,
                contact:meta.contact,
                time:meta.createdAt
            });
        $(row).html(output);
    });
    $('#tb_content').delegate('[data-remove]', 'click', function(event) {
        var that = this;
        $.magnificPopup.open({
            items:{
                src:'#operationConfirm',
                type: 'inline',
            },

            fixedContentPos: false,
            fixedBgPos: true,

            overflowY: 'auto',

            closeBtnInside: true,
            preloader: false,

            midClick: true,
            removalDelay: 300,
            mainClass: 'my-mfp-zoom-in',
            modal: true,
            callbacks: {
                open: function() {
                    $('[data-deletefactory]').click(function(event) {
                        var row = $(that).closest('tr')
                        meta = row.data('meta');
                        var Factory = Bmob.Object.extend("Factory"),
                            factory = new Factory();
                        factory.set('id', meta.id);
                        factory.destroy({
                            success: function(p) {
                                $(row).hide(function(){
                                    $(this).remove()
                                });
                                new PNotify({
                                    title: '成功!',
                                    text: '制造商删除成功.',
                                    type: 'success'
                                });
                                event.preventDefault();
                                $.magnificPopup.close();
                            },
                            error: function(p, error) {
                                showBackendBusyMsg();
                            }
                        });
                    });
                },
                close: function(){
                    $('.modal-confirm').unbind('click');
                }
            }
        })
    });
    $('#tb_content').delegate('[data-showdetail]', 'click', function(event) {
        var meta = $(this).closest('tr').data('meta');
    });
})