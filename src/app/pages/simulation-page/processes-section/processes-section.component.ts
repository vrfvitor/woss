import { Component, Input, OnInit } from '@angular/core';
import Process from "../../../core/process/process";

@Component({
  selector: 'app-processes-section',
  templateUrl: './processes-section.component.html',
  styleUrls: ['./processes-section.component.scss']
})
export class ProcessesSectionComponent implements OnInit {

  displayedColumns: string[] = ['colorHex', 'pid', 'name', 'state'];
  @Input() processes!: Process[] | null;

  constructor() {
  }

  ngOnInit(): void {
  }

}
