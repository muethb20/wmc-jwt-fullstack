import * as React from 'react';
import { Post, User } from "../../interfaces";
import {useEffect} from "react";

interface UserPageProps {
    user: User,
    posts: Post[],
    fetchPosts: () => void,
    handleLogout: () => void
}
const UserPage: React.FC<UserPageProps> = ( {user, posts, fetchPosts, handleLogout} ) => {
    useEffect(() => {
        fetchPosts();
    }, []);
    return (
        <div>
            <h1>Welcome, { user.username } <span>👋</span> </h1>
                <button onClick={() => fetchPosts()}>Beiträge abrufen</button>
                <button onClick={handleLogout}>Logout</button>
                <div>
                    <h3>Posts:</h3>
                    {posts.length > 0 ? (
                        <ul>
                            {posts.map((post, index) => (
                                <li key={index}>{post.title} von { post.username }</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No posts found.</p>
                    )}
                </div>
        </div>
    );
};

export default UserPage;