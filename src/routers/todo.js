import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { v4 as uuidv4 } from 'uuid';
import { validateTodo, validateUser } from '../schemas/validators.js';
import auth from '../middleware/auth.js';
import { verifyToken } from '../functions/cookies.js';


dayjs.extend(utc);
const router = express.Router();

export default ({todoRepository}) => {
    // Create new todo
    router.post('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todoID = uuidv4();
            const created = dayjs().utc().toISOString();

            let newTodo = {
                ...req.body,
                todoID,
                userID: session.userID,
                created,
                checked: false,
            };

            if (validateTodo(newTodo)) {
                let resultTodo = await todoRepository.insertOne(newTodo);
                return res.status(201).send(resultTodo);
            }
            console.error(validateTodo.errors);
            return res.status(400).send({error: "Invalid field used."});
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({error: "Todo creation failed."});
        }
    });

    // Get todos from user
    router.get('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            let todos = await todoRepository.getTodoByUserID(session.userID);

            // sort by creation date
            todos = todos.sort((a,b) => dayjs(a.created).diff(dayjs(b.created)))

            if (todos) {
                delete todos._id;
                return res.status(200).send(todos)
            }
            else {
                return res.status(400).send({});
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).send({error: "Failed to fetch todo items."});
        }
    });

    // Checks todo list
    router.patch('/check', auth, async (req, res) => {
        try {
            if (typeof req.body.todoID !== 'undefined' && typeof req.body.checked !== 'undefined'){
                let result = await todoRepository.checkOne(req.body.todoID, req.body.checked)
                return res.status(200).send(result);
            }
            return res.status(400).send({error: "Missing fields."});

        }
        catch (err) {
            console.error(err);
            res.status(500).send({error: "check todo item failed."});
        }
    });

    return router;
}
