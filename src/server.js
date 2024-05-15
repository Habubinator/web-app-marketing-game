var express = require("express");
const path = require("path");
const cors = require("cors");

var app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
const apiRouter = require("./server/routes/apiRouter.js");

app.options("*", cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(process.cwd(), "public", "html", "index.html"));
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log("Server works on port " + PORT);
});
