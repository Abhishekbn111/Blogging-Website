import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import './Profile.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/blog-removebg-preview.png'
import UserProImg from '../assets/user.png'
import { auth, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from '../Firebase Config/Config'
import { doc, db, getDoc, updateDoc, onAuthStateChanged } from '../Firebase Config/Config'

export default function Profile() {
    let [CurrentUser, setCurrentUser] = useState([]);
    let [CurrentUserDataID, setCurrentUserDataID] = useState("");
    let [UpdateUserName, setUpdateUserName] = useState("");
    let [UpdateOldPass, setUpdateOldPass] = useState("");
    let [UpdateNewPass, setUpdateNewPass] = useState("");
    let [UpdateConfirmPass, setUpdateConfirmPass] = useState("");
    const navigate = useNavigate();
    let CurrentUserId;
    let CurrentUserData;

    //  GETDATA TO CURRENTUSER    //

    useEffect(() => {

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                CurrentUserId = user.uid

                const docRef = doc(db, "users", CurrentUserId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    CurrentUserData = docSnap.data()
                    console.log("Document data:", CurrentUserData);
                    setCurrentUserDataID(docSnap.id);
                    setCurrentUser(CurrentUserData)

                } else {
                    console.log("No such document!");
                }

            } else {
                console.log("User not found");
            }
        });

    }, [])

    //  UPDATE PROFILE  //

    const UpdateBtn = async (uid) => {
        const userDataRef = doc(db, "users", uid);

        if (UpdateUserName == "") {
            setUpdateUserName(CurrentUser.Full_Name);
        }
        else {
            await updateDoc(userDataRef, {
                Full_Name: UpdateUserName
            });
            console.log(userDataRef);
            Swal.fire({
                title: "Profile!",
                text: "Profile Updated!",
                icon: "success"
            });
        }
        if (UpdateOldPass && UpdateNewPass && UpdateConfirmPass) {
            updateUserPassword()
        }
    }

    //  UPDATE PASSWORD //

    const updateUserPassword = () => {
        const currentuser = auth.currentUser;
        if (UpdateNewPass == UpdateConfirmPass) {

            console.log(UpdateOldPass);
            console.log(UpdateNewPass);
            console.log(UpdateConfirmPass);
            const credential = EmailAuthProvider.credential(
                currentuser.email,
                UpdateOldPass
            )
            reauthenticateWithCredential(currentuser, credential).then(async (res) => {
                console.log('res--->', res);
                updatePassword(currentuser, UpdateConfirmPass).then(() => {
                    Swal.fire({
                        title: "God job!",
                        text: "Password Updated!",
                        icon: "success"
                    });
                }).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error,
                    });
                });
                const userDataRef = doc(db, "users", CurrentUserDataID);
                await updateDoc(userDataRef, {
                    Password: UpdateConfirmPass
                });
            }).catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error,
                });
            });
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please Confirm Password!",
            });
        }

    }

    //  LOGOUT  //

    const logOut = () => {
        signOut(auth).then(() => {
            navigate('/')
        }).catch((error) => {
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
                    <input className='form-control' placeholder='Full Name' type="text" name="" id="1" onChange={(e) => setUpdateUserName(e.target.value)} defaultValue={CurrentUser.Full_Name} /><br />
                    <input className='form-control' placeholder='Email' disabled type="email" name="" id="2" defaultValue={CurrentUser.Email} /><br />
                    <input className='form-control' placeholder='Old Password' type="password" name="" id="3" onChange={(e) => setUpdateOldPass(e.target.value)} /><br />
                    <input className='form-control' placeholder='New Password' type="password" name="" id="4" onChange={(e) => setUpdateNewPass(e.target.value)} /><br />
                    <input className='form-control' placeholder='Confirm Password' type="password" name="" id="5" onChange={(e) => setUpdateConfirmPass(e.target.value)} /><br /><br />
                    <button className='btn btn-primary' onClick={() => UpdateBtn(CurrentUserDataID)}>Update</button>
                </div>
            </div>
        </div>
    )
}
