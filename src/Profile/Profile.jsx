import React from 'react'
import './Profile.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/blog-removebg-preview.png'
import UserProImg from '../assets/user.png'
import { auth, signOut } from '../Firebase Config/Config'
import { doc, db, getDoc, onAuthStateChanged } from '../Firebase Config/Config'

export default function Profile() {
    const navigate = useNavigate();
    let CurrentUserId;

    //  GETDATA TO CURRENTUSER    //

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            // console.log(user);
            CurrentUserId = user.uid

            const docRef = doc(db, "users", CurrentUserId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

        } else {
            console.log("User not found");
        }
    });

    //  LOGOUT  //

    const logOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate('/')
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });

    }

    return (
        <div>

            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid" id='nav'>
                    <img src={logo} alt="" id='logo' />
                    <a className="navbar-brand navtext" href="#">MyBlog</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item lidrop">
                                <a className="nav-link active" aria-current="page" href="#"></a>
                            </li>
                            <Link to={'/dashboard'}><button className='btn dashboard'>Dashboard</button></Link>
                            <button className='btn btn-primary logoutnav' onClick={logOut}>Logout</button>
                        </ul>

                    </div>
                </div>
            </nav>
            <br /><br /><br /><br />
            <h1 id='Pro'><span>P</span>rofile</h1>

            <div className='PeofileUpdateDiv'>
                <div className="ProfileImgDiv">
                    <img src={UserProImg} alt="" id='ProfileImg' /><br />
                    <input type="file" name="" id="selectImg" />
                    <i className="fa-solid fa-camera" id='selectImgIcon'></i>
                </div><br />
                <div>
                    <input className='form-control' placeholder='Full Name' type="text" name="" id="1" /><br />
                    <input className='form-control' placeholder='Email' disabled type="email" name="" id="2" /><br />
                    <input className='form-control' placeholder='Old Password' type="password" name="" id="3" /><br />
                    <input className='form-control' placeholder='New Password' type="password" name="" id="4" /><br />
                    <input className='form-control' placeholder='Confirm Password' type="password" name="" id="5" /><br /><br />
                    <button className='btn btn-primary '>Update</button>
                </div>
            </div>
        </div>
    )
}
