  // Generate the user private channel
  var channel = generateUserChannel();

  $(document).ready(function() {

    // we're ready ...
    // check if current browser is Chrome
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if(!is_chrome) {
      alert("No can do ... this demo requires Chrome 42+");
    }

    // update the UI  
    $('#curl').text('curl "http://ortc-developers2-useast1-s0001.realtime.co/send" --data "AK=B2N59F&AT=SomeToken&C=' + channel + '&M=hello"');
    $('#channel').text(channel);
      
    // start Chrome Push Manager to obtain device id and register it with Realtime
    // a service worker will be launched in background to receive the incoming push notifications
    var chromePushManager = new ChromePushManager('./service-worker.js', function(error, registrationId){
      
      if (error) {
        alert(error);
        $("#curl").text("Oops! Something went wrong. It seems your browser does not support Chrome Push Notification. Please try using Chrome 42+");
        $("#sendButton").text("No can do ... this browser doesn't support push notifications");
        $("#sendButton").css("background-color","red");
      };

      // connect to Realtime server
      loadOrtcFactory(IbtRealTimeSJType, function (factory, error) {
        if (error != null) {
          alert("Factory error: " + error.message);
        } else {
           if (factory != null) {
              // Create Realtime Messaging client
              client = factory.createClient();
              client.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
           
              client.onConnected = function (theClient) {
                // client is connected

                // subscribe users to their private channels
                theClient.subscribeWithNotifications(channel, true, registrationId,
                         function (theClient, channel, msg) {
                           // while you are browsing this page you'll be connected to Realtime
                           // and receive messages directly in this callback
                           console.log("Received message from realtime server:", msg);
                         });
              };
           
              // Perform the connection
              // In this example we are using a Realtime application key without any security
              // so you should replace it with your own appkey and follow the guidelines
              // to configure it
              client.connect('B2N59F', 'myAuthenticationToken');
           }
         }
      });
    });    
});

// generate a GUID
function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

// generate the user private channel and save it at the local storage
// so we always use the same channel for each user
function generateUserChannel(){
  userChannel = localStorage.getItem("channel");
  if (userChannel == null || userChannel == "null"){ 
      guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();               
      userChannel = 'channel-' + guid;
      localStorage.setItem("channel", userChannel);
  }
  return userChannel;
}

// send a message to the user private channel to trigger a push notification
function send(){
  if (client) {
    client.send(channel, "This will trigger a push notification");
  };
}
