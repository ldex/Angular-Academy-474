import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [UpperCasePipe, CurrencyPipe, SlicePipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList {

  private productService = inject(ProductService);
  private router = inject(Router);

  private resource = this.productService.getProductsResource();

  products: Signal<Product[]> = this.resource.value;
  isLoading: Signal<boolean> = this.resource.isLoading;
  error: Signal<Error | undefined> = this.resource.error;

  selectedProduct: WritableSignal<Product | null> = signal(null);

  select(product: Product) {
    this.selectedProduct.set(product);
    this.router.navigate(['/products', product.id]);
  }

  title: Signal<string> = signal('Products');

  // Pagination
  pageSize = signal(5);
  start = signal(0);
  end = signal(this.pageSize());
  pageNumber = signal(1);

  changePage(increment: number): void {
    this.start.update((start) => start + increment * this.pageSize());
    this.end.set(this.start() + this.pageSize());
    this.pageNumber.update((pageNumber) => pageNumber + increment);
    this.selectedProduct.set(null);
  }

}
