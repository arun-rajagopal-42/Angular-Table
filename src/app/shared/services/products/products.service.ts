import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Product} from "./models/products.model";

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private productsApiUrl = "https://fakestoreapi.com/products";

    constructor(private http: HttpClient) {
    }

    /**
     * Fetches all products from the API.
     * @returns An Observable that emits an array of products.
     */
    getAllProducts(): Observable<Product[]> {
        // Send a GET request to the products API endpoint
        return this.http.get<Product[]>(this.productsApiUrl)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // Handle errors and log them to the console
                    console.error('An error occurred:', error);
                    // Throw a custom error message
                    return throwError(()=> 'Error fetching users. Please try again later.');
                })
            );
    }
}
