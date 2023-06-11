const { ObjectId } = require("mongodb");
const dbName = "election";
const coll = "date";
let db;

module.exports = {
  getDb: async (client) => {
    db = await client.db(dbName);
  },

  getAllDocs: async () => {
    return await db.collection(coll).find().toArray();
  },

  addDoc: async (doc) => {
    const existingElection = await db.collection(coll).findOne({});

    if (existingElection) {
      const filter = { _id: existingElection._id };
      const updatedDoc = { $set: doc };
      return await db.collection(coll).updateOne(filter, updatedDoc);
    } else {
      return await db.collection(coll).insertOne(doc);
    }
  },

  deleteDoc: async (id) => {
    const filter = { _id: new ObjectId(id) };
    return await db.collection(coll).deleteOne(filter);
  },

  updateDoc: async (filter, updatedData) => {
    return await db.collection(coll).updateOne(filter, { $set: updatedData });
  },
};
