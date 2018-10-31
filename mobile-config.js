// This section sets up some basic app metadata, the entire section is optional.
App.info({
    id: 'com.sleepyfox.notes',
    name: 'notes',
    version: "0.0.1",
    description: 'Simple notes application',
    author: 'Sleepy Fox Dev',
    email: 'jporter@sleepyfoxdev.com',
    website: 'http://sleepyfoxdev.com'
});
  
// Set up resources such as icons and launch screens.
App.icons({
    'android_mdpi_portrait': 'public/images/favicon.png',
    'android_hdpi_portrait': 'public/images/favicon.png',
    'android_xhdpi_portrait': 'public/images/favicon.png',
    'android_xxhdpi_portrait': 'public/images/favicon.png',
    'android_xxxhdpi_portrait': 'public/images/favicon.png',
    'android_xxxhdpi_landscape': 'public/images/favicon.png'
    // More screen sizes and platforms...
});
  
// App.launchScreens({
//     'iphone_2x': 'splash/Default@2x~iphone.png',
//     'iphone5': 'splash/Default~iphone5.png',
//     // More screen sizes and platforms...
// });
  
  // Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
// App.setPreference("SplashScreen", "mySplash"); // which splash to show
// App.setPreference("SplashScreenDelay", 3000); //how long splash appears
  
  // Pass preferences for a particular PhoneGap/Cordova plugin.
// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//     APP_ID: '1234567890',
//     API_KEY: 'supersecretapikey'
// });
  
  // Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
  // generated config.xml. 'Universal Links' is shown as an example here.
// App.appendToConfig(`
//     <universal-links>
//       <host name="localhost:3000" />
//     </universal-links>
// `);