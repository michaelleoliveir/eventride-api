import { Router } from "express";

const routes = Router();

routes.get('/', (req, res) => {
    res.json({ message: 'API is working' })
})

export default routes;