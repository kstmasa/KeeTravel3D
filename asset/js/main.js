/**
 * Created by GTI on 2017/5/20.
 */
var panorama;
var current = 0;

window.addEventListener("load",function(){
	initialize();
	$("#play_button").on("click",function(){
		$(".initial_page").hide();
		$(".keelung_city_page").show();
	});
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
			moveForward();
	}
	function difference(link) {
		return Math.abs(panorama.pov.heading%360 - link.heading);
	}

	function moveForward() {
		var curr;
		for(i=0; i < panorama.links.length; i++) {
			var differ = difference(panorama.links[i]);
			if(curr == undefined) {
				curr = panorama.links[i];
			}

			if(difference(curr) > difference(panorama.links[i])) {
				curr = panorama.links[i];
			}
		}
		panorama.setPano(curr.panorama);
	}

});
