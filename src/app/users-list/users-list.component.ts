import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "../shared/components/table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {UsersService} from "../shared/services/users/users.service";
import {HttpClientModule} from "@angular/common/http";
import {User} from "../shared/services/users/models/user.model";
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
    users: User[] = []; // Array to store fetched users
    isLoading = false; // Flag to indicate loading state
    editRow: User | null = null; // User being edited
    subscription = new Subscription(); // Subscription to handle API requests

    userForm = new FormGroup({ // Form for editing user data
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

    displayedColumns: string[] = ['name.first', 'name.last', 'email', 'phone', 'location.postcode', 'location.city', 'edit']; // Columns to display in the table
    dataSource = new MatTableDataSource<User>(); // Data source for the table

    @ViewChild('sort') sort!: MatSort;  // Reference to the MatSort directive

    constructor(private usersService: UsersService) {
    }


    /**
     * Lifecycle hook called after component initialization.
     * Fetches the list of users from the API.
     */
    ngOnInit() {
        this.fetchUsers();
    }

    /**
     * Fetches the list of users from the API.
     * Updates component state with fetched data or handles errors.
     */
    private fetchUsers() {
        this.isLoading = true;
        this.subscription = this.usersService.getAllUsers().subscribe({
            next: (value) => {
                // Update the component state with the fetched users data
                this.users = value.results;
                // Set the data source for the table
                this.setDataSource();
                this.isLoading = false;
            },
            error: (err) => {
                // Handle errors by logging them to the console
                this.isLoading = false;
                console.error(err)
            }
        });
    }

    /**
     * Sets the data source for the table.
     */
    private setDataSource() {
        return this.dataSource.data = this.users; // Assign the users array to the data source
    }

    /**
     * Lifecycle hook called after the view is initialized.
     * Sets the sorting behavior for the table.
     */
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    /**
     * Initializes the editing process for a user.
     * @param user The user object being edited.
     */
    editUser(user: User) {
        this.editRow = user;
        this.userForm.patchValue(user);
    }

    /**
     * Saves the changes made to a user and updates the data source.
     * @param user The user object representing the original user data.
     */
    saveUser(user: User) {
        // Find the index of the original user in the data source
        const foundIndex = this.users.findIndex(data => data === user);

        // Create a new user object with the edited data from the form
        const editedUser = {...this.editRow, ...this.userForm.value} as User;

        // Replace the original user with the edited user in the data source
        this.users.splice(foundIndex, 1, editedUser);

        // Update the data source
        this.setDataSource();

        // Notify the data source that the data has changed
        this.dataSource._updateChangeSubscription();

        // TODO: Send a request to the backend to save the changes

        // Reset the editRow variable to indicate that editing is complete
        this.editRow = null;
    }

    /**
     * Lifecycle hook called when the component is destroyed.
     * Unsubscribes from the subscription to prevent memory leaks.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
