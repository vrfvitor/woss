import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulationPageComponent } from "./pages/simulation-page/simulation-page.component";

const routes: Routes = [
  {path: '**', component: SimulationPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
