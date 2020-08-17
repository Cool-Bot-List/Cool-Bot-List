import botGetResolver from "../bot/resolvers/bot.get.resolver";
import botCreateResolver from "../bot/resolvers/bot.create.resolver";
import botUpdateResolver from "../bot/resolvers/bot.update.resolver";
import botDeleteResolver from "../bot/resolvers/bot.delete.resolver";
import botApproveResolver from "../bot/resolvers/bot.approve.resolver";

import userGetResolver from "../user/resolvers/user.get.resolver";
import userUpdateResolver from "../user/resolvers/user.update.resolver";
import userDelete from "../user/resolvers/user.delete.resolver";

import tokenMakeResolver from "../token/resolvers/token.make.resolver";

import reviewGetResolver from "../review/resolvers/review.get.resolver";
import reviewCreateResolver from "../review/resolvers/review.create.resolver";
import reviewDeleteResolver from "../review/resolvers/review.delete.resolver";
import reviewLikeResolver from "../review/resolvers/review.like.resolver";
import reviewDislikeResolver from "../review/resolvers/review.dislike.resolver";

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

    tokenMakeResolver,

    reviewGetResolver,
    reviewCreateResolver,
    reviewDeleteResolver,
    reviewLikeResolver,
    reviewDislikeResolver,


    // reviewResolver,
    // reviewMutationResolver,
    // notificationResolver,
    // voteResolver,
    // // reviewResolver,
    // // reviewMutationResolver,
    // // userResolver,
    // // userMutationResolver,
    // // notificationResolver,
    // // voteResolver,
];

export default resolvers;
