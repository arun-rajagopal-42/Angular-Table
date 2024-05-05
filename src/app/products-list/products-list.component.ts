import {AfterViewInit, Component, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TableComponent} from "../shared/components/table/table.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {CommonModule, DecimalPipe, registerLocaleData} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {ProductsService} from "../shared/services/products/products.service";
import {Product} from "../shared/services/products/models/products.model";
import localeDe from '@angular/common/locales/de';
import {StarRatingComponent} from "../shared/components/star-rating/star-rating.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {Subscription} from "rxjs";

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
export class ProductsListComponent implements AfterViewInit, OnInit, OnDestroy {
    displayedColumns: string[] = ['category', 'title', 'description', 'rating.rate', 'price', 'edit'];
    dataSource = new MatTableDataSource<Product>();
    editRow: Product | null = null;
    subscription = new Subscription();

    @ViewChild('sort') sort!: MatSort;

    editForm = new FormGroup({
        category: new FormControl(),
        title: new FormControl(),
        description: new FormControl(),
        rating: new FormGroup({
            'rate': new FormControl(),
            'count': new FormControl()
        }),
        price: new FormControl(),
    });

    constructor(private productsService: ProductsService) {
    }


    ngOnInit() {
        this.subscription = this.productsService.getAllProducts().subscribe({
            next: (value) => this.setDataSourceValue(value),
            error: (err) => console.error(err) // Further Error handling
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    setDataSourceValue(products: Product[]) {
        this.dataSource.data = products;
    }

    editProduct(product: Product) {
        this.editRow = product;
        this.editForm.patchValue(product);
    }

    saveProduct(product: Product) {
        const foundIndex = this.dataSource.data.findIndex(data => data === product);
        const editedProduct = {...this.editRow, ...this.editForm.value} as Product;
        this.dataSource.data.splice(foundIndex, 1, editedProduct);
        this.dataSource._updateChangeSubscription();
        //ToDo: Backend request
        this.editRow = null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
