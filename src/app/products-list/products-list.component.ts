import {AfterViewInit, Component, inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "./../table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule, DecimalPipe} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {ProductsService} from "./../services/products/products.service";
import {Product} from "./../services/products/models/products.model";
import {StarRatingPipe} from "./../pipes/star-rating.pipe";
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {StarRatingComponent} from "./../star-rating/star-rating.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";

registerLocaleData(localeDe);


@Component({
    selector: 'app-products-list',
    standalone: true,
    imports: [
        TableComponent,
        MatSortModule,
        MatTableModule,
        CommonModule,
        HttpClientModule,
        StarRatingPipe,
        DecimalPipe,
        StarRatingComponent,
        ReactiveFormsModule,
        MatIcon,
        MatMiniFabButton
    ],
    providers: [ProductsService, {provide: LOCALE_ID, useValue: 'de-DE'}],
    templateUrl: './products-list.component.html',
    styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = ['category', 'title', 'description', 'rating.rate', 'price', 'edit'];
    dataSource = new MatTableDataSource<Product>();
    editRow!: Product | undefined;

    @ViewChild('sort') sort!: MatSort;

    private productsService = inject(ProductsService);
    editForm = new FormGroup({
        'category': new FormControl(),
        'title': new FormControl(),
        'description': new FormControl(),
        'rating.rate': new FormControl(),
        'rating.count': new FormControl(),
        'price': new FormControl(),
    })


    ngOnInit() {
        this.productsService.getAllProducts().subscribe((value) => {
            this.dataSource.data = value;
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    editProduct(el: Product) {
        this.editRow = el;
        this.editForm.setValue({
            category: el.category,
            title: el.title,
            description: el.description,
            'rating.rate': el.rating.rate,
            'rating.count': el.rating.count,
            price: el.price
        });
    }

    saveProduct(el: Product) {
        const value = this.editForm.value;
        this.editRow = {
            ...el,
            ...value,
            rating: {
                rate: value["rating.rate"],
                count: value["rating.count"]
            }
        };
        const foundIndex = this.dataSource.data.findIndex(data => data === el);
        this.dataSource.data[foundIndex] = this.editRow;
        this.dataSource._updateChangeSubscription()
        //ToDo: Backend request
        this.editRow = undefined;
    }

}
