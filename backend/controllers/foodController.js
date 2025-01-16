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

const addFood = async (req, res) => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'food_items',
            use_filename: true,
            unique_filename: false,
        });

        // Save food details in database, including image URL from Cloudinary
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: result.secure_url, // Cloudinary image URL
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food" });
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

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        // Delete image from Cloudinary
        const publicId = food.image.split('/').pop().split('.').shift(); // Extract public_id from URL
        await cloudinary.v2.uploader.destroy(publicId);

        // Delete food item from database
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food" });
    }
}

export {addFood,listFood,removeFood}