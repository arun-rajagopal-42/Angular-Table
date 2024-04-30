import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "./../table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {UsersService} from "./../services/users/users.service";
import {HttpClientModule} from "@angular/common/http";
import {User} from "./../services/users/models/user.model";

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [
        TableComponent,
        MatSortModule,
        MatTableModule,
        CommonModule,
        HttpClientModule
    ],
    providers: [UsersService,],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})


export class UsersListComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'city'];
    dataSource = new MatTableDataSource<User>();

    @ViewChild('sort') sort!: MatSort;

    private usersService = inject(UsersService);

    ngOnInit() {
        this.usersService.getAllUsers().subscribe((value) => {
            this.dataSource.data = value.results;
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

}
