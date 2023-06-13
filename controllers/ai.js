// import { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export const getAi = async (req, res) => {
//   res.status(200).send({
//     message: "Hello from streamfling AI",
//   });
// };

// export const promptAi = async (req, res) => {
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
// };
