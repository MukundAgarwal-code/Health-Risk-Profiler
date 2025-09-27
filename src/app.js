import express from "express";
import 'dotenv/config';

//Middlewares
import { upload } from "./middlewares/multer.middleware.js";

//Controllers
import { mainController } from "./controllers/main.controller.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/analyse", upload.single("image"), mainController);

export { app };