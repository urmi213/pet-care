import React, { useState } from 'react';

function Community() {
  const [posts, setPosts] = useState([
    { id: 1, user: "Alex P.", content: "Just adopted a new puppy! Any training tips?", likes: 24 },
    { id: 2, user: "Sarah M.", content: "Looking for a good pet sitter for the weekend.", likes: 12 },
  ]);

  const [newPost, setNewPost] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([...posts, { id: posts.length + 1, user: "You", content: newPost, likes: 0 }]);
      setNewPost("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Forum</h1>
          <p className="text-lg text-gray-600 mb-8">Connect with other pet lovers</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Share your thoughts with the community..."
          />
          <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
            Post
          </button>
        </form>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{post.user}</h3>
                </div>
                <button className="text-red-500">❤️ {post.likes}</button>
              </div>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <div className="flex space-x-4">
                <button className="text-gray-500 hover:text-blue-500">Like</button>
                <button className="text-gray-500 hover:text-blue-500">Comment</button>
                <button className="text-gray-500 hover:text-blue-500">Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;