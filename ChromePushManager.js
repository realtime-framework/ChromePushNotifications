
var ChromePushManager = function(serviceWorkerPath, callback){
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register(serviceWorkerPath)
		.then(ChromePushManager.initialiseState(callback));
	} else {
		callback('Service workers aren\'t supported in this browser.', null);
	}
}

ChromePushManager.initialiseState = function (callback) {  
  // Are Notifications supported in the service worker?  
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
    callback('Notifications aren\'t supported.', null);  
  } else if (Notification.permission === 'denied') {  
    callback('The user has blocked notifications.', null);  
  } else if (!('PushManager' in window)) {  
    callback('Push messaging isn\'t supported.', null);  
  } else {
  	ChromePushManager.subscribeBrowserId(callback);
  }
}

ChromePushManager.subscribeBrowserId = function(callback) {  
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})  
      .then(function(subscription) {  
        var register = ChromePushManager.getRegistrationId(subscription);
        callback(null, register);
      })  
      .catch(function(e) {  
        if (Notification.permission === 'denied') {  
          callback('Permission for Notifications was denied', null);  
        } else {  
          callback('Unable to subscribe to push.', null);  
        }  
      });  
  }); 
}

ChromePushManager.getRegistrationId = function(pushSubscription) {
  if (pushSubscription.subscriptionId) {
    return pushSubscription.subscriptionId;
  }

  var endpoint = 'https://android.googleapis.com/gcm/send/';
  parts = pushSubscription.endpoint.split(endpoint);

  if(parts.length > 1)
  {
    return parts[1];
  }

} 

