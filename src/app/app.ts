import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Item } from './component/item/item';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Item],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('progettoFrontend');
}
