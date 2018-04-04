module.exports = function () {
    var $ = require('jquery');
    $(function () {
        function loadTable() {
            $('tbody').empty();
            $.ajax({
                url: 'http://localhost:18001/findAllUsers',
                type: 'get'
            }).done(function (res) {
                console.log(res);
                var t = '';
                res.forEach(function (u, i) {
                    t = t + '<tr>';
                    t = t + '<td>' + u.user + '</td>';
                    t = t + '<td>' + u.pw + '</td>';
                    t = t + '<td>';
                    t = t + '<span class="ed" data-user="'+ u.user +'" style="text-decoration: underline; cursor:pointer; color: blue; float:left;">Edit</span>';
                    t = t + '<span class="dl" data-user="'+ u.user +'" style="text-decoration: underline; cursor:pointer; color: red; float:right;">Delete</span>';
                    t = t + '</td>';
                    t = t + '</tr>';
                });
                $('tbody').append(t);

                $('tbody').find('td').find('.ed').click(function (e) {
                    const userName = $(this).data('user');
                    $.ajax({
                        url: 'http://localhost:18001/findByName?user=' + userName,
                        type: 'get'
                    }).done(function (res) {
                        if(res && res.length > 0){
                            $('.pop-up-wrap').css('display','block');
                            console.log(res[0].user, res[0].pw);
                            $('#c_user').val(res[0].user);
                            $('#c_pw').val(res[0].pw);
                        }
                    });
                });

                $('tbody').find('td').find('.dl').click(function (e) {
                    const userName = $(this).data('user');
                    var msg = "您真的确定要删除吗？\n\n请确认！";
                    //var confirm=confirm("Are you sure to delete this account");
                    if(confirm(msg)===true){
                        $.ajax({
                            url: 'http://localhost:18001/delete',
                            type: 'post',
                            dtaType: 'json',
                            data: {user: userName}
                        }).done(function (res) {
                            if(res.success){
                                alert('删除成功！');
                                loadTable();
                            }
                        });
                    }
                })
            });
        }
        loadTable();

        $.ajax({
            url: 'http://localhost:18001/loginCheck',
            type: 'get'
        }).done(function (res) {
            if(!res.success){

                if($(window).attr('location').pathname != '/test.html'){
                    alert(res.msg);
                    $(window).attr('location','./test.html');
                }else {
                    console.log(res.msg);
                }
            }else {
                console.log(res.msg);
            }
        });


        $('#createNew').click(function (e) {
            e.preventDefault();
            var formData = {
                user: $('#user').val(),
                password: $('#password').val()
            };
            console.log(formData, 'create');

            $.ajax({
                url: 'http://localhost:18001/createUser',
                type: 'POST',
                dtaType: 'json',
                data: formData
            }).done(function (res) {
                if(res.success){
                    console.log(res.user);
                    loadTable();
                }else{
                    alert(res.msg)
                }
            });
        });

        $('#login').click(function (e) {
            e.preventDefault();
            var formData = {
                user: $('#user').val(),
                password: $('#password').val()
            };
            console.log(formData, "login");

            $.ajax({
                url: 'http://localhost:18001/login',
                type: 'POST',
                dtaType: 'json',
                data: formData
            }).done(function (res) {
                if(res.success){
                    alert(res.msg);
                    $(window).attr('location','./welcome.html');
                } else {
                  alert(res.msg);
                }
            });
        });
        $('#logout').click(function (e) {
            e.preventDefault();
            $.ajax({
                url: 'http://localhost:18001/logout',
                type: 'GET'
            }).done(function (res) {
                alert(res);
                $(window).attr('location','./test.html');
            });
        });

        $('#change').click(function (e) {
            e.preventDefault();
            var formData = {
                user:$('#c_user').val(),
                password:$('#n_pw').val()
            };
            console.log(formData, 1234);

            $.ajax({
                url: 'http://localhost:18001/modify',
                type: 'POST',
                dtaType: 'json',
                data: formData
            }).done(function (res) {
                if(res.success){
                    alert(res.msg);
                    loadTable();
                    $('.pop-up-wrap').css('display','none');
                } else {
                    alert(res.msg);
                }
            });
        });

        $('#cancel').click(function (e) {
            e.preventDefault();
            $('.pop-up-wrap').css('display','none');
            $('#c_user').val('');
            $('#c_pw').val('');
        });

        $('#button1').click(function (e) {
            e.preventDefault();
            console.log(1235);

            $.ajax({
                url: 'http://localhost:18001/art',
                type: 'POST',
                dtaType: 'json',
                data: {"user":"admin"}
            }).done(function (res) {
                console.log(res)
            });

        });
        $('#button2').click(function (e) {
            e.preventDefault();
            console.log(1235);

            $.ajax({
                url: 'http://localhost:18001/art?id=999',
                type: 'GET'
            }).done(function (res) {
                console.log(res)
            });
        });
    });
};
