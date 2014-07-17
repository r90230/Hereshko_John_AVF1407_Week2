var temps = "http://api.wunderground.com/api/46f5f78c97801317/forecast/q/autoip.json";

//basic additions

var localWeather = Ti.UI.createLabel({
	text: "Local Weather",
	font: {fontSize: 30, fontWeight: "bold"},
	top: 50,
	left: 20
});

var cameraPic = Ti.UI.createImageView({
	top: 30,
	right: 20,
	image: "camera.png",
	height: "10%",
	width: "20%"
});


mainView.add(cameraPic, localWeather);

//basic additions - end

//database maybe?

var db = Ti.Database.open('weatherDB');
db.execute('DROP TABLE IF EXISTS weather');
db.execute('CREATE TABLE IF NOT EXISTS weather(id INTEGER PRIMARY KEY, day TEXT, forecast TEXT)');
db.file.setRemoteBackup(false);
db.close();

//database ENd

//Week 2 - Camera additions

cameraPic.addEventListener('click', function(e){
	Ti.Media.showCamera({
		saveToPhotoGallery: false,
		allowEditing: true,
		autohide:true,
		mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
		success: function(e) {
			if(e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
				outsideImage = e;
				mainView.backgroundImage = outsideImage.media;
				
			} else {
				alert("thought this was a photo but, it's:" + e.mediaType);
			}
		},
		error: function(error) {
			if (error.code === Ti.Media.NO_CAMERA) {
				alert("please run this on a device");
			} else {
				alert("other error: " + error.code);
			}
		}
	}); //closing showCamera
}); //closing takePicBtn

//Week 2 END

//HTTP Functions

var remoteResponse = function(e){
	if (Ti.Network.online) {
	var json = JSON.parse(this.responseText);

for(i=0;i<5;i++){	
	
	var day = json.forecast.txt_forecast.forecastday[i].title;
	var forecast = json.forecast.txt_forecast.forecastday[i].fcttext;
	var weatherImage = json.forecast.txt_forecast.forecastday[i].icon_url;
	var balancer = i * 115;
	
	var postDay = Ti.UI.createLabel({
		text: day,
		color: "#ff6600",
		top: balancer + 120,
		left: 20
		});
		
	var postForecast = Ti.UI.createLabel({
		text: forecast,
		top: balancer + 138,
		color: "ff0000",
		left: 145,
		width: 160
	});
		
	var postImage = Ti.UI.createImageView({
		image: weatherImage,
		top: balancer + 145,
		left: 35
	});
		
	balancer = balancer + 50;
	
	mainView.add(postImage, postDay, postForecast);
	db.open();
	db.execute('INSERT INTO weather (day, forecast) VALUES (?,?)', day, forecast);
	var lastID = db.lastInsertRowID;
	db.close();
	
	}	
	//end for loop
} else {
	Ti.API.debug("Status: " + this.status);
	Ti.API.debug("Response: " + this.responseText);
	Ti.API.debug("Error: " + e.error);
	alert("There was an error retrieving data. Please try again later.");
};



};
var remoteError = function(e){
	Ti.API.debug("Status: " + this.status);
	Ti.API.debug("Response: " + this.responseText);
	Ti.API.debug("Error: " + e.error);
	alert("There was an error.");
};

var xhr = Ti.Network.createHTTPClient({
	onload: remoteResponse,
	onerror: remoteError,
	timeout: 20000
});

xhr.open("GET", temps);
xhr.send();

//HTTP Functions - end
