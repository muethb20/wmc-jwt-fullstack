import { useState } from 'react';
import './App.css';
import UserPage from "./pages/user-page/UserPage";
import { Post, User, UserTokens } from "./interfaces";
import axios from "axios";
import { AUTH_API_URL, DATA_API_URL } from "./constants";
import { handleLogin } from "./services";

function App() {
    const [user, setUser] = useState<User>({ username: '' });
    const [tokens, setTokens] = useState<UserTokens>({ accessToken: '', refreshToken: '' });
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null); // State for error messages

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${DATA_API_URL}/posts`, {
                headers: { Authorization: `Bearer ${tokens.accessToken}` },
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response && error.response.status === 403) {
                await refreshAccessToken();
            } else {
                setError('Failed to fetch posts. Please try again later.'); // Set error message
            }
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(`${AUTH_API_URL}/token`, { token: tokens.refreshToken });
            setTokens({ accessToken: response.data.accessToken, refreshToken: tokens.refreshToken });
            await fetchPosts();
        } catch (error) {
            console.error('Error refreshing token:', error);
            setError('Session expired. Please log in again.'); // Handle token refresh failure
            handleLogout();
        }
    };

    const handleLogout = () => {
        setTokens({ accessToken: '', refreshToken: '' });
        setPosts([]);
        setUser({ username: '' }); // Reset user state on logout
    };

    const login = async () => {
        try {
            const fetchedTokens = await handleLogin(user);
            if (fetchedTokens) {
                setTokens(fetchedTokens);
                fetchPosts();
            } else {
                setError('Login failed. Please check your username.'); // Handle login failure
            }
        } catch {
            setError('Login failed. Please try again.'); // General login error
        }
    };

    return (
        <div className="App">
            {tokens.accessToken ? (
                <UserPage user={user} posts={posts} fetchPosts={fetchPosts} handleLogout={handleLogout} />
            ) : (
                <div>
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={(e) => setUser({ username: e.target.value })}
                    />
                    <br />
                    <button onClick={login}>Login</button>
                </div>
            )}
        </div>
    );
}

export default App;
