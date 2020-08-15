import botRoute from "./bots";
import userRoute from "./users";
import tokenRoute from "./token";
import voteRoute from "./vote";
import loginRoute from "./oauth2/login";
import reviewRoute from "./reviews";
import ownerReplyRoute from "./ownerReply";
import notificationRoute from "./notifications";

const api = {
    bot: {
        route: botRoute,
        vote: {
            route: voteRoute,
        },
        review: {
            route: reviewRoute,
            ownerReply: {
                route: ownerReplyRoute,
            },
        },
    },
    user: {
        route: userRoute,
        notification: {
            route: notificationRoute,
        },
        token: {
            route: tokenRoute,
        },
        oauth: {
            login: {
                route: loginRoute,
            },
        },
    },
};

export default api;
