import { config } from "dotenv";
config();
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
