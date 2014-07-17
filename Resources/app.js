Titanium.UI.setBackgroundColor('#000');

var mainWin = Ti.UI.createWindow({
	backgroundColor: "#fff"
});

var mainView = Ti.UI.createScrollView({
	backgroundImage: "backPic.jpg",
	showVerticalScrollIndicator: true
});


var addOn = require("resource");

mainWin.add(mainView);
mainWin.open();
