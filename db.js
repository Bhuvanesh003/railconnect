const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const object=mongo.ObjectId;

let database;

async function getdatabase()
{
    var pass=encodeURIComponent("Bhuvi70#");
    const client =await MongoClient.connect(`mongodb+srv://bhuvanesh:${pass}@cluster0.dquo2h6.mongodb.net/?retryWrites=true&w=majority`);
    database = client.db('rail')

    if(!database)
    {
        console.log("Database not Connected");
    }   
    console.log("Connected");
    return database;
}

module.exports = {getdatabase,object}