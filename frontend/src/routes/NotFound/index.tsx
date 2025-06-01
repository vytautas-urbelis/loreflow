import {Link} from "react-router"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 text-lg text-blue-500 border-2 border-blue-500 rounded-md px-6 py-2 transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
      >
        Go back to Home
      </Link>
    </div>
  )
}

export default NotFound
