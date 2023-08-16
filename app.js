const express = require('express')
const mysql = require("mysql")
const app = express()


app.use(express.static("public"))
app.set("view engine", "pug")
app.set("views", "./views")

const conn = mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"",
  database: "realestate"
})



app.get("/", (req, res) => {
    conn.query("SELECT DISTINCT suburb FROM properties", (err, suburbs) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      console.log(suburbs)
      conn.query("SELECT * FROM properties limit 12", (err, properties) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }
        res.render("index", {
          title: "Home Page",
          suburbs,
          properties
        });
      });
    });
});


// By Suburb Route = /:suburb
//app.get("/:suburb", (req, res) => {
//  const suburb = req.params.suburb; // Get the suburb from the URL parameter
//  const page = parseInt(req.query.page) || 1;
//  const perPage = 12;
//
//  // Retrieve distinct suburbs for the navigation sidebar
//  conn.query("SELECT DISTINCT suburb FROM properties", (err, suburbs) => {
//    if (err) {
//      return res.status(500).send("Internal Server Error");
//    }
//
//    // Retrieve properties for the specified suburb
//    conn.query(
//      `SELECT * FROM properties WHERE suburb = ? LIMIT ? OFFSET ?`,
//      [suburb, perPage, (page - 1) * perPage],
//      (err, properties) => {
//        if (err) {
//          console.error(err);
//          return res.status(500).send("Internal Server Error");
//        }
//
//        // Retrieve the total count of properties for pagination
//        conn.query(
//          `SELECT COUNT(*) as count FROM properties WHERE suburb = ?`,
//          [suburb],
//          (err, countResult) => {
//            if (err) {
//              console.error(err);
//              return res.status(500).send("Internal Server Error");
//            }
//
//            const totalRecords = countResult[0].count;
//            const totalPages = Math.ceil(totalRecords / perPage);
//
//            // Render the template with suburb-specific data
//            res.render("index", {
//              title: "Home Page",
//              suburbs,
//              properties,
//              totalPages,
//              currentPage: page,
//              suburb,
//            });
//          }
//        );
//      }
//    );
//  });
//});

app.get("/:suburb", (req, res)=>{
  const suburb = req.params.suburb;
  const page = parseInt(req.query.page) || 1;
  const perPage = 12;

  conn.query("SELECT DISTINCT suburb FROM properties", (err, suburbs) =>{
    if(err) {
      return res.status(500).send("Internal Server Error");
    }

    conn.query(`SELECT * FROM properties WHERE suburb = '${suburb}' ORDER BY RAND() LIMIT ${(page - 1) * perPage}, ${perPage}`, (err, properties) => {
      if(err){
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      conn.query(`SELECT COUNT(*) as count FROM properties WHERE suburb = '${suburb}'`, (err, countResult) => {
        if(err){
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        const totalRecords = countResult[0].count;
        const totalPages = Math.ceil(totalRecords / perPage);

        console.log(properties);

        res.render("index", {
          title: "Home Page",
          suburbs,
          properties,
          totalPages,
          currentPage: page,
          suburb,
        });
      });
    });
  });
});


app.get("/about", (req, res) => {
  res.render("about", {
    title: 'About Page' // Set the correct title for the about page
  });
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});