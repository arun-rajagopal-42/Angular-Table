import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "../shared/components/table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {UsersService} from "../shared/services/users/users.service";
import {HttpClientModule} from "@angular/common/http";
import {User, UsersApiResponse} from "../shared/services/users/models/user.model";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatMiniFabButton} from "@angular/material/button";
import {Subscription} from "rxjs";

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
        ReactiveFormsModule,
        MatMiniFabButton
    ],
    providers: [UsersService],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})


export class UsersListComponent implements AfterViewInit, OnInit, OnDestroy {
    displayedColumns: string[] = ['name.first', 'name.last', 'email', 'phone', 'location.postcode', 'location.city', 'edit'];
    dataSource = new MatTableDataSource<User>();
    editRow: User | null = null;
    subscription = new Subscription();

    @ViewChild('sort') sort!: MatSort;

    editForm = new FormGroup({
        email: new FormControl(),
        phone: new FormControl(),
        name: new FormGroup({
            first: new FormControl(),
            last: new FormControl()
        }),
        location: new FormGroup({
            city: new FormControl(),
            postcode: new FormControl
        })
    });

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.subscription = this.usersService.getAllUsers().subscribe({
            next: (value) => this.setDataSource(value),
            error: (err) => console.error(err)
        });
    }

    private setDataSource(value: UsersApiResponse) {
        return this.dataSource.data = value.results;
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    editUser(user: User) {
        this.editRow = user;
        this.editForm.patchValue(user);
    }

    saveUser(el: User) {
        const foundIndex = this.dataSource.data.findIndex(data => data === el);
        const editedUser = {...this.editRow, ...this.editForm.value} as User;
        this.dataSource.data.splice(foundIndex, 1, editedUser);
        this.dataSource._updateChangeSubscription();
        //ToDo: Backend request
        this.editRow = null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
