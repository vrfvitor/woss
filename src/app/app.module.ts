import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulationPageComponent } from './pages/simulation-page/simulation-page.component';
import { ProcessesSectionComponent } from './pages/simulation-page/processes-section/processes-section.component';
import { StoreModule } from "@ngrx/store";
import { ioQueueReducer } from "./state/io-queue/io-queue.reducer";
import { processManagementReducer } from "./state/processes/process-management.reducer";
import { EffectsModule } from '@ngrx/effects';
import { ProcessManagementEffects } from "./state/processes/process-management.effects";

@NgModule({
  declarations: [
    AppComponent,
    SimulationPageComponent,
    ProcessesSectionComponent
  ],
  imports: [
    EffectsModule.forRoot([ProcessManagementEffects]),
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({processManagement: processManagementReducer, ioQueue: ioQueueReducer}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
