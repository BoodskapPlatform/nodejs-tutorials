$(document).ready(function () {
    renderUserDetails()
    loadUserProfilePicture()
});

function renderUserDetails() {
    $(".user_profile_name").html(USER_OBJ.firstName +' '+(USER_OBJ.lastName ? USER_OBJ.lastName : ''))
}


function removeCookies() {
    Cookies.remove('session_obj');
    Cookies.remove('domain_logo');
    Cookies.remove('user_picture');
}

function logout() {
    loginOutCall(function (status,data) {
        removeCookies();
        document.location='/login';

    });


}


function loadUserProfilePicture() {

    if (!Cookies.get('user_picture')) {

        getUserProperty(PROFILE_PICTURE_PROPERTY, function (status, data) {
            if (status) {
                var src = JSON.parse(data.value);
                Cookies.set('user_picture', src.picture);
                $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + API_TOKEN + '/' + src.picture);
            } else {
                $(".user_profile_picture").attr('src', "/images/avatar.png");
            }

        })
    } else {
        $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + API_TOKEN + '/' + Cookies.get('user_picture'));
    }
}


function openNav() {
    if($("#sideNavBar").hasClass('barwidth')){
        $(".barmenu").html('<i class="fa fa-bars"></i>')
        $("#sideNavBar").removeClass('barwidth')
        $("#sideNavBar").hide();
    }else{
        $(".barmenu").html('<i class="fa fa-times"></i>')
        $("#sideNavBar").addClass('barwidth')
        $("#sideNavBar").show()
    }
}