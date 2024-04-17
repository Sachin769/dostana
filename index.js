"use strict"
const path = require("path");
// require("dotenv").config({path: path.join(__dirname,"environments",".env.developments")});
// require("./connections/mongodb");
const express = require("express");
const bodyParser = require("body-parser");
// const httpContext = require("express-http-context");
const fileUpload = require("express-fileupload");
const axios = require("axios");
const qs = require("qs");
const app = express();




// const adminRoutes = require("./routes/adminRoutes");
// const userRoutes = require("./routes/userRoutes");
// const vendorRoutes = require("./routes/vendorRoutes");


//allow json and multipart-form data
app.use(bodyParser.json());
app.use(fileUpload());

//allow to use Static Files and login information
// app.use(httpContext.middleware);
const publicFolderPath = path.join(__dirname, "assests");
app.use(express.static(publicFolderPath));

//Enable CORS for HTTP
app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization,Content-Type,Accept,bkd_api_key");
    next();
});

app.post("/profile-verification", async (req, resp) => {
    try {
        const constantPath = path.join(__dirname, "assests");
        const inputFile = req.files.profileImage;
        const destFileName = Date.now() + ".jpg";
        // const imageFilePath = path.join("mqtr_social_compaign_proof", loginDetails.login_id, req.body.mqtr_social_compaign_id, destFileName);
        const storeFilePath = path.join(constantPath, destFileName);
        await inputFile.mv(storeFilePath);
        console.log("enter done",destFileName);
        // const senderLink = `http://192.168.0.213:2200/${destFileName}`;
        // const storedLink = "http://192.168.0.213:2200/1713359212828.jpg"

        const senderLink = `https://dostana.onrender.com/${destFileName}`;
        const storedLink = "https://dostana.onrender.com/1713359212828.jpg";
        console.log("senderLink",senderLink);
        console.log("storedLink",storedLink);
        let data = qs.stringify({
            'linkFile1': senderLink,
            'linkFile2': storedLink
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://face-verification2.p.rapidapi.com/faceverification',
            headers: {
                'X-RapidAPI-Key': '7779d7fc9fmshbe1c4aee32a2243p151f32jsn6750a153f0d5',
                'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };
        console.log("hiii");
        const responseData = await axios.request(config);
        console.log("responData",responseData.data.data.resultMessage);
        resp.status(200).json({code: 200,message: responseData.data.data.resultMessage});

    } catch (e) {
        console.log("e.message",e.message);
        resp.status(422).json({ code: 422, message: "Invalid Image" })
    }
})



const port = process.env.PORT || 2200;
var server = app.listen(port, () => {
    console.log(`Server Started : Listen on : ${port}`)
})
