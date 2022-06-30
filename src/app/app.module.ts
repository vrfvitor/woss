import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulationPageComponent } from './pages/simulation-page/simulation-page.component';
import { ProcessesSectionComponent } from './pages/simulation-page/processes-section/processes-section.component';
import { StoreModule } from "@ngrx/store";
import { ioQueueReducer } from "./state/io-queue/io-queue.reducer";
import { processesReducer } from "./state/processes/processes.reducer";

@NgModule({
  declarations: [
    AppComponent,
    SimulationPageComponent,
    ProcessesSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({processes: processesReducer, ioQueue: ioQueueReducer})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
