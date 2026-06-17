import { Component, Inject } from "@angular/core";
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatLabel } from "@angular/material/form-field";
import { MatButton } from "@angular/material/button";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, EMPTY } from "rxjs";

import { ItemData } from "../item/item";
import { ItemService } from "../../services/item-service";

// Definiamo un'interfaccia per i dati che il dialog si aspetta di ricevere dal padre
export interface ConfirmDialogData {
  item: ItemData;
  dataSource: MatTableDataSource<ItemData>;
}

@Component({
  selector: "app-confirm-dialog",
  standalone: true, // Richiesto se usi l'array 'imports' (in Angular 14+)
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatLabel,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: "./confirm-dialog.html",
  styleUrl: "./confirm-dialog.css",
})
export class ConfirmDialog {
  // Iniettiamo il servizio, il riferimento al dialog e i dati passati dal componente padre
  constructor(
    private itemService: ItemService,
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  delete() {
    console.log(this.data);

    const itemId = this.data;
    if (itemId == null) {
      console.error("ID non valido per la cancellazione:", itemId);
      return;
    }

    this.itemService
      .deleteItem(itemId)
      .pipe(
        catchError((err) => {
          console.error("Errore durante la cancellazione:", err);
          // Opzionale: potresti chiudere il dialog qui o mostrare un messaggio di errore
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
