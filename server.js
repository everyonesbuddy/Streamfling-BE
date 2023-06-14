import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { readdirSync } from "fs";
const Auth = require("../server/models/auth");
import { hashPassword, comparePassword } from "../server/helpers/auth";
import jwt from "jsonwebtoken";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

//Welcome to streamfling route
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from streamfling",
  });
});

//AI prompt route
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 1,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.5,
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

app.post("/register", async (req, res) => {
  try {
    //validation
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
      return res.json({
        error: "First Name and Last Name is required",
      });
    }
    if (!password || password.lenght < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await Auth.findOne({ email: email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }
    //hash password
    const hashedPassword = await hashPassword(password);

    //crete account in stripe
    const customer = await stripe.customers.create({
      email,
    });

    try {
      const auth = await new Auth({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        stripe_customer_id: customer.id,
      }).save();

      //create signed token
      const token = jwt.sign({ _id: auth._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      const { password, ...rest } = auth._doc;
      return res.json({
        token,
        auth: rest,
        expiresIn: 43200,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    //check email
    const auth = await Auth.findOne({ email: req.body.email });
    if (!auth) {
      return res.json({
        error: "No user found",
      });
    }

    //check password
    const match = await comparePassword(req.body.password, auth.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    //create signed token
    const token = jwt.sign({ _id: auth._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    const { password, ...rest } = auth._doc;

    res.json({
      token,
      auth: rest,
      expiresIn: 43200,
    });
  } catch (err) {
    console.log(err);
  }
});

//listen
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
