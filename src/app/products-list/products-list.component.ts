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
    products: Product[] = []; // Array to store fetched products
    isLoading = false;  // Flag to indicate loading state
    editRow: Product | null = null; // Product being edited
    subscription = new Subscription(); // Subscription to handle API requests

    productForm = new FormGroup({ // Form for editing product data
        category: new FormControl(),
        title: new FormControl(),
        description: new FormControl(),
        rating: new FormGroup({
            'rate': new FormControl(),
            'count': new FormControl()
        }),
        price: new FormControl(),
    });

    displayedColumns: string[] = ['category', 'title', 'description', 'rating.rate', 'price', 'edit']; // Columns to display in the table
    dataSource = new MatTableDataSource<Product>(); // Data source for the table

    @ViewChild('sort') sort!: MatSort;  // Reference to the MatSort directive

    constructor(private productsService: ProductsService) {
    }

    /**
     * Lifecycle hook called after component initialization.
     * Fetches the list of products from the API.
     */
    ngOnInit() {
        // Fetch Products from the API when the component initializes
        this.fetchProducts();
    }

    /**
     * Fetches the list of products from the API.
     * Updates component state with fetched data or handles errors.
     */
    private fetchProducts() {
        this.isLoading = true;
        this.subscription = this.productsService.getAllProducts().subscribe({
            next: (value) => {
                // Update the component state with the fetched Products data
                this.products = value;
                // Set the data source for the table
                this.setDataSourceValue();
                this.isLoading = false;
            },
            error: (err) => {
                // Handle errors by logging them to the console
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    /**
     * Sets the data source for the table.
     */
    setDataSourceValue() {
        this.dataSource.data = this.products;
    }

    /**
     * Lifecycle hook called after the view is initialized.
     * Sets the sorting behavior for the table.
     */
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    /**
     * Initializes the editing process for a product.
     * @param product The user object being edited.
     */
    editProduct(product: Product) {
        this.editRow = product;
        this.productForm.patchValue(product);
    }

    /**
     * Saves the changes made to a product and updates the data source.
     * @param product The product object representing the original product data.
     */
    saveProduct(product: Product) {
        // Find the index of the original product in the data source
        const foundIndex = this.products.findIndex(data => data === product);

        // Create a new product object with the edited data from the form
        const editedProduct = {...this.editRow, ...this.productForm.value} as Product;

        // Replace the original product with the edited product in the data source
        this.products.splice(foundIndex, 1, editedProduct);

        // Update the data source
        this.setDataSourceValue();

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
