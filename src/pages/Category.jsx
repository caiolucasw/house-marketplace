import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, startAfter, documentId, DocumentReference } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Category = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

    const params = useParams();
    const fetchListings = async () => {
        try {
            const listingsRef = collection(db, 'listings');

            // Create a query
            const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10));

            // Execute query
            const querySnap = await getDocs(q);

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible);
            const listings = [];
            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });

            setListings(listings);
            setLoading(false);


        } catch (err) {
            toast.error('Could not fetch listings');

        }
    };

    useEffect(() => {
        fetchListings();
    }, [params.categoryName]);

    // Pagination  / Load More
    const onFetchMoreListings = async () => {
        try {
            const listingsRef = collection(db, 'listings');

            // Create a query
            const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(10));

            // Execute query
            const querySnap = await getDocs(q);

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible);
            const listings = [];
            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });

            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);


        } catch (err) {
            toast.error('Could not fetch listings');

        }
    };


    return (
        <div className="category">
            <header>
                <p>
                    {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sell'}
                </p>
            </header>

            {loading ? <Spinner /> : ((listings && listings.length > 0) ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map(listing => (
                                <ListingItem id={listing.id} listing={listing.data} key={listing.data} />
                            ))}
                        </ul>
                    </main>
                    <br />
                    <br />
                    {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>
                            Load More
                        </p>
                    )}
                </>
            ) : (<p>No listings for {params.categoryName}</p>))}

        </div>
    )
};

export default Category;
