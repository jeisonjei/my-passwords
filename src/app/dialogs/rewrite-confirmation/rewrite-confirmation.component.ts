import { Component } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rewrite-confirmation',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './rewrite-confirmation.component.html',
  styleUrl: './rewrite-confirmation.component.css'
})
export class RewriteConfirmationComponent {
  constructor(private dialogRef: MatDialogRef<RewriteConfirmationComponent>)
  {

  }
  
  addAndClose() {
    this.dialogRef.close(false);
  }
  rewriteAndClose() {
    this.dialogRef.close(true);
  }

}
