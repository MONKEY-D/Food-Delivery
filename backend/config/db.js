import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://KartikVerma951:MongoDbFoodDeliveryProject@food-delivery.bn76b.mongodb.net/Food-Delivery').then(()=>console.log("DB Connected"))
}