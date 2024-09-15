const mong = require('mongoose');
mong.connect("mongodb+srv://shivendragkp2002:1UbEUwxrQqH4ndfF@cluster0.3l7um.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    serverSelectionTimeoutMS: 30000
})
.then(()=>{
    console.log(`Database connection established`);
}).catch((err)=>{
    console.log(`Error while connecting to the database ${err}`);
})