import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UsersApiResponse} from "./models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private usersApiUrl = "https://randomuser.me/api/?results=50&nat=de";

    constructor(private http: HttpClient) {
    }

    /**
     * Fetches all users from the API.
     * @returns An Observable that emits a UsersApiResponse object.
     */
    getAllUsers(): Observable<UsersApiResponse> {
        // Send a GET request to the users API endpoint
        return this.http.get<UsersApiResponse>(this.usersApiUrl)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // Handle errors and log them to the console
                    console.error('An error occurred:', error);
                    // Throw a custom error message
                    return throwError(() => 'Error fetching users. Please try again later.');
                })
            );
    }
}
