Pace.options.ajax.trackWebSockets = false;

$(document).ready(function () {
    $(".currentYear").html(moment().format('YYYY'))

    if(GOOGLE_ANALYTICS_COCDE){
        loadGoogleAnalytics(GOOGLE_ANALYTICS_COCDE)
    }

    if(GOOGLE_MAP_API_KEY){
        loadGoogleMaps(GOOGLE_MAP_API_KEY)
    }
});


function loadGoogleAnalytics(ga_token) {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', ga_token, 'auto');
    ga('send', 'pageview');
}



function loadGoogleMaps(key) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=" + key + "&libraries=visualization,places,drawing&callback=geofenceInit");
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
}