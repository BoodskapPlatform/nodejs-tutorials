var user_list = [];
var userTable = null;


$(document).ready(function () {
    $(".leftMenu").removeClass('active')
    $(".users").addClass('active')

    loadUsersList();

});


function loadUsersList() {


    if (userTable) {
        userTable.destroy();
        $("#userTable").html("");
    }

    var fields = [
        {
            mData: 'fullname',
            sTitle: 'Full Name',
            orderable: false,
            mRender: function (data, type, row) {
                data = (row['firstName'] ? row['firstName'] : "") + " " + (row['lastName'] ? row['lastName'] : "");
                return data;
            }
        },
        {
            mData: 'email',
            sTitle: 'Email',
            orderable: false

        },
        {
            mData: 'primaryPhone',
            sTitle: 'Mobile No.',
            orderable: false,
            mRender: function (data, type, row) {
                return data ? data : "-";
            }
        },
        {
            mData: 'roles',
            sTitle: 'Roles',
            orderable: false,
            mRender: function (data, type, row) {

                return data.join("<br>");
            }
        },
        {
            mData: 'registeredStamp',
            sTitle: 'Created Time',
            mRender: function (data, type, row) {
                return data ? moment(data).format('MM/DD/YYYY hh:mm:ss a') : "-";
            }
        },
        {
            mData: 'action',
            sTitle: 'Action',
            orderable: false,
            sWidth: '10%',
            mRender: function (data, type, row) {

                var str = `

                        <div class="btn-group">
                            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu" x-placement="bottom-start" 
                            style="position: absolute; transform: translate3d(0px, 29px, 0px); top: 0px; left: 0px; will-change: transform;    overflow: hidden;">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="openModal(2,'`+row["email"]+`')">
						    	<i class="fa fa-edit"></i> Edit User</a>
						    	<a class="dropdown-item" href="javascript:void(0)" onclick="openModal(3,'`+row["email"]+`')"><i class="fa fa-trash"></i> Delete User</a>
						  	</div>
						</div>
					`

                return str;

            }
        }

    ];



    var domainKeyJson = {"match": {"domainKey": DOMAIN_KEY}};
    var defaultSorting = [];

    var queryParams = {
        query: {
            "bool": {
                "must": [],
            }
        },

        sort: []
    };

    var tableOption = {
        fixedHeader: {
            header: true,
            headerOffset: -5
        },
        "language": {

            "processing": '<i class="fa fa-spinner fa-spin"></i> Processing'
        },
        responsive: true,
        paging: true,
        searching: true,
        aaSorting: [[4, 'desc']],
        "ordering": true,
        iDisplayLength: 10,
        lengthMenu: [[10, 50, 100], [10, 50, 100]],
        aoColumns: fields,
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": API_BASE_PATH + '/elastic/search/query/' + API_TOKEN,
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {

            var keyName = fields[oSettings.aaSorting[0][0]]

            var sortingJson = {};
            sortingJson[keyName['mData']] = {"order": oSettings.aaSorting[0][1]};
            queryParams.sort = [sortingJson];

            queryParams['size'] = oSettings._iDisplayLength;
            queryParams['from'] = oSettings._iDisplayStart;

            var searchText = oSettings.oPreviousSearch.sSearch;

            if (searchText) {
                var searchJson = {
                    "multi_match": {
                        "query": '*' + searchText + '*',
                        "type": "phrase_prefix",
                        "fields": ['_all']
                    }
                };

                queryParams.query['bool']['must'] = [domainKeyJson, searchJson];

            } else {
                queryParams.query['bool']['must'] = [domainKeyJson];
            }


            var ajaxObj = {
                "method": "GET",
                "extraPath": "",
                type : 'USER',
                "query": JSON.stringify(queryParams),
                "params": []
            };


            oSettings.jqXHR = $.ajax({
                "dataType": 'json',
                "contentType": 'application/json',
                "type": "POST",
                "url": sSource,
                "data": JSON.stringify(ajaxObj),
                success: function (data) {

                    var resultData = searchQueryFormatter(data).data;
                    user_list =resultData.data;
                    $('.totalRecords').html(resultData.recordsTotal)
                    resultData['draw'] = oSettings.iDraw;

                    fnCallback(resultData);
                }
            });
        }

    };

    userTable = $("#userTable").DataTable(tableOption);

}


function openModal(type, id) {
    if (type === 1) {
        $("#emailId").removeAttr('readonly');
        $(".templateAction").html('Create');
        $("#password").attr('required', 'required');
        $("#addUser form")[0].reset();
        $("#addUser").modal('show');
        $("#addUser form").attr('onsubmit', 'addUser()')
    } else if (type === 2) {
        $(".templateAction").html('Update');
        var obj = {};
        current_user_id = id;

        for (var i = 0; i < user_list.length; i++) {
            if (id === user_list[i].email) {
                obj = user_list[i];
            }
        }

        $("#addUser form")[0].reset();

        $("#emailId").attr('readonly', 'readonly');

        $("#password").removeAttr('required');

        $("#firstName").val(obj.firstName);
        $("#lastName").val(obj.lastName);
        $("#mobileNo").val(obj.primaryPhone);
        $("#emailId").val(obj.email);
        $("#role").val(obj.roles[0]);

        $("#country").val(obj.country ? obj.country : '')
        $("#state").val(obj.state ? obj.state : '')
        $("#city").val(obj.city ? obj.city : '')
        $("#address").val(obj.address ? obj.address : '')
        $("#zipcode").val(obj.zipcode ? obj.zipcode : '')


        $("#addUser").modal('show');
        $("#addUser form").attr('onsubmit', 'updateUser()')
    } else if (type === 3) {
        var obj = {};
        current_user_id = id;

        for (var i = 0; i < user_list.length; i++) {
            if (id === user_list[i].email) {
                obj = user_list[i];
            }
        }

        $(".fullName").html((obj['firstName'] ? obj['firstName'] : "") + " " + (obj['lastName'] ? obj['lastName'] : ""));
        $("#deleteModal").modal('show');
    } else if (type === 4) {
        current_user_id = id;
        $(".loginAs").html(id)
        $("#domainModal").modal('show')
    }
}


function addUser() {

    var userObj = {
        "firstName": $("#firstName").val(),
        "lastName": $("#lastName").val(),
        "primaryPhone": $("#mobileNo").val(),
        "email": $("#emailId").val(),
        "password": $("#password").val(),
        "roles": ['user'],
        "address" : $("#address").val(),
        "country" : $("#country").val(),
        "state" : $("#state").val(),
        "city" : $("#city").val(),
        "zipcode" : $("#zipcode").val()
    }

    $(".btnSubmit").attr('disabled', 'disabled');

    retreiveUser(userObj.email, function (status, data) {
        if (status) {
            $(".btnSubmit").removeAttr('disabled');
            errorMsgBorder('User Email ID already exist', 'emailId');
        } else {
            upsertUser(userObj, function (status, data) {
                if (status) {
                    successMsg('User Created Successfully');
                    loadUsersList();
                    $("#addUser").modal('hide');
                } else {
                    errorMsg('Error in Creating User')
                }
                $(".btnSubmit").removeAttr('disabled');
            })
        }
    })
}


function updateUser() {

    var userObj = {
        "firstName": $("#firstName").val(),
        "lastName": $("#lastName").val(),
        "primaryPhone": $("#mobileNo").val(),
        "email": $("#emailId").val(),
        "roles": ['user'],
        "address" : $("#address").val(),
        "country" : $("#countryId").val(),
        "state" : $("#stateId").val(),
        "city" : $("#cityId").val(),
        "zipcode" : $("#zipcode").val()
    };

    if ($.trim($("#password").val()) === '') {
        userObj['password'] = ' ';
    } else {
        userObj['password'] = $.trim($("#password").val());
    }

    $(".btnSubmit").attr('disabled', 'disabled');

    upsertUser(userObj, function (status, data) {
        if (status) {
            successMsg('User Updated Successfully');
            loadUsersList();
            $("#addUser").modal('hide');
        } else {
            errorMsg('Error in Updating User')
        }
        $(".btnSubmit").removeAttr('disabled');
    })
}


function proceedDelete() {
    deleteUser(current_user_id, function (status, data) {
        if (status) {
            successMsg('User Deleted Successfully');
            loadUsersList();
            $("#deleteModal").modal('hide');
        } else {
            errorMsg('Error in delete')
        }
    })
}