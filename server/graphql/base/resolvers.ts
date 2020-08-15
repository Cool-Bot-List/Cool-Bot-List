import botResolver from "../bot/bot.resolver";
import reviewResolver from "../bot/bot.mutation.resolver";
import reviewMutationResolver from "../review/review.mutation.resolver";
import userResolver from "../user/user.resolver";
import notificationResolver from "../notification/notification.resolver";
import voteResolver from "../vote/vote.resolver";

const resolvers = [botResolver, reviewResolver, reviewMutationResolver, userResolver, notificationResolver, voteResolver];

export default resolvers;
