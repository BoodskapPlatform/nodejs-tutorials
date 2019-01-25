$(document).ajaxError(function myErrorHandler(event, xhr, ajaxOptions, thrownError) {

    if (xhr.status === 417 && xhr.responseJSON.code === 'INVALID_AUTH_TOKEN') {
        Cookies.remove('session_obj');
        document.location = '/login';
    }

});


//Auth Calls

function loginCall(email, password, cbk) {
    var str = DOMAIN_KEY ? '?targetDomainKey=' + DOMAIN_KEY : '';
    $.ajax({
        url: API_BASE_PATH + "/domain/login/" + email + "/" + password + str,
        type: 'GET',
        success: function (data) {
            cbk(true, data);
        },
        error: function (e) {
            cbk(false, null);
        }
    });

}

function loginOutCall(cbk) {
    $.ajax({
        url: API_BASE_PATH + "/domain/logout/" + API_TOKEN,
        type: 'GET',
        success: function (data) {
            cbk(true);
        },
        error: function (e) {
            cbk(false);
        }
    });

}



//Property Calls

function getUserProperty(name, cbk) {
    $.ajax({
        url: API_BASE_PATH + "/user/property/get/" + API_TOKEN + "/" + USER_OBJ.email + "/" + name,
        type: 'GET',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, null);
        }
    });

}

function getDomainProperty(name, cbk) {

    $.ajax({
        url: API_BASE_PATH + "/domain/property/get/" + API_TOKEN + "/" + name,
        type: 'GET',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, null);
        }
    });

}


//Elastic Search

function searchByQuery(id, type, data, cbk) {

    if(id){
        data['specId'] = id
    }
    data['type'] = type;

    $.ajax({
        url: API_BASE_PATH + "/elastic/search/query/" + API_TOKEN,
        data: JSON.stringify(data),
        contentType: "application/json",
        type: 'POST',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, e);
        }
    });
}



//Record insert/update/delete

function insertRecord(id, data,cbk){
    $.ajax({
        url: API_BASE_PATH + "/record/insert/dynamic/" + API_TOKEN + '/' + id,
        data: JSON.stringify(data),
        contentType: "text/plain",
        type: 'POST',
        success: function (data) {
            cbk(true,data)
        },
        error: function (e) {
            cbk(false,e)
        }
    });
}

function updateRecord(rid, id, data,cbk){
    $.ajax({
        url: API_BASE_PATH + "/record/insert/static/" + API_TOKEN + '/' + rid +'/'+id,
        data: JSON.stringify(data),
        contentType: "text/plain",
        type: 'POST',
        success: function (data) {
            cbk(true,data)
        },
        error: function (e) {
            cbk(false,e)
        }
    });
}

function deleteRecord(rid, id,cbk){
    $.ajax({
        url: API_BASE_PATH + "/record/delete/" + API_TOKEN + '/' + rid + '/' + id,
        type: 'DELETE',
        success: function (data) {
            cbk(true,data)
        },
        error: function (e) {
            cbk(false,e)
        }
    });
}


//User Management

function upsertUserProperty(data, cbk) {


    $.ajax({
        url: API_BASE_PATH + "/user/property/upsert/" + API_TOKEN,
        data: JSON.stringify(data),
        contentType: "application/json",
        type: 'POST',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, e);
        }
    });
}


function upsertUser(data, cbk) {


    $.ajax({
        url: API_BASE_PATH + "/user/upsert/" + API_TOKEN,
        data: JSON.stringify(data),
        contentType: "application/json",
        type: 'POST',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, e);
        }
    });
}

function retreiveUser(id, cbk) {


    $.ajax({
        url: API_BASE_PATH + "/user/get/" + API_TOKEN + '/' + id,
        // data:  JSON.stringify(data),
        contentType: "application/json",
        type: 'GET',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, null);
        }
    });

}

function deleteUser(id, cbk) {
    $.ajax({
        url: API_BASE_PATH + "/user/delete/" + API_TOKEN + "/" + id,
        type: 'DELETE',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, null);
        }
    });


}


// Device Management


//Device Management
function upsertDevice(data, cbk) {


    $.ajax({
        url: API_BASE_PATH + "/device/upsert/" + API_TOKEN,
        data: JSON.stringify(data),
        contentType: "application/json",
        type: 'POST',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, e);
        }
    });
}

function retreiveDevice(id, cbk) {


    $.ajax({
        url: API_BASE_PATH + "/device/get/" + API_TOKEN + '/' + id,
        // data:  JSON.stringify(data),
        contentType: "application/json",
        type: 'GET',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, null);
        }
    });

}

function deleteDevice(id, cbk) {
    $.ajax({
        url: API_BASE_PATH + "/device/delete/" + API_TOKEN + "/" + id,
        type: 'DELETE',
        success: function (data) {
            //called when successful
            cbk(true, data);
        },
        error: function (e) {
            //called when there is an error
            //console.log(e.message);
            cbk(false, null);
        }
    });


}