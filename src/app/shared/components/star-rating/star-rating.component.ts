import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-star-rating',
    standalone: true,
    imports: [
        MatIcon,
        CommonModule
    ],
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
    @Input() rating = 0;
}
