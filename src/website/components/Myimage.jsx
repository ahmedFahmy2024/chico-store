import { Box } from "@mui/material";
import { useState } from "react";

import '../css/myimage.css'

function Myimage({images}) {
    const [mainImage, setMainImage] = useState(null)
    const [activeImage, setActiveImage] = useState(null);

    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
        setActiveImage(imageUrl);
    };
    // Get array of image URLs
    const imageUrls = images ? images.split(',') : [];
    // Get the first image URL
    const firstImage = imageUrls.length > 0 ? imageUrls[0] : null;
  return (
    <div>
    <Box className="main-image-container">
        <img className="main-image" src={mainImage || firstImage} alt="img" />
    </Box>
    <Box className="image-slider-container">
        {imageUrls.map((imageUrl, index) => (
            <img onClick={() => handleImageClick(imageUrl)} key={index} className={[activeImage === imageUrl ? "active" : "", "image-slide"].join(" ")} src={imageUrl} alt="img" />
        ))}
    </Box>
</div>
  )
}

export default Myimage