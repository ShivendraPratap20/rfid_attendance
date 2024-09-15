const mong = require('mongoose');
const dbURL = process.env.DB_CON;
mong.connect(dbURL, {
    serverSelectionTimeoutMS: 30000
})
.then(()=>{
    console.log(`Database connection established`);
}).catch((err)=>{
    console.log(`Error while connecting to the database ${err}`);
})