import express, { json } from 'express';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { existsSync } from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

const app = express();
app.use(json());

app.post('/api/log', async (req, res) => {
    const { message } = req.body;
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logDir = join(__dirname, 'logs');
        if (!existsSync(logDir)) {
            await fsPromises.mkdir(logDir);
        }
        await fsPromises.appendFile(join(logDir, 'app.log'), logItem);
        res.status(200).send('Log saved');
    } catch (err) {
        console.error('Failed to save log', err);
        res.status(500).send('Failed to save log');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
