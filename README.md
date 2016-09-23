# Chrome Push Notifications with Realtime
This project shows how to use the new Chrome Push Notifications in a website, allowing easy engagement with users that are currently not browsing the website. This project uses the Realtime Messaging JavaScript SDK and requires Chrome 42+

## Realtime + Chrome Push Notifications guide

- Register to get your free Realtime Messaging application key at [https://accounts.realtime.co/signup/](https://accounts.realtime.co/signup/)

- Create a Google Project using GCM. [Follow the tutorial](http://messaging-public.realtime.co/documentation/starting-guide/mobilePushGCM.html).

- Update the Web App Manifest file (`manifest.json`) and enter your Google Project Number obtained from the previous step:

		{
		  "name": "Realtime Chrome Push Demo",
		  "short_name": "Push Demo",
		  "gcm_sender_id": "<YOUR_GOOGLE_PROJECT_NUMBER>"		  
		}
 
- Edit the `service-worker.js` file to change the notification title, body and redirect URL. When a push notification is received this service worker will be executed and the event `push` will be emitted;

- As soon as the page loads execute the `ChromePushManager` to launch the service worker and get the GCM `registrationId`:

    	var chromePushManager = new ChromePushManager('./service-worker.js', function(error, registrationId){
    	... });
     
- Connect a Realtime client and call the `subscribeWithNotifications` method to subscribe the desired channel for push notifications using the GCM `registrationId`:

		client.subscribeWithNotifications(channel, true, registrationId,
                         function (theClient, channel, msg) { ... } );
                           
		
## Private channel vs Global channel
If you want to control to which users you are sending each push you should use a private channel for each user. If you want to broadcast a push notification to all users you should use a global channel that every user subscribes.

A mixed private/global channel strategy can also be used, it really depends on your use case.

## Limitations
1. This will only work on Chrome 42+
2. Your website must use the https protocol (it will work on localhost with http)
3. In Chrome Desktop at least one Chrome tab must be opened in order to receive push notifications (Chrome must be running)
2. At the moment the Chrome push event doesn't allow you to obtain the push payload. If you want to customize your push title and body you'll need to call an external REST API from your service worker. The [Realtime Cloud Storage](http://framework.realtime.co/storage) and [Realtime Code Hosting](http://storage-public.realtime.co/documentation/code-hosting-guide/1.0/overview.html) services might be useful here. 

## Troubleshooting

### Unable to subscribe to push

* Check that you have entered your Firebase Sender ID (or GCM Project Number) in the `gcm_sender_id` of your manifest.json file;

*  Make sure your webserver is properly configured to serve the file manifest.json (check if there are no errors in Chrome Developers Tool network tab). IIS users may need to add the MIME type; 

* If you're not using localhost make sure you are using the https protocol with a valid SSL certificate for the domain you are using;  


## On-line example
You can test the Realtime Chrome Push Notifications at [this on-line example](https://storage-cdn.realtime.co/chrome-push/index.html).
