const { autoUpdater } = require('electron-updater') // import autoupdate
const { app,dialog, BrowserWindow } = require("electron");
const path = require('path');

app.whenReady().then(createWindow); // app readey thì tạo ra cửa sổ 
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1200,
    resizable: true,
    icon:"build/logomes.icns",
  });
  win.loadFile("index.html"); // load file UI 
  autoUpdater.checkForUpdatesAndNotify()    // check notify từ server 
  win.on('closed',()=>{
    win=null
  })
}
// quit when all window are closed 
app.on('window-all-closed',()=>{
  // On macOS it is common for application and their menu bar 
  // to stay active until the user quits explicitly with cmd +Q
  if(process.platform!='darwin'){
    app.quit()
  }
})

app.on('activate',()=>{
  //ON mac it's common to re-create a window in the app when the doc icon is clicked and there are no ather window open
  if(win===null){
    createWindow()
  }
})
autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Ok'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version is being downloaded.'
	}
	dialog.showMessageBox(dialogOpts, (response) => {

	});
})
autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	};
	dialog.showMessageBox(dialogOpts).then((returnValue) => {
		if (returnValue.response === 0) autoUpdater.quitAndInstall()
	})
});
