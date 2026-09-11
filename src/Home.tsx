import './Home.css'
import { useEffect } from 'react';
import notImage from './assets/not-image.jpg';
import Image from './assets/image.jpg';

function Home() {
    useEffect(() => {
        document.title = "Home";
    }, []);
    return (
        <>
            <div className="navbar">
                <h1>upload image</h1>
            </div>
            <div className="img-container">
                <img src={Image} alt="Uploaded Image" />
                <h2>Upload Image</h2>
                <input type="file" id="imageUpload" accept="image/*" />

                <button className="uploadButton">choose image </button>
            </div>

            <div className="img-info">
                <h2>your images</h2>

                <div className="status" id="status">
                    <img id="preview" src={notImage} alt="Preview" />
                    <p>no image selected</p>
                </div>


                <div id="imageList"></div>

            </div>

            <div id="imageModal" className="modal">
                <span className="close"><i className="fa-solid fa-xmark"></i></span>
                <img id="modalImg" />
                <span className="download"><i className="fa-solid fa-download"></i></span>
            </div>
        </>
    )
}
export default Home