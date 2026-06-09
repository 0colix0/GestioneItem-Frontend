import { Component, inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-snackbar',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css',
})
export class Snackbar {
  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 3;

  openSnackBar() {
    this._snackBar.openFromComponent(popUp, {
      duration: this.durationInSeconds * 1000,
      data: 'Test dalla pagina snackbar',
    });
  }
}

@Component({
  selector: 'app-popUp',
  template: `
    <span class="example-pizza-party">
      {{ messaggioRicevuto }}
    </span>
  `,
  styles: `
    .example-pizza-party {
      color: hotpink;
    }
  `,
  imports: [],
})
export class popUp {
  messaggioRicevuto: string = inject(MAT_SNACK_BAR_DATA);
}
