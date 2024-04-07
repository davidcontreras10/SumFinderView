import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { FinalizedSum, SumResults } from '../models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: signalR.HubConnection;
  private listNumberFoundSub: Subject<Array<Array<number>>> = new Subject<Array<Array<number>>>();
  private finalizedSub: Subject<SumResults> = new Subject<SumResults>();
  private serverErrorSub: Subject<any> = new Subject<any>();
  private onReadSub: Subject<SumResults> = new Subject<SumResults>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.baseServer}/sumFinder`, {
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

  ngOnInit(): void {
    console.log("starting signalR");
    this.hubConnection.start()
      .then(_ => {
        console.log('Connection Started');
      }).catch(error => {
        return console.error('signalR error:', error);
      });
  }

  public sendConfirmationMessage() {
    this.hubConnection.invoke("confirmMessage", "Testing msg");
  }

  public start(numbers: number[], targetValue: number) {
    this.hubConnection.invoke("StartNewSumProcess", numbers, targetValue).catch(error => {
      this.serverErrorSub.next(error);
    });
  }

  public requestCancellation() {
    this.hubConnection.invoke("StopNewSumProcess");
  }

  public onServerError(): Observable<any> {
    return this.serverErrorSub.asObservable();
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
