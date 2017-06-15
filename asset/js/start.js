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
	var start_point = new google.maps.LatLng(25.1324, 121.73980000000006);
	var end_point = new google.maps.LatLng(25.15761094284425, 121.76387091424454);
	var _route_markers = [];
	if( window.location.hash ) {
		parts = window.location.hash.substr( 1 ).split( ',' );
		start_point = new google.maps.LatLng(parts[0], parts[1]);
		end_point = new google.maps.LatLng(parts[2], parts[3]);
		//畫面帶到 start_point
		panorama.setPosition(start_point);
	}
	var mapOpt = { 
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: start_point,
		zoom: 15
	};
	map = new google.maps.Map(document.getElementById("map"), mapOpt);
	geocoder = new google.maps.Geocoder();
	
	directions_service = new google.maps.DirectionsService();
	directions_renderer = new google.maps.DirectionsRenderer({draggable:false, markerOptions:{visible: false}});
	directions_renderer.setMap(map);
	directions_renderer.setOptions({preserveViewport:true});

	// create $(#map) position
	pivot_pin = new google.maps.Marker({
		position: start_point,
		draggable: true,
		map: map
	});
	// if you move, it will change map position in $(#map)
	panorama.addListener('position_changed', function() {
		pivot_pin.setPosition(panorama.getPosition());
		map.setCenter(panorama.getPosition());
	});
	
	/* Hyperlapse */

	var pano = document.getElementById('pano');
	var is_moving = false;
	var px, py;
	var onPointerDownPointerX=0, onPointerDownPointerY=0;

	var hyperlapse = new Hyperlapse(pano, {
		fov: 80,
		millis: 50,
		width: window.innerWidth,
		height: window.innerHeight,
		zoom: 1,
		use_lookat: true,
		distance_between_points: 5,
		max_points: 100,
	});
	
	

	hyperlapse.onError = function(e) {
		console.log( "ERROR: "+ e.message );
	};

	hyperlapse.onRouteProgress = function(e) {
		_route_markers.push( new google.maps.Marker({
			position: e.point.location,
			draggable: false,
			icon: "dot_marker.png",
			map: map
			})
		);
	};

	hyperlapse.onRouteComplete = function(e) {
		directions_renderer.setDirections(e.response);
		console.log( "Number of Points: "+ hyperlapse.length() );
		hyperlapse.load();
	};

	hyperlapse.onLoadProgress = function(e) {
		console.log( "Loading: "+ (e.position+1) +" of "+ hyperlapse.length() );
	};

	hyperlapse.onLoadComplete = function(e) {
		//完成
	};

	hyperlapse.onFrame = function(e) {
		
		// 開始動作
		console.log( "" +
			"Start: " + start_pin.getPosition().toString() + 
			"<br>End: " + end_pin.getPosition().toString() + 
			"<br>Lookat: " + pivot_pin.getPosition().toString() + 
			"<br>Position: "+ (e.position+1) +" of "+ hyperlapse.length() );
		camera_pin.setPosition(e.point.location);
		
		if(end_point.equals(e.point.location)){
			hyperlapse.pause();
		}

		
	};
	
	/* Dat GUI */

	var gui = new dat.GUI();

	var o = {
		distance_between_points:10, 
		max_points:100, 
		fov: 80, 
		tilt:0, 
		millis:50, 
		offset_x:0,
		offset_y:0,
		offset_z:0,
		position_x:0,
		position_y:0,
		use_lookat:false,
		screen_width: window.innerWidth,
		screen_height: window.innerHeight,
		generate:function(){
			console.log( "Generating route..." );

			directions_renderer.setDirections({routes: []});

			var marker;
			while(_route_markers.length > 0) {
				marker = _route_markers.pop();
				marker.setMap(null);
			}

			request = {
				origin: start_point, 
				destination: end_point, 
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			directions_service.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {   
					hyperlapse.generate({route: response});
				} else {
					console.log(status);
					
				}
			})
		},
	};
	
	o.generate();
	
	$("#teleport").on("click",function(){
		console.log(panorama.getPosition());
		if(end_point.equals(panorama.getPosition())){
			panorama.setPosition(start_point);
			$(this).text("傳送至目的地");
		}else{
			panorama.setPosition(end_point);
			$(this).text("回傳至出發地");
		}
	});
});