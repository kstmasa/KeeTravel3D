/**
 * Created by GTI on 2017/5/20.
 */
var panorama;
var current = 0;
function initialize(){
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street_view'),
        { 
            position: {lat:  25.132471, lng: 121.740081},
            pov: {heading: 1, pitch: 0},
            zoom: 1,
            zoomControl:false,
            panControl:false,
            addressControl:false,
            motionTrackingControl:false,
            linksControl:false,
            fullscreenControl:false
    });
}
window.addEventListener("load",function(){
	initialize();
});