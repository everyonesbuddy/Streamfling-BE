import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
// app.use(cors());
// app.use(express.json());

//middleware
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

//Welcome to streamfling route
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Sure Odd's AI",
  });
});

//AI prompt route
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a sports betting assistant, you provide player analysis and more",
        },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
      // prompt: `${prompt}`,
      // temperature: 0.7,
      // max_tokens: 200,
      // top_p: 1,
      // frequency_penalty: 0.5,
      // presence_penalty: 0,

      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

//listen
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
