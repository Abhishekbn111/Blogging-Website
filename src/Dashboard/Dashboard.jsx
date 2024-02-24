import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import logo from '../assets/blog-removebg-preview.png'
import user from '../assets/user.png'
import { db, addDoc, collection, onSnapshot } from '../Firebase Config/Config'

export default function Dashboard() {

  let [UserBlogs, setUserBlogs] = useState([]);
  let [BlogTitle, setBlogTitle] = useState("");
  let [BlogDes, setBlogDes] = useState("");

  const BlogTitleInp = (e) => {
    setBlogTitle(e.target.value)
  }
  const BlogDesInp = (e) => {
    setBlogDes(e.target.value)
  }

  //  GETDATA FROM DATDBASE //

  const GetData = () => {

    const q = (collection(db, "AllBlogs"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let Array = []
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          Array.push(change.doc.data())
        }
        if (change.type === "modified") {
          Array.push(change.doc.data())
        }
        if (change.type === "removed") {
          Array.push(change.doc.data())
        }
      });
      setUserBlogs(Array)
      console.log(UserBlogs);
    });

  }
  useEffect(() => {
    GetData()
  }, [])


  // ADD DATA IN DATABASE //

  const AddBlog = async () => {

    if (BlogTitle == '' || BlogDes == '') {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all fields!",
      });
    }
    else {

      try {
        const docRef = await addDoc(collection(db, "AllBlogs"), {
          Title: BlogTitle,
          Blog: BlogDes,
          Date: new Date().toLocaleDateString()
        });
        Swal.fire({
          icon: "success",
          title: "Good job",
          text: "Your Blog Published Successfully!",
        });
        setBlogTitle("")
        setBlogDes("")
        console.log(BlogTitle);
        console.log(BlogDes);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
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
              <li className="nav-item homenav">
                <a className="nav-link active" aria-current="page" href="#"></a>
              </li>
              <Link to={'/profile'}><button className='btn fullName'>Full Name</button></Link>
              <button className='btn home'>Home</button>
              <button className='btn btn-primary logout'>Logout</button>
            </ul>

          </div>
        </div>
      </nav>
      <br /><br /><br /><br />
      <h1 id='dash'><span>D</span>ashboard</h1>

      <div className='BlogTitleDiv'>

        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label" id='blogtitle'>Blog Title:</label>
          <input type="text" className="form-control" id="formGroupExampleInput" required placeholder="Enter Blog Title" value={BlogTitle} onChange={BlogTitleInp} />
        </div>

        <div className="mb-3">
          <label htmlFor="validationTextarea" className="form-label" id='blogdescription'>Blog Description:</label>
          <textarea className="form-control" id="validationTextarea" placeholder="Enter Blog Description" required value={BlogDes} onChange={BlogDesInp}></textarea>
        </div>
        <button className='btn btn-primary publishBtn' onClick={AddBlog}>Publish Blog</button>
      </div>

      <h2 id='AllBlogs'>All Blogs</h2>

      {!UserBlogs.length ?
        (
          <div>
            <div className='anyBlogDiv'>
              <h1>You don't have any blog yet!</h1>
            </div>
          </div>
        ) : (

          <div className="blogMainDiv">

            {
              UserBlogs.map((data, index) => {
                console.log(data);
                return (
                  <div className='blogDiv' key={index}>
                    <div className="blogDetailDiv">
                      <div className="userProfileImg">
                        <img src={user} alt="" id='userproimg' />
                      </div>
                      <div className="userNameDiv">
                        <h4 id='userproHead'>{data.Title}</h4>
                        <h6 id='userpronames'>{"Muhammad Noman"} - <span>{data.Date}</span></h6>
                      </div>
                    </div>
                    <div className="blogDescDiv">
                      <p id='userblogpara'>{data.Blog}</p>
                    </div>
                    <div className='d-flex'>
                      <button className='btn btn-outline-primary'>Edit</button>
                      <button className='btn btn-outline-danger mx-3'>Delete</button>
                    </div>
                  </div>
                )
              })
            }

          </div>

        )}

    </div>
  )
}
