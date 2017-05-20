/**
 * Created by GTI on 2017/5/20.
 */
var panorama;
function initialize() {
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
            position: {lat:  25.164858, lng: 121.727217},
            pov: {heading: 165, pitch: 0},
            zoom: 1,
            zoomControl:false,
            panControl:false,
            addressControl:false,
            motionTrackingControl:false,
            linksControl:false,
            fullscreenControl:false
        });
}