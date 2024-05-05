import {
    AfterContentInit, AfterViewInit,
    Component,
    ContentChild,
    ContentChildren,
    Input,
    QueryList,
    ViewChild
} from '@angular/core';
import {
    MatColumnDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatTable, MatTableDataSource,
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
        FormsModule, MatIconButton,
        MatPaginatorModule
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent<T> implements AfterContentInit, AfterViewInit {

    @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
    @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
    @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
    @ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

    @ViewChild(MatTable, {static: true}) table!: MatTable<T>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @Input() columns!: string[];

    @Input() dataSource!: MatTableDataSource<T>;
    subscription = new Subscription();

    searchText = new FormControl('');


    ngAfterContentInit() {
        this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
        this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
        this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
        this.table.setNoDataRow(this.noDataRow);
        this.watchSearchChange();
        this.customFilterPredicate();
        this.customSorting();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    private customSorting() {
        this.dataSource.sortingDataAccessor = function pathDataAccessor(item: any, path: string): any {
            return path.split('.')
                .reduce((accumulator: any, key: string) => {
                    return accumulator ? accumulator[key] : undefined;
                }, item);
        }
    }

    private customFilterPredicate() {
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const accumulator = (currentTerm: any, key: string) => {
                return this.nestedFilterCheck(currentTerm, data, key);
            };
            const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) !== -1;
        }
    }

    private watchSearchChange(): void {
        this.subscription.add(
            this.searchText
                .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
                .subscribe(
                    {
                        next: (value) => this.searchString(value),
                        error: () => console.error,
                        complete: () => console.info('complete')
                    }
                )
        );
    }

    searchString(text: string | null) {
        this.dataSource.filter = text ?? '';
    }

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

}
