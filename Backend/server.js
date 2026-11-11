// import 'dotenv/config';
// import { GoogleGenAI } from '@google/genai';
// const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// const interaction = await ai.interactions.create({
//   model: "gemini-3.6-flash",
//   input: "bigest boyband in aisa",
// });
// console.log(interaction.output_text);

import express from "express";
import 'dotenv/config';
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT, () => {
  console.log("server is listing");
  connectDB();
});

const connectDB = async() => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with DB")
  }catch(err){
    console.log("Failed to connect with db ",err);
  }
};

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       model: "gemini-3.6-flash",
//       contents: [
//     {
//       role: "user",
//       parts: [{ text : req.body.message }]
//     }
//   ]
//     })
//   };

//   try {
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", options);
//     const data = await response.json();
//     console.log(data);
//     const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
//     res.send(output);
//   } catch (err) {
//     console.log(err);
//   }
// })


