import multer from "multer"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

const upload = multer({ storage })
export {upload};
/*
}
This callback defines the folder path where uploaded files will be saved.

Here, ./public/temp means:

Inside your project folder → go to public/temp/.

The cb (callback) takes two arguments:

null: means no error occurred.

'./public/temp': the folder to store the file.

📌 If the folder doesn’t exist, make sure to create it manually, or you can write code to create it automatically.
filename: function (req, file, cb) {
  cb(null, file.originalname)
}
This decides what the uploaded file will be named when saved.

Here, it uses file.originalname, which means:

The name will be exactly the same as it was on the client’s computer.

cb(null, filename) again uses:

null → no error

file.originalname → the filename to save.

🧠 If you want to avoid overwriting files, you can make the filename unique like this:

js
Copy code
cb(null, Date.now() + '-' + file.originalname)
📦 Creating the Upload Middleware
js
Copy code
const upload = multer({ storage })
This initializes multer with the storage configuration you created.

Now upload can be used as a middleware in routes to handle uploads.

Example usage in Express 👇

js
Copy code
import express from "express"
const app = express()

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully!")
})
upload.single("file") means:

Expect one file with the field name "file" in your form.

You can also use:

upload.array("files", 5) → multiple files (max 5)

upload.fields([{ name: "profile" }, { name: "resume" }]) → different field names
*/