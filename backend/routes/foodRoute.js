import multer from 'multer'
import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js'

const foodRouter = express.Router()


//Image Storage Engine
// const storage = multer.diskStorage({
//     destination:"uploads",
//     filename:(req,file,cb)=>{
//         return cb(null,`${Date.now()}${file.originalname}`);
//     }
// });

// const upload = multer({storage:storage})

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)





export default foodRouter;