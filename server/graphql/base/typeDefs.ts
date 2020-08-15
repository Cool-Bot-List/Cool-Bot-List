import query from "./queries";
import mutations from "./mutations";
import botType from "../bot/bot.type";
import reviewType from "../review/review.type";
import ownerReplyType from "../ownerReply/ownerReply.type";
import userType from "../user/user.type";
import notificationType from "../notification/notification.type";
import voteType from "../vote/vote.type";

const typeDefs = [query, mutations, botType, reviewType, ownerReplyType, userType, notificationType, voteType];

export default typeDefs;
