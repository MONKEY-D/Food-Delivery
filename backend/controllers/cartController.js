import userModel from "../models/userModel.js";

// // Add items to user cart
// const addToCart = async (req, res) => {
//   try {
//     let userData = await userModel.findById(req.body.userId);
//     let cartData = await userData.cartData;
//     if (!cartData[req.body.itemId]) {
//       cartData[req.body.itemId] = 1
//     }
//     else{
//       cartData[req.body.itemId] += 1;
//     }
//     await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//     res.json({success:true,message:"Added to Cart"});
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };


// // Remove items from user cart
// const removeFromCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId)
//         let cartData = await userData.cartData
//         if (cartData[req.body.itemId]>0) {
//             cartData[req.body.itemId] -= 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//         res.json({success:true,mesage:"Removed From Cart"})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Eror"})        
//     }
// };

// // fetch user cart data
// const getCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         res.json({success:true,cartData})
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Error"})
//     }
// };

// export { addToCart, removeFromCart, getCart };





// Add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    // Check if user exists
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure cartData is initialized
    let cartData = userData.cartData || {};

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    // Check if user exists
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure cartData is initialized
    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;

      // Remove the item if its count becomes 0
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId];
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    // Check if user exists
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure cartData is initialized
    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };