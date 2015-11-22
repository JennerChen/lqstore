var table = null;
function queryData() {
    var Product = Bmob.Object.extend("Product");
    var query = new Bmob.Query(Product);
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
            productId: function(data) {
                return '<button type="button" class="bk-margin-5 btn btn-link btn-sm" data-showdetail><i class="fa fa-chevron-down"></i>'+data+'</button>';
            },
            name: function(data) {
                return data;
            },
            description: function(data, row) {
                return data;
            },
            photo: function(data) {
                var output = "";
                $.each(data, function(index, val) {
                    output += "<img src='" + val + "' style='max-height:50px' data-productimg></img>";
                    if (index >= 5) {
                        return false;
                    }
                });
                // var output = "<img src='" + data + "' style='max-height:50px'></img>";
                // Bmob.Image.thumbnail({"image":data,"mode":0,"quality":100,"width":100}

                //   ).then(function(obj) {


                //   console.log("url:"+obj.url); 
                // });
                return output;
            },
            createdAt: function(data) {
                return data;
            },
            GERALTTABLE_COL_HOLDER: function(){
                return $('#productOperationTemp').html();
            }
        },
    });
}
function addNewProduct(callback) {
    var Product = Bmob.Object.extend("Product"),
        Photo = Bmob.Object.extend("Photo"),
        product = new Product();
    var p_pId = $('input:first', $('#addProduct')).val(),
        p_name = $('input:eq(1)', $('#addProduct')).val(),
        p_description = $('textarea', $('#addProduct')).val(),
        factoryId = $('select',$('#addProduct')).val(),
        p_photo = currentUploadImg;
    
    if(factoryId!=0){
        product.set('parent',Bmob.Object.createWithoutData("Factory", factoryId));
    }

    product.save({
        productId: p_pId,
        name: p_name,
        description: p_description,
        photo: currentUploadImg,
    }, {
        success: function(object) {
            if (table) {
                var ds = object.attributes;
                ds.id = object.id;
                ds.createdAt = object.createdAt;
                table.drawRow(ds)
            }
            if(callback){
                callback();
            }
            $('input', $('#addProduct')).val('');
            $('textarea', $('#addProduct')).val('');
            $('#uploadedPic').empty();
            currentUploadImg = [];
        },
        error: function(model, error) {
            console.log(error);
        }
    });
}
var currentUploadImg = [];
function showPics(imgList){
    if (!imgList || imgList.length == 0) {
        return false;
    }
    var galary = $('#picGallaryTemp').html(),
        imgTemp = $('#picGallaryItemTemp').html(),
        output = sprintf(galary, {
            imgList: function() {
                var temp = "";
                $.each(imgList, function(index, img) {
                    temp += sprintf(imgTemp, {
                        src: img
                    })
                });
                return temp;
            }
        })
   

    $('#pciContainer').empty().append(output);
    $('[data-plugin-carousel]').each(function() {
        var $this = $(this),
            opts = {};

        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions)
            opts = pluginOptions;

        $this.themePluginCarousel(opts);
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
    var template = $('#productRowTemp').html(),
        meta = $(row).data('meta'),
        output = sprintf(template, {
            id: meta.productId,
            name: meta.name,
            desc: meta.description,
            imgList: function() {
                return $('td:eq(3)', $(row)).html();
            },
            time: meta.createdAt,
            operation: function() {
                return $('#productOperationTemp').html();
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
    $('#uploadPic').click(function(event) {
        var loader = loading('#tb_content');
        var fileUploadControl = $("#fileupload")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "product.jpg";
            var file = new Bmob.File(name, file);
            file.save().then(function(obj) {
                currentUploadImg.push(obj.url());
                $('#uploadedPic').append(sprintf($('#uploadedPicTemp').html(), {
                    src: obj.url()
                }))
                $("#fileupload").val('');
                loader.dismiss();
            });
        };
    })
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
    $(document).on('click', '[data-addproduct]', function (e) {
        e.preventDefault();
        addNewProduct(function(){
            $.magnificPopup.close();

            new PNotify({
                title: '成功!',
                text: '添加商品成功.',
                type: 'success'
            });
        });
    });
    /*
    Form
    */
    $('i[data-target=#addProduct]').magnificPopup({
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
            },
            open: function(){
                var Factory = Bmob.Object.extend("Factory"),
                    query = new Bmob.Query(Factory);
                query.count({
                    success: function(total) {
                        query.limit(total).find({
                            success: function(results) {
                                var factoryList = $('#factoryList').data('meta',results).empty().append('<option value=0>不指定厂家</option>');
                                $.each(results, function(index, factory) {
                                    factoryList.append('<option value='+factory.id+'>'+factory.attributes.name+'</option>');
                                });
                            },
                            error: function(err) {
                                console.error(err)
                            }
                        })
                    },
                    error: function(err) {
                        console.error(err);
                    }
                });
                
            }
        }
    });

    $('#tb_content').delegate('[data-confirm]', 'click', function(event) {
        if (disableAction) {
            return showBackendBusyMsg();
        }
        disableAction = true;
        var Product = Bmob.Object.extend("Product"),
            query = new Bmob.Query(Product);
        var row = $(this).closest('tr')
            meta = row.data('meta'),
            productId = $('input:first',row).val(),
            name = $('input:eq(1)',row).val(),
            description = $('input:eq(2)',row).val();

        query.get(meta.id, {
            success: function(product) {
                product.set('productId', productId);
                product.set('name',name);
                product.set('description',description)
                product.save(null,{
                    success: function(product){
                        var d = product.attributes;
                            d.id = product.id,
                            d.createdAt = product.createdAt;
                        generateTableRow(row.data('meta',d))
                        disableAction = false;
                        new PNotify({
                            title: '成功!',
                            text: '商品修改成功.',
                            type: 'success'
                        });
                    },
                    error:function(){

                    }
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
            template = $('#productEditTemp').html(),
            output = sprintf(template,{
                id: meta.productId,
                name:meta.name,
                desc: meta.description,
                imgList:function(){
                    return $('td:eq(3)',$(row)).html();
                },
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
                    $('[data-deleteproduct]').click(function(event) {
                        var row = $(that).closest('tr')
                        meta = row.data('meta');
                        var Product = Bmob.Object.extend("Product"),
                            product = new Product();
                        product.set('id', meta.id);
                        // $.each(meta.photo, function(index, img) {
                        //      var file = new Bmob.File("product.jpg", img);
                        //      file.destroy();
                        // });
                        product.destroy({
                            success: function(p) {
                                $(row).hide(function(){
                                    $(this).remove()
                                });
                                new PNotify({
                                    title: '成功!',
                                    text: '商品删除成功.',
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
    $('#tb_content').delegate('[data-productimg]', 'click', function(event) {
        var meta = $(this).closest('tr').data('meta');
        showPics(meta.photo);
    });
    $('#tb_content').delegate('[data-showdetail]', 'click', function(event) {
        var curr_row = $(this).closest('tr');
        if(curr_row.hasClass('detailopened')){
            curr_row.next('.detailInfo').fadeOut(function(){
                curr_row.removeClass('detailopened')
                $(this).remove();
            })
        }else{
            var meta = $(this).closest('tr').data('meta');
            var Product = Bmob.Object.extend("Product");
            var query = new Bmob.Query(Product);
            query.include('parent').get(meta.id,{
                success:function(p){
                    curr_row.after(sprintf($('#showDetailTemp').html(), {
                        showId: function(){
                            var output = "";
                            if(p.get('parent')){
                                output+=p.get('parent').attributes.factoryId+"_";
                            }else{
                                output+="custom_";
                            }
                            return output+p.attributes.productId.toLowerCase()
                        },
                        name: function() {
                            if (p.get('parent')) {
                                return p.get('parent').attributes.name;
                            } else {
                                return "没有制造商(未设置)";
                            }
                        },
                        factoryId: function(){
                            if (p.get('parent')) {
                                return p.get('parent').attributes.factoryId;
                            } else {
                                return "没有制造商(未设置)";
                            }
                        },
                        factoryContact: function(){
                            if (p.get('parent')) {
                                return p.get('parent').attributes.contact;
                            } else {
                                return "没有制造商(未设置)";
                            }
                        }
                    })).addClass('detailopened');
                    
                }
            })
        }

    });
})