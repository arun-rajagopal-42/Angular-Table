import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChild,
    ContentChildren,
    Input,
    OnDestroy,
    QueryList,
    ViewChild
} from '@angular/core';
import {
    MatColumnDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatTable,
    MatTableDataSource,
    MatTableModule
} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from '@angular/material/icon';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";


@Component({
    selector: 'app-table',
    standalone: true,
    imports: [
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconButton,
        MatPaginatorModule
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent<T> implements AfterContentInit, AfterViewInit, OnDestroy {

    // Query lists for the table directives
    @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
    @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
    @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
    @ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

    // ViewChild for the table and paginator
    @ViewChild(MatTable, {static: true}) table!: MatTable<T>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // Input properties
    @Input() columns: string[] = [];
    @Input() dataSource: MatTableDataSource<T> = new MatTableDataSource();

    subscription = new Subscription(); // Subscription for the search text change

    searchText = new FormControl('');  // FormControl for search text input


    /**
     * Lifecycle hook called after the content is initialized.
     * Sets the sorting behavior for the table.
     */
    ngAfterContentInit() {
        // Add column, row, and header row definitions to the table
        this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
        this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
        this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));

        // Set the NoDataRow template for the table
        this.table.setNoDataRow(this.noDataRow);

        // Set up filter and sort functionality
        this.watchSearchChange();
        this.customFilter();
        this.customSorting();
    }

    /**
     * Lifecycle hook called after the view is initialized.
     * Assigns the paginator to the data source
     */
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Custom sorting based on nested object properties
     */
    private customSorting() {
        this.dataSource.sortingDataAccessor = function pathDataAccessor(item: any, path: string): any {
            return path.split('.')
                .reduce((accumulator: any, key: string) => {
                    return accumulator ? accumulator[key] : undefined;
                }, item);
        }
    }

    /**
     * Custom filter for nested object properties
     */
    private customFilter() {
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const accumulator = (currentTerm: any, key: string) => {
                return this.nestedFilterCheck(currentTerm, data, key);
            };
            const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) !== -1;
        }
    }

    /**
     *  Watch for changes in the search text input
     */
    private watchSearchChange(): void {
        this.subscription.add(
            this.searchText.valueChanges.pipe(
                debounceTime(1000),
                distinctUntilChanged())
                .subscribe(
                    {
                        next: (value) => this.searchString(value),
                        error: (err) => console.error(err),
                        complete: () => console.info('complete')
                    }
                )
        );
    }

    /**
     * Perform search operation based on the entered text
     * @param text The stringQuery for filtering
     */
    searchString(text: string | null) {
        this.dataSource.filter = text ?? '';
    }

    /**
     * Recursive function to check nested object properties for filtering
     */
    nestedFilterCheck(search: any, data: { [x: string]: any; }, key: string) {
        if (typeof data[key] === 'object') {
            for (const k in data[key]) {
                if (data[key][k] !== null) {
                    search = this.nestedFilterCheck(search, data[key], k);
                }
            }
        } else {
            search += data[key];
        }
        return search;
    }

    /**
     * Lifecycle hook called when the component is destroyed.
     * Unsubscribes from the subscription to prevent memory leaks.
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
