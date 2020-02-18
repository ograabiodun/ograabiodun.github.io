const publicVapidKey =
  "BFKiYqEmIVbUCLMwukoRwdIYXqDk1Ux_iPG4r_ZSnpGEHCYnVkZQCDk5SgWzJ4fnRvLzXBshuu3ykJ2kmJoCOGI";

//check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.log (err));
}

// Register SW, Register push and send push
async function send() {
  //register service worker
  console.log("registering SW");
  const register = await navigator.serviceWorker.register(
    "/serviceWorker.js"
  );
  console.log("Service Worker Registered...");

  //Register Push
  console.log("Registering push...");
  const subscription = await register.pushManager.subscribe({userVisibleOnly:true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("Push Registered...");

  //Send push notification
  console.log('Sending Push...');
  await fetch('/subscribe', {
      method: 'POST',
      body:JSON.stringify(subscription),
      headers: {
          'content-type': 'application/json'
      }
  });
  console.log('Push sent..');

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});

