import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"


// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

// Verification endpoint
app.get("/verify", (req, res) => {
    const { success, orderId } = req.query;

    // You can handle different response formats here
    res.status(200).json({
        success,
        orderId,
        message: success === 'true' ? 'Payment was successful!' : 'Payment failed!',
    });
});

app.get("/",(req, res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})