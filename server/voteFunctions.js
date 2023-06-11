const { ObjectId } = require("mongodb");
const dbName = "voters";
const coll = "names";
const appColl = "results";
let db;

module.exports = {
  getDb: async (client) => {
    db = await client.db(dbName);
  },

  getAllDocs: async () => {
    return await db.collection(coll).find().toArray();
  },

  addDoc: async (doc) => {
    return await db.collection(coll).insertOne(doc);
  },

  deleteDoc: async (id) => {
    const filter = { _id: new ObjectId(id) };
    return await db.collection(coll).deleteOne(filter);
  },

  getAllResults: async () => {
    return await db.collection(appColl).find().toArray();
  },

  addResults: async (application) => {
    return await db.collection(appColl).insertOne(application);
  },

  deleteResults: async (id) => {
    const filter = { _id: new ObjectId(id) };
    return await db.collection(appColl).deleteOne(filter);
  },
};
