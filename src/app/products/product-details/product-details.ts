import { Component, inject, input, Signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, UpperCasePipe, DatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private productService = inject(ProductService);

  id = input.required<number>();

  private resource = this.productService.getProductResource(this.id);

  product: Signal<Product | undefined> = this.resource.value;
  isLoading: Signal<boolean> = this.resource.isLoading;
  error: Signal<Error | undefined> = this.resource.error;
}
