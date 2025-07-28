import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesOrderHeader {
  salesOrderId: number;
  id: number;
  revisionNumber: number;
  orderDate: string;
  dueDate: string;
  shipDate: string;
  status: number;
  onlineOrderFlag: boolean;
  salesOrderNumber: string;
  purchaseOrderNumber: string;
  accountNumber: string;
  customerId: number;
  salesPersonId: number;
  territoryId: number;
  billToAddressId: number;
  shipToAddressId: number;
  shipMethodId: number;
  creditCardId: number;
  creditCardApprovalCode: string;
  currencyRateId: number;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  comment?: string;
  rowguid: string;
  modifiedDate: string;
  customer?: Customer;
  salesOrderDetails?: SalesOrderDetail[];
}

export interface SalesOrderDetail {
  salesOrderDetailId: number;
  id: number;
  salesOrderId: number;
  carrierTrackingNumber?: string;
  orderQty: number;
  productId: number;
  specialOfferId: number;
  unitPrice: number;
  unitPriceDiscount: number;
  lineTotal: number;
  rowguid: string;
  modifiedDate: string;
}

export interface Customer {
  businessEntityId: number;
  firstName: string;
  lastName: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all sales orders (with customer info)
  getSalesOrders(): Observable<SalesOrderHeader[]> {
    return this.http.get<SalesOrderHeader[]>(`${this.baseUrl}/v1/sales-orders`);
  }

  // Get sales order by ID (with customer and details)
  getSalesOrder(id: number): Observable<SalesOrderHeader> {
    return this.http.get<SalesOrderHeader>(`${this.baseUrl}/v1/sales-orders/${id}`);
  }

  // Get sales order details only
  getSalesOrderDetails(id: number): Observable<SalesOrderDetail[]> {
    return this.http.get<SalesOrderDetail[]>(`${this.baseUrl}/v1/sales-orders/${id}/details`);
  }

  // Get all sales order details
  getAllSalesOrderDetails(): Observable<SalesOrderDetail[]> {
    return this.http.get<SalesOrderDetail[]>(`${this.baseUrl}/v1/sales-order-details`);
  }

  // Create new sales order
  createSalesOrder(salesOrder: Omit<SalesOrderHeader, 'salesOrderId' | 'id' | 'rowguid' | 'modifiedDate'>): Observable<SalesOrderHeader> {
    return this.http.post<SalesOrderHeader>(`${this.baseUrl}/v1/sales-orders`, salesOrder);
  }

  // Update sales order
  updateSalesOrder(id: number, salesOrder: Partial<SalesOrderHeader>): Observable<SalesOrderHeader> {
    return this.http.put<SalesOrderHeader>(`${this.baseUrl}/v1/sales-orders/${id}`, salesOrder);
  }

  // Delete sales order
  deleteSalesOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/sales-orders/${id}`);
  }

  // Create sales order detail
  createSalesOrderDetail(detail: Omit<SalesOrderDetail, 'salesOrderDetailId' | 'id' | 'rowguid' | 'modifiedDate'>): Observable<SalesOrderDetail> {
    return this.http.post<SalesOrderDetail>(`${this.baseUrl}/sales-order-details`, detail);
  }

  // Update sales order detail
  updateSalesOrderDetail(id: number, detail: Partial<SalesOrderDetail>): Observable<SalesOrderDetail> {
    return this.http.put<SalesOrderDetail>(`${this.baseUrl}/sales-order-details/${id}`, detail);
  }

  // Delete sales order detail
  deleteSalesOrderDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sales-order-details/${id}`);
  }

  // Get sales orders by customer
  getSalesOrdersByCustomer(customerId: number): Observable<SalesOrderHeader[]> {
    return this.http.get<SalesOrderHeader[]>(`${this.baseUrl}/v1/sales-orders?customerId=${customerId}`);
  }

  // Get sales orders by status
  getSalesOrdersByStatus(status: number): Observable<SalesOrderHeader[]> {
    return this.http.get<SalesOrderHeader[]>(`${this.baseUrl}/v1/sales-orders?status=${status}`);
  }

  // Get sales orders by date range
  getSalesOrdersByDateRange(startDate: string, endDate: string): Observable<SalesOrderHeader[]> {
    return this.http.get<SalesOrderHeader[]>(`${this.baseUrl}/v1/sales-orders?orderDate_gte=${startDate}&orderDate_lte=${endDate}`);
  }

  // Get sales orders with pagination
  getSalesOrdersWithPagination(page: number, limit: number): Observable<SalesOrderHeader[]> {
    return this.http.get<SalesOrderHeader[]>(`${this.baseUrl}/v1/sales-orders?_page=${page}&_limit=${limit}`);
  }

  // Get sales order details by product
  getSalesOrderDetailsByProduct(productId: number): Observable<SalesOrderDetail[]> {
    return this.http.get<SalesOrderDetail[]>(`${this.baseUrl}/sales-order-details?productId=${productId}`);
  }

  // Get sales order details by sales order
  getSalesOrderDetailsBySalesOrder(salesOrderId: number): Observable<SalesOrderDetail[]> {
    return this.http.get<SalesOrderDetail[]>(`${this.baseUrl}/sales-order-details?salesOrderId=${salesOrderId}`);
  }

  // Calculate total sales for a period
  calculateTotalSales(startDate: string, endDate: string): Observable<{ totalSales: number, orderCount: number }> {
    return new Observable(observer => {
      this.getSalesOrdersByDateRange(startDate, endDate).subscribe(orders => {
        const totalSales = orders.reduce((sum, order) => sum + order.totalDue, 0);
        observer.next({ totalSales, orderCount: orders.length });
        observer.complete();
      });
    });
  }

  // Get sales statistics
  getSalesStatistics(): Observable<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: { [key: number]: number };
  }> {
    return new Observable(observer => {
      this.getSalesOrders().subscribe(orders => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalDue, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        const ordersByStatus = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as { [key: number]: number });

        observer.next({
          totalOrders,
          totalRevenue,
          averageOrderValue,
          ordersByStatus
        });
        observer.complete();
      });
    });
  }
} 