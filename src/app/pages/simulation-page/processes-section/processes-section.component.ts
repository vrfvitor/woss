import { Component, Input, OnInit } from '@angular/core';
import Process from "../../../core/process/process";

@Component({
  selector: 'app-processes-section',
  templateUrl: './processes-section.component.html'
})
export class ProcessesSectionComponent implements OnInit {

  @Input() processes!: Process[] | null;

  constructor() { }

  ngOnInit(): void {
    console.log('sopa')
  }

}
