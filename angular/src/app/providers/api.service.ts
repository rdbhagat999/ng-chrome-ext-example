import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAB_ID } from './tab-id.provider';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(@Inject(TAB_ID) readonly tabId: number, private http: HttpClient) { }

  connectWithContentScript() {
    const tabQueryData = { active: true, currentWindow: true };
    chrome.tabs.query(tabQueryData, (tabs) => {
        const port = chrome.tabs.connect(tabs[0].id, {name: 'tabs-connect-example'});
        port.postMessage('Hello!');
        port.onMessage.addListener((response) => {
          alert('Content script responded: ' + JSON.stringify(response));
        });
    });
  }

  sendContentScriptCommand(val= 2) {
    const tabQueryData = { active: true, currentWindow: true };
    chrome.tabs.query(tabQueryData, (tabs) => {
      const commandMessage = { command: 'salute', val };
      chrome.tabs.sendMessage(tabs[0].id, commandMessage, (response) => {
        const responseMessage = response && response.message;
      });
    });
  }

  getUser() {
    return this.http.get('https://randomuser.me/api/');
  }

  async setStorageData(data) {
    // USAGE: await setStorageData({ user: someData })
    return new Promise((resolve, reject) => {
      return chrome.storage.sync.set(data, () => {
        return chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
      });
    });
  }

  async getStorageData(key) {
    // USAGE: const { user } = await getStorageData('user')
    return new Promise((resolve, reject) => {
      return chrome.storage.sync.get(key, result => {
        return chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result);
      });
    });
  }

  async removeStorageData(key) {
    // USAGE: await removeStorageData()
    return new Promise((resolve, reject) => {
      return chrome.storage.sync.remove(key, () => {
        return chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
      });
    });
  }

  async clearStorageData() {
    // USAGE: await clearStorageData()
    return new Promise((resolve, reject) => {
      return chrome.storage.sync.clear(() => {
        return chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve();
      });
    });
  }

}
