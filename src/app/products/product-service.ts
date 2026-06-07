import { inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { Product } from '../models/product';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiService = inject(ApiService);

  private products = signal<Product[]>([]);

  async saveProduct(newProduct: Omit<Product, 'id'>): Promise<boolean> {
    try {
      const productSaved = await firstValueFrom(this.apiService.saveProduct(newProduct));
      this.products.update((products) => [...products, productSaved]);
      console.log('Product saved on the server with id: ' + productSaved.id);
      return true;
    } catch (error) {
      return false;
    }
  }

  getProductsResource() {
    return rxResource({
      stream: () => this.apiService.loadProducts(),
      defaultValue: []
    })
  }

  getProductResource(id: Signal<number>): ResourceRef<Product | undefined> {
    return rxResource({
      params: () => ({id: id()}),
      stream: ({params}) => {
        const product = this.products().find((p) => p.id === params.id);
        if (product) {
          return of(product);
        }
        return this.apiService.loadProduct(params.id);
      },
      defaultValue: undefined,
    });
  }

  // private loadProducts() {
  //   this.apiService.loadProducts().subscribe((data) => {
  //     this.products.set(data);
  //   });
  // }

  // getProducts() {
  //   this.loadProducts();
  //   return this.products.asReadonly();
  // }

}
