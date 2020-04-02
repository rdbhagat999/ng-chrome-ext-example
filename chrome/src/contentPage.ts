chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  const handler = new Promise((resolve, reject) => {
    if (message) {
      console.log(message);
      resolve(`Hi from contentPage! ${window.location.href} : doubleVal: ${parseInt(message['val'], 10) * 2}`);
    } else {
      reject('message is empty.');
    }
  });

  handler.then(message => sendResponse(message)).catch(error => sendResponse(error));

  // return true;
});

export class ConnectListener {
  constructor() {
    this.initializeMessagesListener();
  }
  initializeMessagesListener() {
    chrome.runtime.onConnect.addListener(this.onConnectHandler.bind(this));
  }
  onConnectHandler(port: chrome.runtime.Port) {
    port.onMessage.addListener(this.onConnectMessageHandler.bind(this));
  }
  onConnectMessageHandler(msg, port) {
    console.log('Received connection message: ' + msg);
    const response = { message: `OnConnectListner: from ${JSON.stringify(port.name)}` };
    port.postMessage(response);
  }
}

export class RuntimeListener {
  constructor() {
      this.initializeMessagesListener();
  }
  initializeMessagesListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const command = message['command'];
      console.log('Received runtime command: ' + command);
      const response = { message: `RuntimeCmd: ${command} ${message['user'].results[0].gender} doubleVal: ${parseInt(message['val'], 10) * 2}` };
      sendResponse(response);
    });
  }
}

const connectListener = new ConnectListener();
const runtimeListener = new RuntimeListener();
