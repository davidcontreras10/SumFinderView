import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignalrService } from './services/signalr.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NumbersViewComponent } from './numbers-view/numbers-view.component';


@NgModule({
  declarations: [
    AppComponent,
    NumbersViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    SignalrService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
