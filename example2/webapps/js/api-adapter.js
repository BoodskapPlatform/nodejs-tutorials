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