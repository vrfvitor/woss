import { Component, Input, OnInit } from '@angular/core';
import Process from "../../../core/process/process";
import { MatDialog } from "@angular/material/dialog";
import { MessagesService } from "../../../core/util/messages.service";
import { ProcessFormComponent } from "./form-modal/process-form.component";
import { Store } from "@ngrx/store";
import { addProcess } from "../../../state/processes/process-management.actions";

@Component({
  selector: 'app-processes-section',
  templateUrl: './processes-section.component.html',
  styleUrls: ['./processes-section.component.scss']
})
export class ProcessesSectionComponent implements OnInit {

  displayedColumns: string[] = ['colorHex', 'pid', 'name', 'state', 'actions'];
  @Input() processes!: Process[] | null;
  selectedProcess!: Process | null;

  constructor(
    private dialog: MatDialog,
    private messagesService: MessagesService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProcessFormComponent, {width: '450px'});
    dialogRef.afterClosed().subscribe((process: Process) => {
      if (!process) return;
      this.messagesService.showMessage('Process added to the queue')
      this.store.dispatch(addProcess({process}))
    });
  }

}
