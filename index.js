import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const url = "https://export-service.dillyapis.com";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ تعديل هنا
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

let cosmeticsData;

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(url + "/v1/cosmetics/new");
    const result = response.data.data;
    cosmeticsData = result;
    res.render("index.ejs", {
      data: result,
      entries: response.data.entries,
      mode: "latest",
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "Failed to fetch data",
    });
  }
});

app.get("/search", async (req, res) => {
  const query = req.query.q?.toLowerCase();
  console.log("query is ", query);
  const searchResult = await axios.get(url + "/v1/cosmetics");
  const searchData = searchResult.data.data;

  let result = searchData.filter((element) => {
    return element.name?.toLowerCase().includes(query);
  });

  console.log("result: ", result);

  res.render("index.ejs", {
    data: result,
    entries: result.length,
    mode: "search",
  });
});

app.listen(port, () => {
  console.log(`Server Running on port : ${port}`);
});
