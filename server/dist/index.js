"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const rateLimiterMiddleware_1 = __importDefault(require("./middleware/rateLimiterMiddleware"));
const colors_1 = __importDefault(require("colors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const bundleRoutes_1 = __importDefault(require("./routes/bundleRoutes"));
const listRoutes_1 = __importDefault(require("./routes/listRoutes"));
const listItemRoutes_1 = __importDefault(require("./routes/listItemRoutes"));
const receiptRoutes_1 = __importDefault(require("./routes/receiptRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
(0, db_1.default)();
console.log(process.env.HOST_ADDRESS);
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_mongo_sanitize_1.default)());
app.use(errorMiddleware_1.default);
app.use(rateLimiterMiddleware_1.default);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.HOST_ADDRESS,
    credentials: true,
}));
app.listen(port, () => {
    console.log(colors_1.default.green.underline(`Server running on port ${port}`));
});
// Routes
app.use('/api/user', userRoutes_1.default);
app.use('/api/item', itemRoutes_1.default);
app.use('/api/bundle', bundleRoutes_1.default);
app.use('/api/list', listRoutes_1.default);
app.use('/api/listItem', listItemRoutes_1.default);
app.use('/api/receipt', receiptRoutes_1.default);
app.use(errorMiddleware_1.default);
