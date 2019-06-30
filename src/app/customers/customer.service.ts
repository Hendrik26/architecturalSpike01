import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {CustomerNew} from './customer_new';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {shareReplay} from 'rxjs/operators';
import {leftJoinDocument} from '../collectionJoin';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private dbPath = '/customers';
    private dbPathCars = '/cars';

    constructor(private db: AngularFirestore) {
    }

    getCarsList(): Observable<any> {
        return this.db.collection(this.dbPathCars)
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const key = a.payload.doc.id;
                    return {key, ...data};
                })));
    }

    getJoinedCustomersList(sortDirStr, dbMinage, dbMaxage): Observable<any> {
        return this.db.collection(this.dbPath,
            ref => ref.orderBy('age', sortDirStr).where('age', '>=', dbMinage).where('age', '<=', dbMaxage))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const key = a.payload.doc.id;
                    return {key, ...data};
                })))
            .pipe(
                leftJoinDocument(this.db, 'car', 'cars'),
                shareReplay(1)
            );
    }

    createCustomer(customer: CustomerNew): void {
        this.db.collection(this.dbPath).add({
            'active': customer.active,
            'age': customer.age,
            'name': customer.name,
            'car': customer.car
        }).catch(error => this.handleError(error));
    }

    deleteCustomer(id: string): void {
        this.db.doc(`${this.dbPath}/${id}`).delete().catch(error => this.handleError(error));

    }


    getCustomerObj(id): Observable<any> {
        return this.db.doc(`${this.dbPath}/${id}`).valueChanges();
    }

    updateCustomerActive(id: string, active: boolean): void {
        this.db.doc(`${this.dbPath}/${id}`).update({
            'active': active
        }).catch(error => this.handleError(error));
    }

    updateCustomer(id: string, customer: CustomerNew): void {
        this.db.doc(`${this.dbPath}/${id}`).update({
            'active': customer.active,
            'age': customer.age,
            'name': customer.name,
            'car': customer.car
        }).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }
}
