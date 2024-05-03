import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "./../table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {ProductsService} from "./../services/products/products.service";
import {Product} from "./../services/products/models/products.model";


@Component({
    selector: 'app-products-list',
    standalone: true,
    imports: [
        TableComponent,
        MatSortModule,
        MatTableModule,
        CommonModule,
        HttpClientModule
    ],
    providers: [ProductsService],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = ['category', 'title', 'description', 'rating.rate', 'price'];
    dataSource = new MatTableDataSource<Product>();

    @ViewChild('sort') sort!: MatSort;

    private productsService = inject(ProductsService);

    ngOnInit() {
        this.productsService.getAllProducts().subscribe((value) => {
            console.log(value);
            this.dataSource.data = value;
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

}
