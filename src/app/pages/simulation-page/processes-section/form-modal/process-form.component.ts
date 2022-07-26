import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Process from "../../../../core/process/process";
import BoundType from "../../../../core/process/bound-type";


@Component({
  selector: 'app-task-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.css']
})
export class ProcessFormComponent implements OnInit {

  processForm!: FormGroup;
  boundTypes = BoundType.values();

  constructor(
    public fBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProcessFormComponent>
  ) {
  }

  ngOnInit(): void {
    this.processForm = this.fBuilder.group({
      name: ['internal-process#x', Validators.required],
      priority: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(10)
      ]],
      amountInstructs: [5, [
        Validators.required,
        Validators.min(1),
      ]],
      bound: [BoundType.CPU, Validators.required],
      colorHex: ['#9f0630', Validators.required]
    })
  }

  getProcess($event: MouseEvent) {
    $event.preventDefault()
    const {name, colorHex, bound, priority, amountInstructs} = this.processForm.getRawValue()
    this.dialogRef.close(new Process(null, name, colorHex, bound, null, null, priority, amountInstructs))
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
