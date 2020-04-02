import { ApiService } from './../../../../providers/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { TAB_ID } from '../../../../providers/tab-id.provider';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss']
})
export class PopupComponent implements OnInit {
  message: string;

  constructor(@Inject(TAB_ID) readonly tabId: number, private apiService: ApiService) {}

  ngOnInit() {
    this.connectWithContentScript();
    // this.sendContentScriptCommand();
  }

  async onClick(val): Promise<void> {

    const commandMessage = { command: 'salute', val };

    this.apiService.getUser()
    .subscribe(async (user) => {
      await this.apiService.setStorageData({user});
      this.message = await bindCallback<string>(
        chrome.tabs.sendMessage.bind(this, this.tabId, {...commandMessage, user})
      )()
      .pipe(
        map(msg =>
          chrome.runtime.lastError
            ? 'The current page is protected by the browser, goto: https://www.google.com and try again.'
            : JSON.stringify(msg)
        )
      )
      .toPromise();
    });

  }

  async connectWithContentScript() {
    const { user }: any = await this.apiService.getStorageData('user');
    console.log('user', user);
    this.apiService.connectWithContentScript();
  }

  sendContentScriptCommand(val= 2) {
    this.apiService.sendContentScriptCommand(val);
  }

}
