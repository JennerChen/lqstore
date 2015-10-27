function validateUser() {
    var currentUser = Bmob.User.current();
    if (currentUser && currentUser._isCurrentUser) {

    } else {
        window.location = './login.html';
    }
}

function initSideBar() {
    $("#messagesBody").slideToggle("fast"); // The Body of "Messages" is already opened in the design sample.

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
    }).trigger('click');
    $('#showSideBar').click(function(event) {
        if ($('#sideBar').css('display') == 'none') {
            $('#showSideBar').hide();
            $('#sideBar').show().coolAnimate('bounceInLeft')
        }
    });
}
var table = null;
function queryData() {
	var loader = loading('#tb_content');
	var Product = Bmob.Object.extend("Product");
	var query = new Bmob.Query(Product);
	// 查询所有数据
	query.find({
		success: function(results) {
			var ds = [];
			// 循环处理查询到的数据
			for (var i = 0; i < results.length; i++) {
				var temp = results[i].attributes;
					temp.id = results[i].id;
					temp.createdAt = results[i].createdAt;
				ds.push(temp);
			}
			table = geraltTable({
				dataSource: ds,
				selector: $('#tb_content'),
				tableStyle:'TRTD',
				rowCreated: function(row) {
					$('td:first',$(row)).addClass('overflow col-md-2');
					$('td:eq(1)',$(row)).addClass('overflow col-md-2');
					$('td:eq(2)',$(row)).addClass('overflow col-md-2');
					$('td:eq(3)',$(row)).addClass('col-md-4');
					$('td:eq(4)',$(row)).addClass('overflow col-md-2');
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
					photo: function(data){
						var output = "<img src='"+data+"' style='max-height:50px'></img>"
						return output;
					},
					createdAt: function(data){
						return data;
					}
				},
			});
			loader.dismiss();
		},
		error: function(error) {
			alert("查询失败: " + error.code + " " + error.message);
		}
	});
}
function addNewProduct() {
    var Product = Bmob.Object.extend("Product"),
    	product = new Product();
    var p_pId = $('input:first',$('#newProduct')).val(),
    	p_name = $('input:eq(1)',$('#newProduct')).val(),
    	p_description = $('input:eq(2)',$('#newProduct')).val(),
    	p_photo = currentUploadImg;
    product.save({
    	productId:p_pId,
    	name:p_name,
    	description:p_description,
    	photo:p_photo
    }, {
        success: function(object) {
        	flashMessage('商品添加成功',{
        		style:'SUCCESS',
        	})
        },
		error: function(model, error) {
			flashMessage('添加失败,请稍后再试', {
				style: 'DANAGER',
			})
		}
    });
}
var currentUploadImg = null;

function initAddNewProduct() {
	$('#uploadImg').click(function(event) {
		var loader = loading('#tb_content');
		var fileUploadControl = $("#fileupload")[0];
		if (fileUploadControl.files.length > 0) {
			var file = fileUploadControl.files[0];
			var name = "product.jpg";
			var file = new Bmob.File(name, file);
			file.save().then(function(obj) {
				currentUploadImg = obj.url();
				flashMessage('图片上传成功',{
					style:'SUCCESS',
				})
				loader.dismiss();
			});
		};
	});
}
$(function() {
    initBmob();
    validateUser();
    initSideBar();
    initAddNewProduct();
    $('#addNewProduct').click(addNewProduct);
    $('#fileupload').change(function(event) {
    	if($(this).val() && $(this).val()!=''){
    		$('#uploadImg').removeAttr('disabled');
    	}else{
    		$('#uploadImg').prop('disabled',true);
    	}
    });
    queryData();
})
