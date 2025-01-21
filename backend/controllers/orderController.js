// orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: req.body.amount * 100, // Amount in paise (INR currency)
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    res.json({ success: true, order_id: razorpayOrder.id, order_data: newOrder });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating order" });
  }
};

// Function to verify payment
const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Create a hash using Razorpay secret
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // if (generatedSignature === razorpay_signature) {
    //   // Update the order status in database
    //   await orderModel.findByIdAndUpdate(req.body.orderId, { status: "Paid", payment: true });
    //   res.json({ success: true, message: "Payment verified successfully" });
    // } else {
    //   res.json({ success: false, message: "Not Paid" });
    // }

    if (generatedSignature === razorpay_signature) {
      // If the payment is verified, we keep the default status "Food Processing"
      await orderModel.findByIdAndUpdate(orderId, {status: "Paid", payment: true });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }


  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true, data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

// List orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
}

// Api for updating order status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Update the order's status based on the admin's selection
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating order status" });
  }
};

// const updateStatus = async (req, res) => {
//   try {
//     await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
//     res,json({success:true,message:"Status Updated"})
//   } catch (error) {
//     console.log(error);
//     res.json({success:false,message:"Error"})
//   }
// }

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
