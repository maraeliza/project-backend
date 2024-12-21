const whitelist = [
    'https://maraeliza.github.io/project',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    "http://localhost:5173"
];

const corsOptions = {
    origin: (origin:any, callback:any) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;