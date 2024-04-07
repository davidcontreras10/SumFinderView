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

  constructor(private signalRService: SignalrService) {
  }

  ngOnInit(): void {
    this.signalRService.onRead().subscribe(res => {
      this.assignResults(res);
    });
    this.signalRService.onFinalized().subscribe(res => {
      this.assignResults(res);
      this.processCompleted = true;
      this.processing = false;
    })
  }
  title = 'SumFinderView';

  public resetProcess() {
    this.clearParamNumbers();
    this.targetValue = null;
    this.results = [];
    this.attemtps = null;
    this.processCompleted = null;
    this.processing = false;
  }

  public cancellProcess() {
    console.log('Cancel requested');
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
          const number = parseFloat(cells[j].replace(',', '.'));
          if (number !== 0 && number && !isNaN(number)) {
            numbers.push(number);
          }
        }
      }
    }
    return numbers;
  }

  private assignResults(res: SumResults) {
    this.results = res.numbers;
    this.attemtps = res.attempts;
  }
}
