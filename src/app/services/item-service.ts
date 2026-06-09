import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemData } from '../component/item/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private httpClient: HttpClient) {}

  public postItemData(item: ItemData) {
    return this.httpClient.post('http://127.0.0.1:8080/api/items', item);
  }

  public getItem(): Observable<ItemData[]> {
    return this.httpClient.get<ItemData[]>('http://127.0.0.1:8080/api/items');
  }

  public deleteItem(id: number) {
    return this.httpClient.delete(`http://127.0.0.1:8080/api/items/${id}`);
  }

  public putItem(itemData: ItemData) {
    return this.httpClient.put(`http://127.0.0.1:8080/api/items/${itemData.id}`, itemData);
  }
}
