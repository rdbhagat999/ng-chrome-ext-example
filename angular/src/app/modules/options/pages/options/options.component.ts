import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from './../../../../providers/api.service';
import { TAB_ID } from './../../../../providers/tab-id.provider';
import { bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-options',
  templateUrl: 'options.component.html',
  styleUrls: ['options.component.scss']
})
export class OptionsComponent implements OnInit {

  message: string;

  constructor(@Inject(TAB_ID) readonly tabId: number, private apiService: ApiService) {}

  ngOnInit() {
    this.sendContentScriptCommand();
  }

  sendContentScriptCommand(val= 2) {

    const commandMessage = { command: 'salute', val };

    this.apiService.getUser()
    .subscribe(async (user) => {
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

}
