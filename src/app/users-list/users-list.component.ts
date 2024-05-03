import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "./../table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {UsersService} from "./../services/users/users.service";
import {HttpClientModule} from "@angular/common/http";
import {User} from "./../services/users/models/user.model";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [
        TableComponent,
        MatSortModule,
        MatTableModule,
        CommonModule,
        HttpClientModule,
        MatIcon,
        ReactiveFormsModule
    ],
    providers: [UsersService],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})


export class UsersListComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = ['name.first', 'name.last', 'email', 'phone', 'location.city'];
    dataSource = new MatTableDataSource<User>();
    editRow!: User | undefined;

    @ViewChild('sort') sort!: MatSort;

    private usersService = inject(UsersService);
    editForm = new FormGroup({
        'name.first': new FormControl(),
        'name.last': new FormControl(),
        'email': new FormControl(),
        'phone': new FormControl(),
        'location.city': new FormControl()
    })

    ngOnInit() {
        this.usersService.getAllUsers().subscribe((value) => {
            this.dataSource.data = value.results;
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    editUserList(el: User) {
        this.editRow = el;
        this.editForm.setValue({
            "location.city": el.location.city,
            "name.first": el.name.first,
            "name.last": el.name.last,
            email: el.email,
            phone: el.phone
        });
    }

    saveUser(el: User) {
        const value = this.editForm.value;
        this.editRow = {
            ...el,
            email: value.email,
            phone: value.phone,
            location: {
                ...el.location,
                city : value["location.city"]
            },
            name: {
                ...el.name,
                first: value["name.first"],
                last: value["name.last"]
            }
        }
        const foundIndex =  this.dataSource.data.findIndex(data=> data === el);
        this.dataSource.data[foundIndex] = this.editRow;
        this.dataSource._updateChangeSubscription()
        this.editRow = undefined;
    }

}
