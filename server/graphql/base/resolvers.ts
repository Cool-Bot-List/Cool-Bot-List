import botGetResolver from "../bot/resolvers/bot.get.resolver";
import botCreateResolver from "../bot/resolvers/bot.create.resolver";
import botUpdateResolver from "../bot/resolvers/bot.update.resolver";
import botDeleteResolver from "../bot/resolvers/bot.delete.resolver";
import botApproveResolver from "../bot/resolvers/bot.approve.resolver";

import userGetResolver from "../user/resolvers/user.get.resolver";
import userUpdateResolver from "../user/resolvers/user.update.resolver";
import userDelete from "../user/user.delete.resolver";
// import reviewResolver from "../bot/resolvers/bot.create.resolver";
// import reviewMutationResolver from "../review/review.mutation.resolver";
// import userResolver from "../user/user.resolver";
// import userMutationResolver from "../user/user.mutation.resolver";
// import notificationResolver from "../notification/notification.resolver";
// import voteResolver from "../vote/vote.resolver";

const resolvers = [
    botGetResolver,
    botCreateResolver,
    botUpdateResolver,
    botDeleteResolver,
    botApproveResolver,

    userGetResolver,
    userUpdateResolver,
    userDelete,
    // reviewResolver,
    // reviewMutationResolver,
    // userResolver,
    // userMutationResolver,
    // notificationResolver,
    // voteResolver,
];

export default resolvers;
