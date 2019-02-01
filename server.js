const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const pdf = require("html-pdf");
const responseFile = require("./responseFile");
console.log(responseFile);

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.end("whatever");
});

app.post("/", (req, res) => {
  console.log("recived req");
  const { name, about } = req.body;
  console.log(req.body);
  const html = `
  <html>
    <head>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet">
        <style>
            body {
                text-align: center;
            }
            h1 {
                color: blue;
                font-family: "Roboto", sans-serif;
            }
            p {
                margin-top: 40px;
            }
            img {
                flot: right;
            }
        </style> 
    </head>
    <body>
        <h1 style='color: red; font-family: 'Roboto';>${name}</h1>
        <p>${about}</p>
        <img src="https://via.placeholder.com/150" width="150" />
    </body>
    </html>`;
  let fileName = "test_pdf.pdf";

  pdf.create(html).toStream(function(err, stream) {
    stream.pipe(fs.createWriteStream("./foo.pdf"));

    responseFile("./foo.pdf", fileName, res);
  });
});

app.post("/", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server is runing on port: ${port}`);
});
