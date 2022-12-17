const express = require("express");
const app = express();
const path = require("path");
const getRoutes = require("./routes/getRoutes");
const ngrok = require("ngrok");
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("/public"));

app.use("/api/v1", getRoutes);

app.listen(PORT, () => {
  console.log(`Server listenning on port: ${PORT}`);
});

(async function() {
    const url = await ngrok.connect({
        proto: "http",
        addr: PORT,
        authtoken: ""
    })
    console.log(url)
})()
