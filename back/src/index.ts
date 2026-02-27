import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import routes from './routes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    hsts: false,
}));
app.use(morgan('dev'));
app.use(express.json());

app.use((req: any, res, next) => {
    req.io = io;
    next();
});

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('QR Portal Backend API is running');
});

app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
