import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { SumResults } from '../models';

@Component({
  selector: 'app-numbers-view',
  templateUrl: './numbers-view.component.html',
  styleUrls: ['./numbers-view.component.css']
})
export class NumbersViewComponent implements OnInit {

  paramNumbers: number[] = [];
  addNumberValue: any;
  targetValue: number | null = null;
  results: Array<Array<number>> = [];
  attemtps: number | null = null;
  processCompleted: boolean | null = null;
  processing: boolean = false;
  cancellationRequested: boolean = false;

  constructor(private signalRService: SignalrService) {
  }

  ngOnInit(): void {
    this.signalRService.onRead().subscribe(res => {
      this.assignResults(res);
    });
    this.signalRService.onFinalized().subscribe(res => {
      this.assignResults(res);
      this.setFlagsStop();
    });
    this.signalRService.onServerError().subscribe(error => {
      if (error) {
        console.error(error);
      }

      this.setFlagsStop();
      alert("Error in the server.");
    });
  }
  title = 'SumFinderView';

  public resetProcess() {
    this.clearParamNumbers();
    this.targetValue = null;
    this.results = [];
    this.attemtps = null;
    this.processCompleted = null;
    this.processing = false;
    this.cancellationRequested = false;
  }

  public cancelProcess() {
    this.cancellationRequested = true;
    this.signalRService.requestCancellation();
  }

  public canStartProcess() {
    return !this.processing && this.targetValue && this.paramNumbers.length > 0 && !this.processCompleted;
  }

  public addNumberEvent() {
    if (this.addNumberValue) {
      this.addNewNumber(this.addNumberValue);
    }
  }

  public clearParamNumbers() {
    this.paramNumbers = [];
  }

  public sendRequest() {
    if (this.canStartProcess() && this.targetValue) {
      this.processCompleted = false;
      this.processing = true;
      this.signalRService.start(this.paramNumbers, this.targetValue);
    }
  }

  public printResult(result: Array<number>): string {
    let msg = '';
    for (let num of result) {
      msg += `${num} -`;
    }

    return msg;
  }


  public onInputPaste(event: ClipboardEvent) {
    if (this.processing || this.processCompleted === true) {
      return;
    }
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      if (pastedText) {
        const pastedNumbers = this.readExcelAsNummbers(pastedText);
        for (let number of pastedNumbers) {
          this.addNewNumber(number);
        }
      }
    }
  }

  public numberRemoveEvent(number: number) {
    const index = this.paramNumbers.indexOf(number);
    if (index >= 0) {
      this.paramNumbers.splice(index, 1);
    }
  }

  private setFlagsStop() {
    this.cancellationRequested = true;
    this.processCompleted = true;
    this.processing = false;
  }

  private addNewNumber(number: number) {
    if (number !== 0 && number && !isNaN(number)) {
      this.paramNumbers.push(number);
      this.addNumberValue = null;
    }
  }

  private readExcelAsNummbers(excelText: string): number[] {
    const numbers: number[] = [];
    if (excelText) {
      const rows = excelText.split('\n');
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split('\t');
        for (let j = 0; j < cells.length; j++) {
          const value = cells[j];
          const cleanValue = this.cleanExcelValue(value);
          const number = parseFloat(cleanValue);
          if (number !== 0 && number && !isNaN(number)) {
            numbers.push(number);
          }
        }
      }
    }
    return numbers;
  }

  private cleanExcelValue(value: string): string {
    let cleanValue = value.replace('\r', '').replace(/,/g, '').trim();
    if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) { //is negative
      cleanValue = cleanValue.replace('(', '-').replace(')', '');
    }

    return cleanValue;
  }

  private assignResults(res: SumResults) {
    this.results = res.numbers;
    this.attemtps = res.attempts;
  }
}
