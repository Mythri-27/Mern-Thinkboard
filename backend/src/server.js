import express from "express"
import cors from 'cors';
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);


// app.use((req, res, next) => {
//     console.log(`Received ${req.method} request for ${req.url}`);
//     next();  
// });



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running at port :", PORT);
    });
});

// mongodb+srv://mythribadugu_db_user_new:55iyQnQ7jWanvvlT@cluster0.h1aftwl.mongodb.net/?appName=Cluster0

