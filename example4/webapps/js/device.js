var deviceTable = null;
var device_list = [];
var device_model_list = [];
var current_device_id = {};
var cmdTimer = {};

$(document).ready(function () {

    $(".leftMenu").removeClass('active')
    $(".devices").addClass('active')


    loadDeviceList();


});



function loadDeviceList() {

    if (deviceTable) {
        deviceTable.destroy();
        $("#deviceTable").html("");
    }

    var fields = [
        {
            mData: 'id',
            sTitle: 'Device Id',
            mRender: function (data, type, row) {

               return data + '<br><small class="m--font-thin">'+(row['name'] ? ''+row['name'] : '')+'</small>'
            }
        },
        {
            mData: 'modelId',
            sTitle: 'Device Model',
            mRender: function (data, type, row) {
                return data ? data : '-';
            }
        },
        {
            mData: 'version',
            sTitle: 'Version',
            sWidth: '5%',
            mRender: function (data, type, row) {
                return data ? data : '-';
            }
        },
        {
            mData: 'channel',
            sTitle: 'Channel',
            sWidth: '5%',
            mRender: function (data, type, row) {
                return data ? data : '-';
            }
        },
        {
            mData: 'status',
            sTitle: 'Status',
            sWidth: '10%',
            orderable: false,
            mRender: function (data, type, row) {

                var currtime =  new Date(moment().subtract(24,'hours')).getTime();
                var msgTime = new Date(row['reportedStamp']).getTime();

                var str = '';

                if(currtime > msgTime){
                    str = '<a href="#" class="text-danger">NON-REPORTING</a>';
                }else{
                    str = '<a href="#" class="text-success">REPORTING</a>';
                }

                return str;
            }
        },
        {
            mData: 'reportedStamp',
            sTitle: 'Last Reported Time',
            sWidth: '15%',
            mRender: function (data, type, row) {
                return data ? moment(data).format('MM/DD/YYYY hh:mm a') : '-';
            }
        },
        {
            mData: 'registeredStamp',
            sTitle: 'Created Time',
            sWidth: '15%',
            mRender: function (data, type, row) {
                return moment(data).format('MM/DD/YYYY hh:mm:ss a')
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
                                <a class="dropdown-item" href="javascript:void(0)" onclick="openModal(2,'`+row["id"]+`')">
						    	<i class="fa fa-edit"></i> Edit Device</a>
						    	<a class="dropdown-item" href="javascript:void(0)" onclick="openModal(3,'`+row["id"]+`')"><i class="fa fa-trash"></i> Delete Device</a>
						  	</div>
						</div>
					`

                return str;
                // return '<button class="btn btn-sm btn-icon btn-default" onclick="openModal(2,\'' + row["id"] + '\')"><i class="icon-edit2"></i></button>' +
                //     '<button class="btn btn-sm btn-icon btn-default" onclick="openModal(3,\'' + row['id'] + '\')"><i class="icon-trash-o"></i></button>';
            }
        }

    ];


    var defaultSorting = [{"reportedStamp": {"order": "desc"}}];

    var queryParams = {
        query: {
            "bool": {
                "must": [],
            }
        },
        sort: [],
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
            aaSorting: [[5, 'desc']],
            "ordering": true,
            iDisplayLength: 10,
            lengthMenu: [[10, 50, 100], [10, 50, 100]],
            aoColumns: fields,
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": API_BASE_PATH + '/elastic/search/query/' + API_TOKEN ,
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

                    queryParams.query['bool']['must'] = [searchJson];

                } else {
                    queryParams.query['bool']['must'] = [];
                }


                var ajaxObj = {
                    "method": "GET",
                    "extraPath": "",
                    "type" : 'DEVICE',
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
                        $(".totalRecords").html(resultData.recordsTotal)
                        device_list =resultData.data;
                        resultData['draw'] = oSettings.iDraw;

                        fnCallback(resultData);
                    }
                });
            }

        };

    deviceTable = $("#deviceTable").DataTable(tableOption);
}



function openModal(type,id) {
    if (type === 1) {
        $("#device_id").removeAttr('readonly');
        $("#device_version").removeAttr('readonly');
        $(".templateAction").html('Create');
        $("#addDevice form")[0].reset();
        $("#addDevice").modal('show');
        $("#addDevice form").attr('onsubmit','addDevice()')
    }else if (type === 2) {
        $(".templateAction").html('Update');
        var obj ={};
        current_device_id = id;

        for(var i=0;i<device_list.length;i++){
            if(id === device_list[i].id){
                obj = device_list[i];
            }
        }
        $("#device_id").attr('readonly','readonly');
        $("#device_version").attr('readonly','readonly');
        $("#device_id").val(obj.id);
        $("#device_name").val(obj.name);
        $("#device_model").val(obj.modelId);
        $("#device_version").val(obj.version);
        $("#addDevice").modal('show');
        $("#addDevice form").attr('onsubmit','updateDevice()')
    }else if (type === 3) {
        current_device_id = id;
        $(".deviceId").html(id)
        $("#deleteModal").modal('show');
    }
}


function addDevice() {

    var deviceObj = {
        "id": $("#device_id").val(),
        "name": $("#device_name").val(),
        "modelId": $("#device_model").val(),
        "version": $("#device_version").val(),
    }

    $(".btnSubmit").attr('disabled','disabled');

    retreiveDevice(deviceObj.id, function (status, data) {
        if (status) {
            $(".btnSubmit").removeAttr('disabled');
            errorMsg('Device ID already exist');
        } else {
            upsertDevice(deviceObj,function (status, data) {
                if (status) {
                    successMsg('Device Created Successfully');
                    loadDeviceList();
                    $("#addDevice").modal('hide');
                } else {
                    errorMsg('Error in Creating Device')
                }
                $(".btnSubmit").removeAttr('disabled');
            })
        }
    })
}


function updateDevice() {

    var deviceObj = {
        "id": $("#device_id").val(),
        "name": $("#device_name").val(),
        "modelId": $("#device_model").val(),
        "version": $("#device_version").val(),
    }

    $(".btnSubmit").attr('disabled','disabled');

    upsertDevice(deviceObj, function (status, data) {
        if (status) {
            successMsg('Device Updated Successfully');
            loadDeviceList();
            $("#addDevice").modal('hide');
        } else {
            errorMsg('Error in Updating Device')
        }
        $(".btnSubmit").removeAttr('disabled');
    })
}


function proceedDelete() {
    deleteDevice(current_device_id,function (status, data) {
        if (status) {
            successMsg('Device Deleted Successfully');
            loadDeviceList();
            $("#deleteModal").modal('hide');
        } else {
            errorMsg('Error in delete')
        }
    })
}
