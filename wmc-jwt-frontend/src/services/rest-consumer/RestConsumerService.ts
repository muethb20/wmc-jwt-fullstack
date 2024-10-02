import {User, UserTokens} from "../../interfaces";
import {AUTH_API_URL} from "../../constants";
import axios from "axios";
export async function handleLogin (user: User): Promise<UserTokens> {

    const username = user.username;

    try {
        const response = await axios.post(`${AUTH_API_URL}/login`, { username })

        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
        };
    } catch (error) {
        console.error('Login failed! ', error);
    }
}
