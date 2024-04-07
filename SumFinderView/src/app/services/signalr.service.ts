import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { FinalizedSum, SumResults } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: signalR.HubConnection;
  private listNumberFoundSub: Subject<Array<Array<number>>> = new Subject<Array<Array<number>>>();
  private finalizedSub: Subject<SumResults> = new Subject<SumResults>();
  private onReadSub: Subject<SumResults> = new Subject<SumResults>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7254/sumFinder', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.on("listNumberFound", data => this.onListNumberFoundEvent(data));
    this.hubConnection.on("onFinalized", data => this.onFinalizedEvent(data));
    this.hubConnection.on("confirmationMessage", data => this.onMessageConfirmedEvent(data));
    this.hubConnection.on("onRead", data => this.onReadEvent(data));
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

  public onListNumberFound(): Observable<Array<Array<number>>> {
    return this.listNumberFoundSub.asObservable();
  }

  public onFinalized(): Observable<SumResults> {
    return this.finalizedSub.asObservable();
  }

  public onRead(): Observable<SumResults> {
    return this.onReadSub.asObservable();
  }

  private onListNumberFoundEvent(data: any) {
    this.listNumberFoundSub.next(data);
  }

  private onFinalizedEvent(data: any) {
    console.log('Process finalized: ', data);
    this.finalizedSub.next(data);
  }

  private onMessageConfirmedEvent(data: any) {
    console.log(data);
  }

  private onReadEvent(data: any) {
    console.log('On read', data);
    this.onReadSub.next(data);
  }

}
