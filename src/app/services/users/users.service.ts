import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsersApiResponse} from "./models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private usersAPI = "https://randomuser.me/api/?results=50&nat=de";

    constructor(private http: HttpClient) {
    }

    getAllUsers(): Observable<UsersApiResponse> {
        return this.http.get<UsersApiResponse>(this.usersAPI);
    }
}
