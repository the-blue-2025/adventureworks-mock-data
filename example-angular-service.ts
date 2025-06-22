import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for type safety
export interface Person {
  businessEntityId: number;
  id: number;
  personType: string;
  nameStyle: boolean;
  title: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  emailPromotion: number;
  modifiedDate: string;
}

export interface Vendor {
  businessEntityId: number;
  id: number;
  accountNumber: string;
  name: string;
  creditRating: number;
  preferredVendorStatus: boolean;
  activeFlag: boolean;
  purchasingWebServiceURL: string | null;
  modifiedDate: string;
}

export interface PurchaseOrder {
  purchaseOrderId: number;
  revisionNumber: number;
  status: number;
  employeeId: number;
  vendorId: number;
  shipMethodId: number;
  orderDate: string;
  shipDate: string | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  modifiedDate: string;
  vendor?: {
    businessEntityId: number;
    name: string;
    accountNumber: string;
  };
  purchaseOrderDetails?: PurchaseOrderDetail[];
}

export interface PurchaseOrderDetail {
  purchaseOrderId: number;
  purchaseOrderDetailId: number;
  dueDate: string;
  orderQty: number;
  productId: number;
  unitPrice: number;
  lineTotal: number;
  receivedQty: number;
  rejectedQty: number;
  stockedQty: number;
  modifiedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdventureWorksService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Person endpoints
  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/persons`);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/persons/${id}`);
  }

  createPerson(person: Omit<Person, 'id'>): Observable<Person> {
    return this.http.post<Person>(`${this.baseUrl}/persons`, person);
  }

  updatePerson(id: number, person: Partial<Person>): Observable<Person> {
    return this.http.put<Person>(`${this.baseUrl}/persons/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/persons/${id}`);
  }

  // Vendor endpoints
  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/vendors`);
  }

  getVendor(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.baseUrl}/vendors/${id}`);
  }

  getPreferredVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/vendors?preferredVendorStatus=true`);
  }

  // Purchase Order endpoints
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/purchase-orders`);
  }

  getPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/purchase-orders/${id}`);
  }

  getPurchaseOrderDetails(id: number): Observable<PurchaseOrderDetail[]> {
    return this.http.get<PurchaseOrderDetail[]>(`${this.baseUrl}/purchase-orders/${id}/details`);
  }

  // Advanced queries
  getPersonsByType(personType: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/persons?personType=${personType}`);
  }

  getPurchaseOrdersByVendor(vendorId: number): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/purchase-orders?vendorId=${vendorId}`);
  }

  // Pagination example
  getPersonsPaginated(page: number = 1, limit: number = 10): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/persons?_page=${page}&_limit=${limit}`);
  }

  // Sorting example
  getPersonsSorted(sortBy: string = 'lastName', order: 'asc' | 'desc' = 'asc'): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/persons?_sort=${sortBy}&_order=${order}`);
  }
} 