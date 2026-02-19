import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.get("/", (req,res)=>res.send("Mokhitli LMIS™ running"));
app.listen(process.env.PORT || 3000);
