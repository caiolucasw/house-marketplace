import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from './Spinner';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState(null);
    const navigate = useNavigate();

    const getListing = async () => {
        const listingRef = collection(db, 'listings');
        const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
        try {
            const querySnap = await getDocs(q);
            const listings = [];
            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            setListing(listings);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getListing();
    }, []);
    if (loading) {
        return <Spinner />
    };

    if (!listing.length === 0) {
        return <></>
    }

    return listing && (
        <>
            <p className="exploreHeading">Recommended</p>
            <Swiper
                slidesPerGroupSkip={1}
                pagination={{ clickable: true }}
            >
                {listing.map(({ data, id }) => (
                    <SwiperSlide
                        key={id}
                        onClick={() => navigate(`category/${data.type}/${id}`)}
                    >
                        <div
                            style={{
                                background: `url(${data.imageUrls[0]}) no-repeat center`,
                                backgroundSize: 'cover'
                            }}
                            className="swiperSlideDiv">
                            <p className="swiperSlideText">
                                {data.name}
                            </p>
                            <p className="swiperSlidePrice">
                                ${data.discountedPrice ?? data.regularPrice}
                                {' '}
                                {data.type === 'rent' && '/month'}
                            </p>
                        </div>

                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
};

export default Slider;
