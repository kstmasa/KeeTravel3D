/**
 * Created by GTI on 2017/5/20.
 */
var panorama;
window.addEventListener("load",function(){
	initialize();
	$("#score").text(localStorage.score);
	
	window.setInterval(function() {
		var NowDate = new Date();
		var d = NowDate.getDay();
		var dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
		document.getElementById('currentTime').innerHTML = '目前時間：' + NowDate.toLocaleString() + '（' + dayNames[d] + '）';
	}, 1000);
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
	
	var point_1 = {lat: 25.160248, lng: 121.763789};
	
	map = new google.maps.Map(document.getElementById("map"), mapOpt);
	geocoder = new google.maps.Geocoder();
	
	directions_service = new google.maps.DirectionsService();
	directions_renderer = new google.maps.DirectionsRenderer({draggable:false, markerOptions:{visible: false}});
	directions_renderer.setMap(map);
	directions_renderer.setOptions({preserveViewport:true});
	//create 和平島tp點位
	createTP(point_1, map);
	//create question
	initialQuestion();
	camera_pin = new google.maps.Marker({
		position: start_point,
		map: map
	});
	// create $(#map) position
	pivot_pin = new google.maps.Marker({
		position: start_point,
		draggable: true,
		map: map
	});
	// if you move, it will change map position in $(#map)
	panorama.addListener('position_changed', function() {
		
		camera_pin.setPosition(panorama.getPosition());
		map.setCenter(panorama.getPosition());
	});
	
	
	/* Hyperlapse */

	var pano = document.getElementById('street_view');
	var is_moving = false;
	var px, py;
	var onPointerDownPointerX=0, onPointerDownPointerY=0;

	var hyperlapse = new Hyperlapse(pano, {
		lookat: start_point,
		fov: 80,
		millis: 100,
		width: window.innerWidth,
		height: window.innerHeight,
		zoom: 2,
		use_lookat: false,
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
		$("#loading_img").hide();
		$("#take_bus").text("公車已進站");
		$("#take_bus").on("click",function(){
		$(".gm-style:first").hide();
			hyperlapse.play();
		});
	};

	hyperlapse.onFrame = function(e) {
		
		camera_pin.setPosition(e.point.location);
		map.setCenter(camera_pin.getPosition());
		if(end_point.equals(e.point.location)){
			hyperlapse.pause();
			$("#take_bus").text("已到達目的地");
			panorama.setPosition(end_point);
			$("#teleport").text("回傳至出發地");
			$(".gm-style").show();
		}

		
	};
	
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
		if($(this).text()=="回傳至出發地"){
			camera_pin.setPosition(start_point);
			panorama.setPosition(start_point);
			$(this).text("傳送至目的地");
		}else{
			$("#take_bus").text("已到達目的地");
			panorama.setPosition(end_point);
			$(this).text("回傳至出發地");
		}
	});
	
});
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
function createTP(arr, m){
	var marker = new google.maps.Marker({
		// The below line is equivalent to writing:
		// position: new google.maps.LatLng(-34.397, 150.644)
		position: arr,
		map: panorama,
		icon: "asset/img/tp.png"
	});
	marker.addListener('click', function() {
		var tp_point = new google.maps.LatLng(25.16036230144654,121.7637650268457);
		if(tp_point.equals(panorama.getPosition())){
			tp_point = new google.maps.LatLng(25.158970000000004,121.76354);
		}
		panorama.setPosition(tp_point);
	});
}
function initialQuestion(){
	var question = [
		['Q1',25.16064531460982, 121.7637755334104,'請問這隻魚是?','旗魚','白魚','黑魚'],
		['Q2',25.160225, 121.761374,'請問旁邊海洋的名稱是?','東海','西海','北海'],
		['Q3',25.158970000000004,121.76354,'請問小丸子們要去做什麼運動?','游泳','跑步','飆車'],
		['Q4',25.160856,121.7636883,'下列何項沒有在海角樂園出現?','環球影城','生態池','沙灘區'],
		['Q5',25.132062,121.739964,'請問這尊是?','蔣公','勞工','三公'],
		['Q6',25.1422881,121.8022742,'請問這間廟是?','福長宮','福安宮','法輪宮'],
		['Q7',25.1402658,121.8001132,'請問內政部提的字是?','臺灣水準原點','基隆水準原點','回到原點'],
		['Q8',25.140464, 121.801781,'請問這座橋是?','平浪橋','高橋','獨木橋']
	];
	var marker=[];
	for (var i = 0; i < question.length; i++) {
		var ques = question[i];
		console.log(i+'<br>'+ques[i]);
		marker[i] = new google.maps.Marker({
			position: {lat: ques[1], lng: ques[2]},
			map: panorama,
			icon: "asset/img/ques_logo.png",
			title: ques[0],
		});
		
		$("#question_dialog").append("<div id='question_"+i+"' class='question_dialog'></div>");
		$("#question_"+i).append("<img id='question_img"+i+"' width='200' height='200' src='asset/img/"+ques[0]+".jpg'/>");
		$("#question_"+i).append("<div id='question_content"+i+"'><h1>"+ques[3]+"</h1></div>");
		$("#question_"+i).append("<div id='question_answer"+i+"'><button onclick='checkAns(1,question_"+i+")'>"+ques[4]+"</button><button onclick='checkAns(0,question_"+i+")'>"+ques[5]+"</button><button onclick='checkAns(0,question_"+i+")'>"+ques[6]+"</button></div>");
		var addListener = function (i) {
			google.maps.event.addListener(marker[i], 'click', function(){
				console.log("#question_"+i);
				if(ques[0])
				$("#question_"+i).show();                 
			});
		}
		addListener(i);
	}
}

function checkAns(val,div){
	if(val){
		if (localStorage.score) {
            localStorage.score = Number(localStorage.score)+1;
        } else {
            localStorage.score = 1;
        }
		$("#score").text(localStorage.score);
		$("#correct").show();
	
		window.setTimeout(function() {
			$("#correct").hide();
			$("#"+div.id+"").hide();
		},1000);
	}else{

		$("#worng").show();

		window.setTimeout(function() {
			$("#worng").hide();
		},500);
	}
}