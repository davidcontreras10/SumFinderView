import { Component, OnInit } from '@angular/core';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  spinnerVisible: boolean = true;
  paramNumbers: number[] = [];
  addNumberValue: any;

  constructor(private signalRService: SignalrService) {
  }
  title = 'SumFinderView';

  public addNumber(){
    if(this.addNumberValue){
      this.paramNumbers.push(this.addNumberValue);
      this.addNumberValue = null;
    }
  }
}
