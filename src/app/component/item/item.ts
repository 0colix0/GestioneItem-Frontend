import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ItemService } from '../../services/item-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../dialog/dialog';
import { MatIcon } from '@angular/material/icon';
import { Snackbar } from '../snackbar/snackbar';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

export interface ItemData {
  id: number | null;
  nome: string;
  descrizione: string;
  prezzo: number;
}

@Component({
  selector: 'app-item',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIcon,
    Snackbar,
  ],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item implements OnInit {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'nome', 'descrizione', 'prezzo', 'azioni'];
  dataSource: MatTableDataSource<ItemData>;
  itemToDelete: ItemData | null = null;

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef,
  ) {
    this.dataSource = new MatTableDataSource<ItemData>([]);
  }

  ngOnInit() {
    this.loadData();
  }

  openDialog(item?: ItemData) {
    const dialogRef = this.dialog.open(Dialog, {
      width: '400px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((risultato) => {
      // Se 'risultato' esiste (perché l'utente ha salvato e il dialog ha passato 'rispostaDalBackend')
      if (risultato) {
        console.log('Il dialog si è chiuso dopo un salvataggio, ricarico i dati...');
        this.loadData(); //  ricarica la tabella richiamando Quarkus
      }
    });
  }

  loadData() {
    this.itemService
      .getItem()
      .pipe(
        catchError((err) => {
          console.error('Errore durante il fetch dei dati:', err);
          return EMPTY;
        }),
      )
      .subscribe((rispostaDalBackend: ItemData[]) => {
        console.log('risposta dal server: ', rispostaDalBackend);
        this.dataSource.data = rispostaDalBackend;
      });
  }

  nomeInserito: string = '';
  descrizioneInserita: string = '';
  prezzoInserito: number = 0;
  showDeleteDialog = false;

  postItem() {
    const newItem: ItemData = {
      id: null,
      nome: this.nomeInserito,
      descrizione: this.descrizioneInserita,
      prezzo: this.prezzoInserito,
    };
    this.itemService
      .postItemData(newItem)
      .pipe(
        //oggetto che attacco a ciò che ho già fatto e se mi arriva un errore lo prendo
        catchError((err) => {
          console.error('dio cane', err);
          return EMPTY;
        }),
      )
      .subscribe((rispostaDalBackend: any) => {
        console.log('risposta dal server: ', rispostaDalBackend);
        this.dataSource.data = [...this.dataSource.data, rispostaDalBackend];
        this.nomeInserito = '';
        this.descrizioneInserita = '';
        this.prezzoInserito = 0;
      });
  }

  deleteItem(id: number) {
    this.itemService
      .deleteItem(id)
      .pipe(
        catchError((err) => {
          console.error('Errore durante la cancellazione:', err);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        // Rimuovo l'elemento filtrando e riassegnando l'array
        this.dataSource.data = this.dataSource.data.filter((item: ItemData) => item.id !== id);
      });
  }

  openDeleteDialog(id?: number) {
    //this.itemToDelete = item ?? null;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: id,
    });

    dialogRef.afterClosed().subscribe((risultato: boolean) => {
      //this.itemToDelete = null;

      // Se 'risultato' esiste (perché l'utente ha salvato e il dialog ha passato 'rispostaDalBackend')
      if (risultato) {
        console.log('Il dialog si è chiuso dopo un salvataggio, ricarico i dati...');
        this.loadData(); //  ricarica la tabella richiamando Quarkus
      }
    });
  }
}
