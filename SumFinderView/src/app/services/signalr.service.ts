import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: signalR.HubConnection

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7254/sumFinder', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.on("listNumberFound", data => this.onListNumberFound(data));
    this.hubConnection.on("onFinalized", data => this.onFinalized(data));
    this.hubConnection.on("confirmationMessage", data => this.onMessageConfirmed(data));
    this.hubConnection.on("onRead", data => this.onRead(data));
    this.ngOnInit();
  }

  public sendConfirmationMessage() {
    this.hubConnection.invoke("confirmMessage", "Testing msg");
  }

  public start(numbers: number[], targetValue: number) {
    this.hubConnection.invoke("StartNewSumProcess", numbers, targetValue);
  }

  ngOnInit(): void {
    console.log("starting signalR");
    this.hubConnection.start()
      .then(_ => {
        console.log('Connection Started');
      }).catch(error => {
        return console.error('signalR error:', error);
      });
  }


  private onListNumberFound(data: any) {
    console.log('Numbers found: ', data);
  }

  private onFinalized(data: any) {
    console.log('Process finalized: ', data);
  }

  private onMessageConfirmed(data: any) {
    console.log(data);
  }

  private onRead(data: any) {
    console.log('On read', data);
  }

}
