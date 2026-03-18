import express from 'express';
import dotenv from 'dotenv';
import db from './src/models';
import emailRoutes from './src/routes/email.routes';
import userRoutes from './src/routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api', emailRoutes);
app.use('/api', userRoutes);

db.sequelize.authenticate().then(() => {
    console.log('Postgres connected');
    app.listen(port, () => console.log(`Server running on ${port}`));
});

