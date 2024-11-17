import Footer from "./components/header/footer";
import Header from "./components/header/header";

const posts = [{
  title: "Post 1",
  description: "This is a description for post 1",
  image: "https://via.placeholder.com/300"
}, {
  title: "Post 2",
  description: "This is a description for post 2",
  image: "https://via.placeholder.com/300"
}, {
  title: "Post 3",
  description: "This is a description for post 3",
  image: "https://via.placeholder.com/300"
}, {
  title: "Post 4",
  description: "This is a description for post 4",
  image: "https://via.placeholder.com/300"
}]
export default function Home() {
  return (
   <div>
    <Header/>
    <section className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* <section className="py-10 bg-gray-100">
      <div className="container mx-auto px-1">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
        <ul className="space-y-8">
          {posts.map((post, index) => (
            <li key={index} className="flex items-start gap-4 bg-white shadow-md rounded-lg p-4">
              <img
                src={post.image}
                alt={post.title}
                className="h-8- w-300 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm">{post.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section> */}
    <Footer/>
    
    </div>
  );
}
