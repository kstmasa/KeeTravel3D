/**
 * Created by GTI on 2017/5/20.
 */
var panorama;
var current = 0;

window.addEventListener("load",function(){
	initialize();
	$("#play_button").on("click",function(){
		$("#play_title").removeClass( "bounceInRight" ).addClass( "zoomOut");
		$("#play_button").addClass( "animated zoomOut");
		$("#exit_button").addClass( "animated zoomOut");
		setTimeout(function() {
			$(".initial_page").hide();
			$(".keelung_city_page").show();
			$("#keelung_background").addClass( "animated zoomIn");
			panorama.setPosition({lat: 25.1312136, lng: 121.7415504});
		}, 1000);
		
	});
});
window.setInterval(function() {
    var pov = panorama.getPov();
    pov.heading += 0.2;
    panorama.setPov(pov);
}, 30);
function initialize(){
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street_view'),
        {
            position: {lat:  25.164858, lng: 121.727217},
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