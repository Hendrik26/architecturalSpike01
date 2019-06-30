import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../customer';
import {Car} from '../car';
import {CustomerService} from '../customer.service';
import {Location} from '@angular/common';

@Component({
    selector: 'customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

    @Input() customer: Customer;

    constructor(private customerService: CustomerService,
                private router: Router) {
    }

    ngOnInit() {
    }

    updateActive(isActive: boolean) {
        this.customerService.updateCustomerActive(this.customer.key, isActive);
    }

    deleteCustomer() {
        this.customerService.deleteCustomer(this.customer.key);
    }

    updateCustomer() {
        this.router.navigateByUrl(`/customer-modify/${this.customer.key}`);
    }

}
