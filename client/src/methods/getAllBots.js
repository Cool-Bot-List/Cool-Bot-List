import Axios from "axios";
export default async function getAllBots () {
    return Axios.get("http://localhost:5000/api/bots");
}