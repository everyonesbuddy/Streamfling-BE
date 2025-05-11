import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

// const openai = new OpenAIApi(configuration);

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
    message: "Hello from Sports Analyst tool",
  });
});

//AI prompt route
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a sports analyst that help coaches and scouts, perform analysis and gameplans. I will provide you some data and context to work with.",
        },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.choices[0].message,
    });
  } catch (error) {
    // console.log(error);
    // res.status(500).send({ error });
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type); // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
  }
});

//listen
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
