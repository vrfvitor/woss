import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimulationPageComponent } from './pages/simulation-page/simulation-page.component';
import { ProcessesSectionComponent } from './pages/simulation-page/processes-section/processes-section.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulationPageComponent,
    ProcessesSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
