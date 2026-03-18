"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = __importDefault(require("./src/models"));
const email_routes_1 = __importDefault(require("./src/routes/email.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use('/api', email_routes_1.default);
models_1.default.sequelize.authenticate().then(() => {
    console.log('Postgres connected');
    app.listen(port, () => console.log(`Server running on ${port}`));
});
