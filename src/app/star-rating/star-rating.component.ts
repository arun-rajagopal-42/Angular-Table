import {Component, Input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
@Input() rating = 0;
}
