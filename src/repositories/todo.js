export default (db) => {
    const { TODO_COLLECTION } = process.env;
    const collection = db.collection(TODO_COLLECTION);

    async function insertOne(todo) {
        return await collection.insertOne(todo);
    }

    async function getTodoByUserID(userID) {
        return await collection.find({
            userID : userID
        }).toArray();
    }

    return {
        insertOne,
        getTodoByUserID
    }
};