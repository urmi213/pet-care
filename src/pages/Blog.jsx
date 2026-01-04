import React from 'react';

function Blog() {
  const blogPosts = [
    { 
      id: 1, 
      title: "10 Tips for Taking Care of Your New Puppy", 
      excerpt: "Learn essential tips for raising a happy and healthy puppy...", 
      date: "March 10, 2024", 
      category: "Pet Care",
      readTime: "5 min read"
    },
    { 
      id: 2, 
      title: "The Ultimate Guide to Cat Nutrition", 
      excerpt: "What to feed your cat for optimal health and longevity...", 
      date: "March 5, 2024", 
      category: "Nutrition",
      readTime: "8 min read"
    },
    { 
      id: 3, 
      title: "How to Travel with Your Pet Safely", 
      excerpt: "Everything you need to know about traveling with your furry friend...", 
      date: "February 28, 2024", 
      category: "Travel",
      readTime: "6 min read"
    },
    { 
      id: 4, 
      title: "Understanding Pet Behavior: What Your Pet is Trying to Tell You", 
      excerpt: "Decode your pet's behavior and strengthen your bond...", 
      date: "February 20, 2024", 
      category: "Behavior",
      readTime: "7 min read"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pet Care Blog</h1>
          <p className="text-lg text-gray-600 mb-8">Expert advice, tips, and stories for pet lovers</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              All Articles
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition duration-300">
              Pet Care
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition duration-300">
              Training
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition duration-300">
              Health
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-blue-500 bg-blue-50 py-1 px-3 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-blue-500 hover:text-blue-600 font-semibold">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6">Get the latest pet care tips and exclusive offers delivered to your inbox.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;