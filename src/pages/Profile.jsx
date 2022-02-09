import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import Spinner from '../components/Spinner';


const Profile = () => {
    const auth = getAuth();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    });
    const { name, email } = formData;
    const navigate = useNavigate();

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want do delete?')) {
            await deleteDoc(doc(db, 'listings', listingId));
            setListings(listings.filter(listing => listing.id !== listingId));
            toast.success('Succesfully deleted listing');
        }
    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`);
    }

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, orderBy('timestamp', 'desc'), where('userRef', '==', auth.currentUser.uid));

            try {
                const querySnap = await getDocs(q);
                const listing = [];
                querySnap.forEach((doc) => {
                    listing.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setListings(listing);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserListings();
    }, [auth.currentUser.uid]);

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    name
                });
                toast.success('Profile updated!');
            }
        } catch (err) {
            toast.error('Could not update profile details');
        }
    };

    if (loading) {
        return <Spinner />
    }
    return (
        <>
            <div className="profile">
                <header className="profileHeader">
                    <p className="pageHeader">My Profile</p>
                    <button
                        type="button"
                        className="logOut"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </header>
                <main>
                    <div className="profileDetailsHeader">
                        <p className="profileDetailsText">
                            Personal Details
                        </p>
                        <p
                            className="changePersonalDetails"
                            onClick={() => {
                                changeDetails && onSubmit();
                                setChangeDetails((prevState) => !prevState);
                            }}>
                            {changeDetails ? 'done' : 'change'}
                        </p>
                    </div>
                    <div className="profileCard">
                        <form>
                            <input
                                type="text"
                                id="name"
                                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                                disabled={!changeDetails}
                                value={name}
                                onChange={onChange}
                            />
                            <input
                                type="text"
                                id="email"
                                className='profileEmail'
                                disabled
                                value={email}
                                onChange={onChange}
                            />

                        </form>
                    </div>
                    <Link to="/create-listing" className="createListing">
                        <img src={homeIcon} alt="home" />
                        <p>Sell or rent your home</p>
                        <img src={arrowRight} alt="arrow right" />
                    </Link>

                    {!loading && listings?.length > 0 && (
                        <>
                            <p className="listingText">
                                Your Listings
                            </p>
                            <ul className="listingsList">
                                {listings.map((listing) => (
                                    <ListingItem
                                        key={listing.id}
                                        id={listing.id}
                                        listing={listing.data}
                                        onEdit={() => onEdit(listing.id)}
                                        onDelete={() => onDelete(listing.id)}
                                    />
                                ))}
                            </ul>
                        </>
                    )}

                </main>

            </div>
        </>);
};

export default Profile;
