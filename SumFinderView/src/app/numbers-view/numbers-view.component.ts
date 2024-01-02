import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';

@Component({
  selector: 'app-numbers-view',
  templateUrl: './numbers-view.component.html',
  styleUrls: ['./numbers-view.component.css']
})
export class NumbersViewComponent implements OnInit {

  spinnerVisible: boolean = true;
  paramNumbers: number[] = [];
  addNumberValue: any;
  targetValue: number | null = null;

  constructor(private signalRService: SignalrService) {
  }

  ngOnInit(): void {

  }
  title = 'SumFinderView';

  public addNumber() {
    if (this.addNumberValue) {
      this.paramNumbers.push(this.addNumberValue);
      this.addNumberValue = null;
    }
  }

  public sendRequest() {
    if (this.paramNumbers.length > 0 && this.targetValue) {
      this.signalRService.start(this.paramNumbers, this.targetValue);
    }
  }
}
