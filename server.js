import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";
import { Configuration, OpenAIApi } from "openai";

const morgan = require("morgan");
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
// app.use(cors());
// app.use(express.json());

//db
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB connection error", err));

//middleware
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

// app.get("/", async (req, res) => {
//   res.status(200).send({
//     message: "Hello from streamfling AI",
//   });
// });

// app.post("/", async (req, res) => {
//   try {
//     const prompt = req.body.prompt;

//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `${prompt}`,
//       temperature: 1,
//       max_tokens: 200,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0,
//     });

//     res.status(200).send({
//       bot: response.data.choices[0].text,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error });
//   }
// });

//autoload routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

//listen
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
