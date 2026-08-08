import express from "express";

import {
trackVisitor,
visitorStats
}
from "../controllers/visitorController.js";


const visitorRouter = express.Router();



visitorRouter.post(
"/track",
trackVisitor
);



visitorRouter.get(
"/stats",
visitorStats
);



export default visitorRouter;
