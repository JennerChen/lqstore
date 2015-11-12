define(function(require){
    require('jquery');
    require('bmob');
    var Common = require('common');
    function validateUser() {
        var currentUser = Bmob.User.current();
        if (currentUser && currentUser._isCurrentUser) {
        
        } else {
            window.location = './login.html';
        }
    }

    function initSideBar() {
        $("#messagesBody").slideToggle("fast");
        $('#sideBar').hide();
        $("#dashboard").click(function() {
            $(".tab").removeClass("tabSelected");
            $(".tab").addClass("tabNoSelected");
            $(this).removeClass("tabNoSelected");
            $(this).addClass("tabSelected");
            $(".tabBody").slideUp("fast");
            $("#dashboardBody").slideToggle("fast");
        });
        $("#profile").click(function() {
            $(".tab").removeClass("tabSelected");
            $(".tab").addClass("tabNoSelected");
            $(this).removeClass("tabNoSelected");
            $(this).addClass("tabSelected");
            $(".tabBody").slideUp("fast");
            $("#profileBody").slideToggle("fast");
        });
        $("#messages").click(function() {
            $(".tab").removeClass("tabSelected");
            $(".tab").addClass("tabNoSelected");
            $(this).removeClass("tabNoSelected");
            $(this).addClass("tabSelected");
            $(".tabBody").slideUp("fast");
            $("#messagesBody").slideToggle("fast");
        });
        $("#settings").click(function() {
            $(".tab").removeClass("tabSelected");
            $(".tab").addClass("tabNoSelected");
            $(this).removeClass("tabNoSelected");
            $(this).addClass("tabSelected");
            $(".tabBody").slideUp("fast");
            $("#settingsBody").slideToggle("fast");
        });
        $('#hideSideBar').click(function(event) {
            $('#sideBar').coolAnimate('bounceOutLeft', function(target) {
                $('#sideBar').hide();
                $('#showSideBar').show();
            })
        })
        $('#showSideBar').click(function(event) {
            if ($('#sideBar').css('display') == 'none') {
                $('#showSideBar').hide();
                $('#sideBar').show().coolAnimate('bounceInLeft')
            }
        }).trigger('click');
    }
    var table = null;

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
                        return Common.loading($('#tb_content'));
                    },
                    stop: function(loader) {
                        loader.dismiss();
                    }
                }
            },
            rowCreated: function(row, metaData) {
                $(row).data('meta', metaData);
                $('td:first', $(row)).addClass('overflow col-md-2');
                $('td:eq(1)', $(row)).addClass('overflow col-md-2');
                $('td:eq(2)', $(row)).addClass('overflow col-md-2');
                $('td:eq(3)', $(row)).addClass('col-md-4');
                $('td:eq(4)', $(row)).addClass('overflow col-md-2');
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
                    // console.log(data);
                    var output = "<img src='" + data + "' style='max-height:50px'></img>";
                    // Bmob.Image.thumbnail({"image":data,"mode":0,"quality":100,"width":100}

                    //   ).then(function(obj) {

                      
                    //   console.log("url:"+obj.url); 
                    // });
                    return output;
                },
                createdAt: function(data) {
                    return data;
                }
            },
        });
    }

    function addNewProduct() {
        var Product = Bmob.Object.extend("Product"),
            Photo = Bmob.Object.extend("Photo"),
            product = new Product();
        var p_pId = $('input:first', $('#newProduct')).val(),
            p_name = $('input:eq(1)', $('#newProduct')).val(),
            p_description = $('input:eq(2)', $('#newProduct')).val(),
            p_photo = currentUploadImg;

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
                $('input', $('#newProduct')).val('');
                currentUploadImg = null;
                Common.flashMessage('商品添加成功', {
                    style: 'SUCCESS',
                })
            },
            error: function(model, error) {
                Common.flashMessage('添加失败,请稍后再试', {
                    style: 'DANAGER',
                })
            }
        });
    }
    var currentUploadImg = [];

    function initAddNewProduct() {
        $('#uploadImg').click(function(event) {
            var loader = Common.loading('#tb_content');
            var fileUploadControl = $("#fileupload")[0];
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var name = "product.jpg";
                var file = new Bmob.File(name, file);
                file.save().then(function(obj) {
                    currentUploadImg.push(obj.url());
                    Common.flashMessage('图片上传成功', {
                        style: 'SUCCESS',
                    })
                    $('#uploadedPic').append(sprintf($('#uploadedPicTemp').html(), {
                        src: obj.url()
                    }))
                    loader.dismiss();
                });
            };
        })
    
        $('#productId').blur(function(event) {
            var pid = $(this).val();
            if (pid) {
                var Product = Bmob.Object.extend("Product"),
                    query = new Bmob.Query(Product);
                query.equalTo("productId", pid).find({
                    success: function(result) {
                        if (result.length == 0) {
                            $('#productId').data('validate', true).addClass('ok').removeClass('err');
                        } else {
                            $('#productId').data('validate', false).addClass('err').removeClass('ok').val('').attr('placeholder', '编号重复,请重新输入');
                        }
                    },
                    error: function(err) {
                        console.error(err);
                    }
                })
            }
        });

        $('#productName').blur(function(event) {
            var name = $(this).val()
            if (name) {
                var Product = Bmob.Object.extend("Product"),
                    query = new Bmob.Query(Product);
                query.equalTo("name", name).find({
                    success: function(result) {
                        if (result.length == 0) {
                            $('#productName').data('validate', true).addClass('ok').removeClass('err');
                        } else {
                            $('#productName').data('validate', false).addClass('err').removeClass('ok').val('').attr('placeholder', '名字重复,请重新输入');
                        }
                    },
                    error: function(err) {
                        console.error(err);
                    }
                })
            }
        });
    }
    return {
        validateUser:validateUser,
        initSideBar:initSideBar,
        queryData:queryData,
        addNewProduct:addNewProduct,
        initAddNewProduct:initAddNewProduct,
    }
})
