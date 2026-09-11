import "./Home.css";
import { useEffect, useRef, useState } from "react";
import notImage from "./assets/not-image.jpg";
import Image from "./assets/image.jpg";

function Home() {
    useEffect(() => {
        document.title = "Home";
    }, []);

    const imageInput = useRef<HTMLInputElement | null>(null);
    const [image, setimage] = useState<File | null>(null);

    const deleteimage = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");

        if (!confirmDelete) {
            return;
        }
        setimage(null)
    }

    return (
        <>
            <div className="navbar">
                <h1>Upload Image</h1>
            </div>

            <div className="img-container">
                <img src={Image} alt="Upload Image" />

                <h2>Upload Image</h2>

                <input type="file" id="imageUpload" ref={imageInput} accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                        setimage(file);
                    }
                }} />

                <button className="uploadButton" onClick={() => imageInput.current?.click()} > Choose Image</button>
            </div>

            <div className="img-info">
                <h2>Your Images</h2>

                {image === null ? (
                    <div className="status" id="status">
                        <img id="preview" src={notImage} alt="No image selected" />
                        <p>No image selected</p>
                    </div>
                ) : (
                    <div id="images-list">
                        <div className="img-details">
                            <img src={URL.createObjectURL(image)} alt="" />

                            <div className="namedatetime">
                                <span>Name: {image.name}</span>
                                <span>Date: {new Date().toLocaleDateString()}</span>
                                <span>Time: {new Date().toLocaleTimeString()}</span>
                                <span>Size: {(image.size / 1024).toFixed(2)} KB</span>

                                <button className="deleteButton" onClick={deleteimage}>Delete </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div id="imageModal" className="modal">
                <span className="close">
                    <i className="fa-solid fa-xmark"></i>
                </span>

                <img id="modalImg" alt="Preview" />

                <span className="download">
                    <i className="fa-solid fa-download"></i>
                </span>
            </div>
        </>
    );
}

export default Home;