import { Routes } from '@angular/router';
import {UsersListComponent} from "./users-list/users-list.component";
import {ProductsListComponent} from "./products-list/products-list.component";

export const routes: Routes = [
    {path: 'users', component: UsersListComponent},
    {path: 'products', component: ProductsListComponent},
];
