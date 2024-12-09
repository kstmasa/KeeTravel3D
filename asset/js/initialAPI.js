$(function(){
    initLink();
})

function initLink(){
	let key = getCookie("ApiKey");
	if(key != null && key != ""){
		appendScript(key);
	}else{
        let inpuKey = prompt('API Key :');
        if(inpuKey != null && inpuKey!= ''){
            setCookie("ApiKey", inpuKey);
            appendScript(inpuKey);
        } else{
            window.location.href = "https://www.google.com/";
        }
	}
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

function setCookie(cname, cvalue){
    const d = new Date();
    // one day period
    d.setTime(d.getTime() + (1*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname+"="+cvalue+ ";" + expires + ";path=/";
}
function appendScript(key) {
    var script = document.createElement('script');
    script.type = 'text/javascript';

	var path = window.location.pathname;
	var page = path.split("/").pop();

	//<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyDEZGTZJO5mE0hehl8MlDxMPx7Q5Su57rs" type="text/javascript"></script>
	//<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDEZGTZJO5mE0hehl8MlDxMPx7Q5Su57rs&callback=initialize&sensor=false&libraries=geometry"></script>
	
	//if(page == "start.html"){
	if(false){
		script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=" + key;
	}else{
		script.src = "https://maps.googleapis.com/maps/api/js?key=" + key+"&callback=initialize&sensor=false&libraries=geometry";	
		script.async=false;
	}

    document.head.appendChild(script);

};