var RECORD_ID = 100;



var recordTable = null;
var current_record_id = null;
var current_record_obj = {};
var record_list = [];

$(document).ready(function () {
    $(".leftMenu").removeClass('active')
    $(".records").addClass('active')

    loadRecordsList();

});


function loadRecordsList() {

    const self = this;


    if (recordTable) {
        recordTable.destroy();
        $("#recordTable").html("");
    }

    var fields = [
        {
            mData: 'assetid',
            sTitle: 'Asset Id',
            orderable: false,
            mRender: function (data, type, row) {

                return data ? '<b>'+data+'</b>' : '-';
            }
        },
        {
            mData: 'assetname',
            sTitle: 'Asset Name',
            orderable: false,
            mRender: function (data, type, row) {
                return data ? data : '-';
            }
        },
        {
            mData: 'updatedtime',
            sTitle: 'Updated Time',
            orderable: true,
            mRender: function (data, type, row) {
                return data ? moment(data).format('MM/DD/YYYY hh:mm a') : '-';
            }
        },
        {
            mData: 'createdtime',
            sTitle: 'Createdtime Time',
            orderable: true,
            mRender: function (data, type, row) {
                return data ? moment(data).format('MM/DD/YYYY hh:mm a') : '-';
            }
        },
        {
            mData: 'action',
            sTitle: 'Action',
            orderable: false,
            mRender: function (data, type, row) {

                return '<button class="btn btn-sm btn-icon btn-default" onclick="openModal(2,\'' + row["_id"] + '\')"><i class="fa fa-edit"></i></button>' +
                    '<button class="btn btn-sm btn-icon btn-default" onclick="openModal(3,\'' + row['_id'] + '\')"><i class="fa fa-trash"></i></button>';
            }
        }

    ];


    var defaultSorting = [{"updatedtime": {"order": "desc"}}];

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
        responsive: true,
        paging: true,
        searching: true,
        aaSorting: [[2, 'desc']],
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

                queryParams.query['bool']['must'] = [searchJson];

            } else {
                queryParams.query['bool']['must'] = [];
            }


            var ajaxObj = {
                "method": "GET",
                "extraPath": "",
                "query": JSON.stringify(queryParams),
                "params": [],
                "type" : 'RECORD',
                "specId" : RECORD_ID
            };


            oSettings.jqXHR = $.ajax({
                "dataType": 'json',
                "contentType": 'application/json',
                "type": "POST",
                "url": sSource,
                "data": JSON.stringify(ajaxObj),
                success: function (data) {

                    var resultData = searchQueryFormatter(data).data;
                    record_list =resultData.data;
                    $(".totalRecords").html(resultData.recordsTotal);
                    resultData['draw'] = oSettings.iDraw;

                    fnCallback(resultData);
                }
            });
        }

    };

    recordTable = $("#recordTable").DataTable(tableOption);
}



function openModal(type, id) {

    current_record_id = null;
    current_record_obj = {};

    if (type === 1) {
        $(".templateAction").html('Add');
        $("#addRecord form")[0].reset();
        $("#addRecord").modal('show');
        $("#addRecord form").attr('onsubmit', 'addRecord()')

    } else if (type === 2) {
        $("#addRecord form")[0].reset();

        $(".templateAction").html('Update');
        current_record_id = id;

        for (var i = 0; i < record_list.length; i++) {
            if (id === record_list[i]._id) {
                current_record_obj = record_list[i];
            }
        }
        $("#assetid").val(current_record_obj.assetid);
        $("#assetname").val(current_record_obj.assetname);

        $("#addRecord").modal('show');
        $("#addRecord form").attr('onsubmit', 'updateRecordData()')

    } else if (type === 3) {

        current_record_id = id;

        for (var i = 0; i < record_list.length; i++) {
            if (id === record_list[i]._id) {
                current_record_obj = record_list[i];
            }
        }
        $(".assetname").html(current_record_obj.assetname)
        $("#deleteModal").modal('show');

    }
}


function addRecord() {

    var robj = {
        assetid: $("#assetid").val(),
        assetname :$("#assetname").val(),
        updatedtime: new Date().getTime(),
        createdtime: new Date().getTime()
    };

    $(".btnSubmit").attr('disabled', 'disabled');

    insertRecord(RECORD_ID, robj, function (status, data) {
        if (status) {
            successMsg('Record Created Successfully');
            loadRecordsList();
            $("#addRecord").modal('hide');
        } else {
            errorMsg('Error in Creating Record')
        }
        $(".btnSubmit").removeAttr('disabled');

    })
}


function updateRecordData() {

    var aobj = {
        assetid: $("#assetid").val(),
        assetname :$("#assetname").val(),
        updatedtime: new Date().getTime(),

    };
    aobj['createdtime'] = current_record_obj.createdtime;

    $(".btnSubmit").attr('disabled', 'disabled');

    updateRecord(RECORD_ID, current_record_id, aobj, function (status, data) {
        if (status) {
            successMsg('Record Updated Successfully');
            loadRecordsList();
            $("#addRecord").modal('hide');
        } else {
            errorMsg('Error in Updating Record')
        }
        $(".btnSubmit").removeAttr('disabled');
    })
}


function proceedDelete() {
    deleteRecord(RECORD_ID, current_record_id, function (status, data) {
        if (status) {
            successMsg('Record Deleted Successfully');
            loadRecordsList();
            $("#deleteModal").modal('hide');
        } else {
            errorMsg('Error in Record Delete')
        }
    })
}
