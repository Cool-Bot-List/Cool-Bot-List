import "dotenv/config";

const dev = {
    PORT: 5000,
    CALLBACK_URL: "http://localhost:5000/login/redirect",
    FRONTEND: {
        BASE: "http://localhost:3000",
        NEW_USER: "http://localhost:3000/new-user",
        USER: (id: string): string => `http://localhost:3000/users/${id}`,
    },
};

const prod = {
    PORT: process.env.PORT,
    CALLBACK_URL: "https://coolbotlistapi.herokuapp.com/login/redirect",
    FRONTEND: {
        BASE: "https://coolbotlist.tk",
        NEW_USER: "https://coolbotlist.tk/new-user",
        USER: (id: string): string => `https://coolbotlist.tk/users/${id}`,
    },
};

export let environment: typeof dev | typeof prod = dev;

if (process.env.NODE_ENV === "production") environment = prod;
