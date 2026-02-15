import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private baseUrl = 'http://localhost:9090';

    constructor(private http: HttpClient) { }

    // Create a new order
    createOrder(amount: number): Observable<any> {
        const paymentDetails = {
            amount: amount,
            currency: "INR",
            receipt: "receipt_123",
            notes: "Test payment"
        };
        return this.http.post(`${this.baseUrl}/api/payments/create-order`, paymentDetails);
    }

    // Verify payment
    verifyPayment(paymentDetails: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/payments/verify-payment`, paymentDetails);
    }
}
