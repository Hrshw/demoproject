const mongoose = require("mongoose");
const connectionString = "mongodb+srv://rahulsingh:rahulsingh@cluster0.gw0gvpe.mongodb.net/demoprject"


mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("mongodb connected");
})
.catch((err) => {
    console.log("Failed to connect to MongoDB:", err);
});

 