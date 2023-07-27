import express from "express";
import compressionMiddleware from "compression";
import markoMiddleware from "@marko/express";
import indexPage from "./pages/index";
import gamesTemplate from "./pages/games/index.marko";
import usersService from "./services/users";

const port = parseInt(process.env.PORT || 3000, 10);

const app = express();

app.use(compressionMiddleware()) // Enable gzip compression for all HTTP responses.
app.use("/assets", express.static("dist/assets")) // Serve assets generated from webpack.
app.use(markoMiddleware()) // Enables res.marko.
app.get("/", indexPage)

app.get("/games", (req, res) => {
  res.marko(gamesTemplate, {});
});

app.get("/services/users", usersService)

app.listen(port, err => {
  if (err) {
    throw err;
  }

  if (port) {
    console.log(`Listening on port ${port}`);
  }
});
