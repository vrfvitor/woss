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
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { ProcessFormComponent } from "./pages/simulation-page/processes-section/form-modal/process-form.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    SimulationPageComponent,
    ProcessesSectionComponent,
    ProcessFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({processManagement: processManagementReducer, ioQueue: ioQueueReducer}),
    EffectsModule.forRoot([ProcessManagementEffects]),
    BsDropdownModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
