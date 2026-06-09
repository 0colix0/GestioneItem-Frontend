import { popUp } from '../snackbar/snackbar';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ItemData } from '../item/item';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog implements OnInit {
  static afterClosed() {
    throw new Error('Method not implemented.');
  }
  private _snackBar = inject(MatSnackBar);
  item: ItemData;
  titoloDialog: string = '';

  constructor(
    private itemService: ItemService,
    private dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: ItemData,
  ) {
    this.item = { ...data };
  }

  ngOnInit() {
    console.log(this.item);
    if (!!this.item.id) {
      this.titoloDialog = 'Modifica Articolo';
    } else {
      this.titoloDialog = 'Aggiungi Nuovo Articolo';
    }
  }

  putItem() {
    console.log('OG: ', this.item);
    if (!!this.item.id) {
      this.itemService
        .putItem(this.item)
        .pipe(
          catchError((err) => {
            console.error("Errore durante l'aggiornamento:", err);
            return EMPTY;
          }),
        )
        .subscribe((rispostaDalBackend: any) => {
          console.log(' BE: ', rispostaDalBackend);

          console.log("Risposta dal server dopo l'aggiornamento:", rispostaDalBackend);
          this.dialogRef.close(rispostaDalBackend);

          //finito l'aggiornamento butto fuori un messaggio di operazione finita correttamente
          this._snackBar.openFromComponent(popUp, {
            data: "Hai modificato con successo l'articolo!",
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 3000,
          });
        });
    } else {
      //post
      this.itemService
        .postItemData(this.item)
        .pipe(
          catchError((err) => {
            console.error("Errore durante l'aggiornamento:", err);
            return EMPTY;
          }),
        )
        .subscribe((rispostaDalBackend: any) => {
          console.log(' BE: ', rispostaDalBackend);

          console.log('Risposta dal server dopo Il salvaaggio:', rispostaDalBackend);
          this.dialogRef.close(rispostaDalBackend);

          //dopo la creazione di un nuovo componente do il messaggio di successo
          this._snackBar.openFromComponent(popUp, {
            data: 'Hai aggiunto con successo un nuovo articolo!',
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 3000,
          });
        });
    }
  }
}
