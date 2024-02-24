export default (db) => {
    const { TODO_COLLECTION } = process.env;
    const collection = db.collection(TODO_COLLECTION);

    async function insertOne(todo) {
        return await collection.insertOne(todo);
    }

    async function checkOne(todoID, checked) {
        // Update the checked field of a todo document
        return await collection.updateOne(
            { todoID: todoID },
            { $set: { ["checked"]: checked } }
        );
    }

    async function getTodoByUserID(userID) {
        return await collection.find({
            userID : userID
        }).toArray();
    }

    return {
        insertOne,
        getTodoByUserID,
        checkOne
    }
};