/**
 * Created by GTI on 2017/5/20.
 */
var panorama;
var current = 0;
window.addEventListener("load",function(){
	initialize();
	window.setInterval(function() {
		var NowDate = new Date();
		var d = NowDate.getDay();
		var dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
		document.getElementById('currentTime').innerHTML = '目前時間：' + NowDate.toLocaleString() + '（' + dayNames[d] + '）';
	}, 1000);
	window.setInterval(function() {
		var pov = panorama.getPov();
		pov.heading += 0.2;
		panorama.setPov(pov);
	}, 30);
	$("#play_button").on("click",function(){
		$("#play_title").removeClass( "bounceInRight" ).addClass( "zoomOut");
		$("#play_button").addClass( "animated zoomOut");
		$("#exit_button").addClass( "animated zoomOut");
		setTimeout(function() {
			$(".initial_page").hide();
			$(".keelung_city_page").show();
			$("#keelung_background").addClass( "animated zoomIn");
			$("#keelung_citys").addClass( "animated zoomIn");
			panorama.setPosition({lat: 25.1312136, lng: 121.7415504});
		}, 1000);
	});
	$(".back_button").on("click",function(){
		$("#dialog").hide();
		$(".back_button").removeClass("zoomIn").addClass( "animated zoomOut");

		setTimeout(function() {
			$(".back_button").removeClass("zoomOut");
			$(".choose_level_page").hide();
			$(".keelung_city_page").show();

			$("#keelung_background").removeClass( "zoomOut" ).addClass( "zoomIn");
			$("#keelung_citys").removeClass( "zoomOut" ).addClass( "zoomIn");
			panorama.setPosition({lat: 25.1312136, lng: 121.7415504});
		}, 1000);
	});
	$("#level_back_button").on("click",function(){
		$("#choose_level_page_box").removeClass("zoomIn").addClass( "animated zoomOut");
		setTimeout(function() {
			$("#choose_level_page_box").removeClass("zoomOut");
			$("#choose_level_page_box").hide();
			$(".keelung_city_page").show();
			$("#keelung_background").removeClass( "zoomOut" ).addClass( "zoomIn");
			$("#keelung_citys").removeClass( "zoomOut" ).addClass( "zoomIn");
		}, 1000);
	});
	
	$("#city_1").on("click",function(){
		showDialog(); 
	});
	$("#city_2").on("click",function(){
		showDialog(); 
	});
	$("#city_3").on("click",function(){
		showDialog(); 
	});
	$("#city_4").on("click",function(){
		hideKeelung();
		$("#showCityImg").attr("src","asset/img/"+"004.png");
		setTimeout(function() {
			$("#choose_level_page_box").show();
			$("#choose_level_page_box").removeClass("zoomOut").addClass( "animated zoomIn");
		}, 1000);
	});
	$("#city_5").on("click",function(){
		showDialog(); 
	});
	$("#city_6").on("click",function(){
		showDialog(); 
	});
	$("#city_7").on("click",function(){
		showDialog(); 
	});
});

function hideKeelung(){
	$("#keelung_background").addClass( "animated zoomOut");
	$("#keelung_citys").addClass( "animated zoomOut");
	setTimeout(function() {
		$(".keelung_city_page").hide();
		$(".choose_level_page").show();
	}, 1000);
}
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
function showDialog(){
	var randomImg =Math.floor(Math.random()*3);
	var img =["Cat","Cry","Jacky"];
	$("#showImg").attr("src","asset/img/"+img[randomImg] +".jpg");
    $("#dialog").show().css('display', 'flex');
}
