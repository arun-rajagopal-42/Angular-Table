import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Product} from "./models/products.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsAPI = "https://fakestoreapi.com/products";

  constructor(private http: HttpClient) {
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsAPI);
  }
}
