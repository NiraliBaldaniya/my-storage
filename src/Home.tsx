import './Home.css'
import notimage from './assets/not-image.jpg';
import Image from './assets/image.jpg';
import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase';
import { useNavigate } from 'react-router-dom'


function Home() {
    const imageInput = useRef<HTMLInputElement | null>(null)
    const [storedimages, setstoredimages] = useState<any[]>([])
    const navigate = useNavigate();

    const deleteStoredImage = async (path: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");

        if (!confirmDelete) {
            return;
        }

        const { error: storageError } = await supabase.storage.from("images").remove([path]);

        if (storageError) {
            console.log("Storage delete error:", storageError);
            return;
        }

        const { error: databaseError } = await supabase.from("images_storage").delete().eq("image_url", path);

        if (databaseError) {
            console.log("Database delete error:", databaseError);
            return;
        }

        setstoredimages(prev => prev.filter(image => image.path !== path));
        console.log("Image deleted successfully");
    };


    async function uploadimage(file: File) {

        const { data, error } = await supabase.auth.getUser();

        if (!data.user) {
            console.log(error);
            return;
        }

        const userid = data.user.id;
        const filepath = userid + "/" + file.name;

        const { data: existingFile, error: checkError } =
            await supabase.from("images_storage").select("id, image_url").eq("user_id", userid).eq("image_url", filepath);

        if (checkError) {
            console.log("Check error:", checkError);
            return;
        }

        if (existingFile.length > 0) {
            alert(`${file.name} is already uploaded!`);
            return;
        }


        const { error: uploadError } =
            await supabase.storage.from("images").upload(filepath, file);

        if (uploadError) {
            console.log("Upload error:", uploadError);
            return;
        }


        const { error: databaseError } =
            await supabase.from("images_storage").insert({
                image_url: filepath,
                user_id: userid
            });

        if (databaseError) {
            console.log("Database error:", databaseError);
            return;
        }

        loadimages();
    }

    async function loadimages() {
        const { data, error } = await supabase.auth.getUser();

        if (!data.user) {
            console.log(error);
            return;
        }

        const userid = data.user.id;

        const { data: imagesData, error: imagesError } =
            await supabase.from("images_storage").select("image_url").eq("user_id", userid);

        if (imagesError) {
            console.log(imagesError);
            return;
        }

        const stored = await Promise.all(
            imagesData.map(async (row) => {

                const { data: signedData, error: signedError } =
                    await supabase.storage.from("images").createSignedUrl(row.image_url, 3600);

                if (signedError) {
                    console.log(signedError);
                    return null;
                }


                const fileName = row.image_url.split("/").pop() || "";


                const folderPath = row.image_url.substring(0, row.image_url.lastIndexOf("/"));


                const { data: files, error: listError } =
                    await supabase.storage.from("images").list(folderPath);

                if (listError) {
                    console.log(listError);
                    return null;
                }

                const file = files.find(
                    (item) => item.name === fileName
                );

                return {
                    url: signedData.signedUrl,
                    name: fileName,
                    date: file?.created_at
                        ? new Date(file.created_at).toLocaleDateString()
                        : "",
                    time: file?.created_at
                        ? new Date(file.created_at).toLocaleTimeString()
                        : "",
                    size: file?.metadata?.size
                        ? Math.round(file.metadata.size / 1024)
                        : 0,
                    path: row.image_url
                };
            })
        );

        setstoredimages(stored.filter(Boolean));
    }


    useEffect(() => {
        loadimages();
    }, []);

    async function userLogOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.log(error)
        } else {
            console.log("Logged out successfully")
            navigate("/");
        }
    }

    return (
        <>
            <head>
                <title>Home</title>
            </head>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

            <div className="navbar">
                <h1>upload image</h1>
                <button onClick={userLogOut} >Log Out</button>
            </div>

            <div className="img-container">
                <img src={Image} alt="Uploaded Image" />
                <h2>Upload Image</h2>
                <input type="file" id="imageUpload" ref={imageInput} accept="image/*" multiple onChange={async (e) => {
                    const files = Array.from(e.target.files || []);

                    for (const file of files) {
                        await uploadimage(file);
                    }

                    e.target.value = "";
                }} />

                <button className="uploadButton" onClick={() => imageInput.current?.click()}>choose image </button>
            </div>

            <div className="img-info">
                <h2>your images</h2>

                {storedimages.length > 0 ? (

                    <div className="images-list">

                        {storedimages.map((stored, index) => (

                            <div key={index} className="img-details">
                                <img src={stored.url} alt={stored.name} onClick={() => {

                                    const modal = document.getElementById("imageModal") as HTMLDivElement;
                                    const modalImg = document.getElementById("modalImg") as HTMLImageElement;
                                    const closeBtn = document.querySelector(".close") as HTMLSpanElement;

                                    modal.style.display = "flex";
                                    modalImg.src = stored.url;
                                    closeBtn.onclick = () => {
                                        modal.style.display = "none";
                                    };
                                }} />

                                <div className="namedatetime">

                                    <span>Name: {stored.name}</span>
                                    <span>Date: {stored.date}</span>
                                    <span>Time: {stored.time}</span>
                                    <span>Size: {stored.size} KB</span>

                                    <button className="deleteButton" onClick={() => deleteStoredImage(stored.path)}> Delete </button>

                                </div>

                                <span
                                    className="download"
                                    onClick={async () => {
                                        const response = await fetch(stored.url);
                                        const blob = await response.blob();
                                        const link = document.createElement("a");

                                        link.href = URL.createObjectURL(blob);
                                        link.download = stored.name;
                                        link.click();
                                    }} >
                                    <i className="fa-solid fa-download"></i>
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="status" id="status">
                        <img id="preview" src={notimage} alt="not-image" />
                        <p>no image selected</p>
                    </div>
                )}
            </div>

            <div id="imageModal" className="modal">
                <span className="close"><i className="fa-solid fa-xmark"></i></span>
                <img id="modalImg" />
            </div>
        </>
    )
}
export default Home