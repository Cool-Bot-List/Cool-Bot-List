import "dotenv/config";

const dev = {
    PORT: 5000,
};

const prod = {
    PORT: process.env.PORT,
};

export let environment: typeof dev | typeof prod = dev;

if (process.env.NODE_ENV === "production") environment = prod;
