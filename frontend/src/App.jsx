import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SinglePost from "./components/SinglePost";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./store/socketSlice";
import { setOnlineUsers } from "./store/chatSlice";
import useGetAllMessages from "./hooks/useGetAllMessages";
import { setLikeNotification, setMessageNotification } from "./store/rtnSlice";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/post/:id",
        element: <SinglePost />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector(store => store.socket)
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      // listenting all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on('notification', (notification) => {
        console.log(notification);
        dispatch(setLikeNotification(notification));
      })
      socketio.on('messageNotification', (messageNotification) => {
        console.log(messageNotification);
        dispatch(setMessageNotification(messageNotification));
      })
      return () => {
        socket.close();
        dispatch(setSocket(null));
      };
    } else if(socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
