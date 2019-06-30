import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Customer} from '../customer';
import {CustomerService} from '../customer.service';
import {Car} from '../car';
import {CustomerNew} from '../customer_new';


@Component({
    selector: 'create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

    customer: CustomerNew = new CustomerNew();
    cars: Car[];
    customerId: string;
    submitted = false;
    receivedCustomerIdError = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private customerService: CustomerService
    ) {
        this.getCarsList();
    }


    ngOnInit() {
        this.receivedCustomerIdError = !this.hasReceivedCustomerId();
        console.log('this.receivedCustomerIdError===' + this.receivedCustomerIdError);
        console.log('------------');

        if (this.receivedCustomerIdError) {
            this.customer = new CustomerNew();
            this.customer.active = true;
        } else {
            console.log('ngOnInit else');
            console.log('-------------');
            this.receiveCustomerObjByKey(this.customerId);
        }

    }

    private getCarsList() {
        this.customerService.getCarsList()
            .subscribe(data  => {
                this.cars = data;
            });
    }

    private hasReceivedCustomerId(): // can NOT be deleted
        boolean {
        console.log('private method hasReceivedCustomerId()');
        if (this.route.snapshot.paramMap.has('customerId')) {
            this.customerId = this.route.snapshot.paramMap.get('customerId');  // get customerId from URL
            return true;
        } else {
            this.customerId = null; // stands for the creation of a new customer
            return false;
        }
    }


    newCustomer(): void {
        this.submitted = false;
        this.customer = new CustomerNew();
        this.customer.active = true;
    }

    private receiveCustomerObjByKey(id: string): void {
        this.customerService.getCustomerObj(id).subscribe(customer => {
                this.customer = customer;
            }
        );

    }

    save() {
        console.log(this.customer);
        if (this.receivedCustomerIdError) {
            this.customerService.createCustomer(this.customer);
            this.customer = new CustomerNew();
        } else {
            if (this.customer !== undefined) {
                this.updateCustomer();
            }
            this.router.navigateByUrl('customers');
        }
    }


    updateCustomer() {
        console.log('Update')
        console.log(this.customer);
        this.customerService.updateCustomer(this.customerId, this.customer);
    }

    onSubmit() {
        this.submitted = true;
        this.save();
    }

}
