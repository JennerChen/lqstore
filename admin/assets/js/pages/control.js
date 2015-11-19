function initBmob() {
    Bmob.initialize("1b49af298cddc355a5c309baefe984db", "8a4edb689366a78ab92285bd3d052c64");
}

function queryData() {
    var Product = Bmob.Object.extend("Product");
    var query = new Bmob.Query(Product);
    // 查询所有数据
    table = geraltTable({
        selector: $('#tb_content'),
        tableStyle: 'TRTD',
        paging: {
            pageSize: 5
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
            $('td:eq(3)', $(row)).addClass('col-md-4').children('img').click(function(event) {
                var meta = $(this).closest('tr').data('meta');
                showPics(meta.photo);
            });
            $('td:eq(4)', $(row)).addClass('overflow col-md-2');
            $('td:eq(5)', $(row)).addClass('overflow col-md-1').children('button').click(function(event) {
                // edit
                if ($(this).children('i').hasClass('fa-pencil-square-o')) {
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

                }
                // delete
                if ($(this).children('i').hasClass('fa-trash-o')) {

                }
            });
        },
        rowMap: {
            productId: function(data) {
                return data;
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
                    output += "<img src='" + val + "' style='max-height:50px'></img>";
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
        p_photo = currentUploadImg;

    // product.addUnique('photo',currentUploadImg);
    product.save({
        productId: p_pId,
        name: p_name,
        description: p_description,
        photo: currentUploadImg
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
/**
 * 根据row中 meta 数据更新一行数据
 * @param  {[type]} row [description]
 * @return {[type]}     [description]
 */
function generateTableRow(row){
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
            time: meta.createdAt
        })
    $(row).empty().html(output);
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
    $(document).on('click', '.modal-confirm', function (e) {
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
            }
        }
    });

    $('body').delegate('[data-confirm]', 'click', function(event) {
        var Product = Bmob.Object.extend("Product"),
            query = new Bmob.Query(Product);
        var row = $(this).closest('tr')
            meta = row.data('meta'),
            productId = $('input:first',$(this).closest('tr')).val(),
            name = $('input:eq(1)',$(this).closest('tr')).val(),
            description = $('input:eq(2)',$(this).closest('tr')).val();
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
                    },
                    error:function(){

                    }
                });
            }
        });
    });
    $('body').delegate('[data-cancel]', 'click', function(event) {
        generateTableRow($(this).closest('tr'));
    });
})