import { Component } from '@angular/core';
import {TableComponent} from "./../table/table.component";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    TableComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

}
