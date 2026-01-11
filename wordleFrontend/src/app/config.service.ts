import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  load(): Promise<void> {
    return fetch('/assets/config.runtime.json')
      .then(response => response.json())
      .then(data => {
        this.config = data;
      });
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}
