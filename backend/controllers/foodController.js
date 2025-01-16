import foodModel from "../models/foodModel.js";
// import fs from 'fs'
import { v2 as cloudinary } from "cloudinary";
// add food item

cloudinary.config({
    cloud_name: 'dbnvbi1th',
    api_key: '596191857214815',
    api_secret: 'oagbx96pGzWOONJx5YAnf2bjz98',
    secure: true,
});

// const addFood = async (req, res) => {
//     let image_filename = `${req.file.filename}`;

//     const food = new foodModel({
//         name:req.body.name,
//         description:req.body.description,
//         price:req.body.price,
//         category:req.body.category,
//         image:image_filename
//     })
//     try {
//         await food.save();
//         res.json({success:true,message:"Food Added"})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Error"})
//     }
// }

// chatgpt
// const addFood = async (req, res) => {
//     try {
//         // Upload image to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'food_items',
//             use_filename: true,
//             unique_filename: false,
//         });

//         // Save food details in database, including image URL from Cloudinary
//         const food = new foodModel({
//             name: req.body.name,
//             description: req.body.description,
//             price: req.body.price,
//             category: req.body.category,
//             image: result.secure_url, // Cloudinary image URL
//         });

//         await food.save();
//         res.json({ success: true, message: "Food Added" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error adding food" });
//     }
// };

const addFood = async (req, res) => {
    try {
      // Validate if the file exists in the request
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file is required" });
      }

      console.log('Uploaded file:', req.file);
  
      // Upload image to Cloudinary directly from buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "food_items",
          use_filename: true,
          unique_filename: false,
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ success: false, message: "Error uploading image" });
          }
  
          // Save food details in database
          const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url, // Cloudinary secure URL
          });
  
          await food.save();
          res.json({ success: true, message: "Food Added", food });
        }
      );
  
      // Pipe the image buffer to Cloudinary's upload stream
      uploadStream.end(req.file.buffer); // Send the file buffer to Cloudinary
  
    } catch (error) {
      console.error("Error adding food:", error);
      res.status(500).json({ success: false, message: "Error adding food" });
    }
  };

// all food list
const listFood = async (req, res)=>{
try {
    const foods = await foodModel.find({});
    res.json({success:true, data:foods})
} catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
}
}

 
// remove food item
// const removeFood = async (req, res) => {
//     try {
//         const food = await foodModel.findById(req.body.id)
//         fs.unlink(`uploads/${food.image}`,()=>{})

//         await foodModel.findByIdAndDelete(req.body.id)
//         res.json({success:true, message:"Food Removed"})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false, message:"Error"})
//     }
// }

// const removeFood = async (req, res) => {
//     try {
//         const food = await foodModel.findById(req.body.id);

//         // Delete image from Cloudinary
//         const publicId = food.image.split('/').pop().split('.').shift(); // Extract public_id from URL
//         await cloudinary.v2.uploader.destroy(publicId);

//         // Delete food item from database
//         await foodModel.findByIdAndDelete(req.body.id);
//         res.json({ success: true, message: "Food Removed" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Error removing food" });
//     }
// }

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Extract public_id from Cloudinary URL
        const publicId = food.image.split('/').pop().split('.')[0]; // Extract public_id (before the extension)
        console.log("Public ID:", publicId);

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(`food_items/${publicId}`); // Include folder name if applicable

        // Delete food item from the database
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};


export {addFood,listFood,removeFood}