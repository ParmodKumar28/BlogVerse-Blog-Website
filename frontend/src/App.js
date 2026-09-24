import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { fetchCurrentUserAsync } from "./Redux/reducers/usersReducer";
import store from "./Redux/store";
import "react-toastify/dist/ReactToastify.css";

// Route component imports
import Home from "./components/Home/home";
import Login from "./components/login/login";
import Signup from "./components/sign-up/signup";
import PostForm from "./components/Post Form/postForm";
import PostDetail from "./components/Post/post";
import Profile from "./components/profile/profile";
import Page404 from "./components/Page 404/Page404";
import Navbar from "./components/navbar/navbar";
import ProtectedRoute from "./components/Protected Routes/ProtectedRoute";

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    errorElement: <Page404 />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/posts/new",
        element: (
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "/posts/:id/edit",
        element: (
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        ),
      },
      { path: "/posts/:id", element: <PostDetail /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // On every app load, silently hit /user/refresh using the httpOnly cookie
    // to restore the user session into Redux state (no-op if not logged in).
    dispatch(fetchCurrentUserAsync());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Provider>
  );
};

export default App;
