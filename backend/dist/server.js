"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const userRoutes_1 = require("./routes/userRoutes");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', userRoutes_1.userRouter);
app.get('/', (req, res) => {
    res.send('Servidor rodando');
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
console.log(process.env.DATABASE_URL);
//# sourceMappingURL=server.js.map