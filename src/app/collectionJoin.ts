// Downloaded from Git-Url: https://github.com/AngularFirebase/133-firestore-joins-custom-rx-operators.git
import {AngularFirestore} from 'angularfire2/firestore'; // from 'angularfire2/firestore';
import {combineLatest, of, defer, forkJoin} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';


export const leftJoinDocument = (afs: AngularFirestore, field, collection) => {
    return source =>
        defer(() => {
            // Operator state
            let collectionData;
            const cache = new Map();

            return source.pipe(
                switchMap(data => {
                    // Clear mapping on each emitted val ;
                    cache.clear();

                    // Save the parent data state
                    collectionData = data as any[];

                    const reads$ = [];
                    let i = 0;
                    for (const doc of collectionData) {
                        // Skip if doc field does not exist or is already in cache
                        if (!doc[field] || cache.get(doc[field])) {
                            continue;
                        }

                        // Push doc read to Array
                        reads$.push(
                            afs
                                .collection(collection)
                                .doc(doc[field])
                                .valueChanges()
                        );
                        cache.set(doc[field], i);
                        i++;
                    }

                    return reads$.length ? combineLatest(reads$) : of([]);
                }),
                map(joins => {
                    return collectionData.map((v, i) => {
                        const joinIdx = cache.get(v[field]);
                        return {...v, [field]: joins[joinIdx] || null};
                    });
                }),
                tap(final =>
                    console.log(
                        `Queried ${(final as any).length}, Joined ${cache.size} docs`
                    )
                )
            );
        });
};
