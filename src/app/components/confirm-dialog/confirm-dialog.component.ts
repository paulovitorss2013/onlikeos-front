import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  // CONSTRUTOR
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  // MÉTODO PARA CONFIRMAR AS AÇÕES
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  // MÉTODO PARA CANCELAR A AÇÃO
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
