import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPaasword from './pages/ForgotPaasword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Upload from './pages/Upload';
import Flicks from './pages/Flicks';
import Story from './pages/Story';
import Messages from './pages/Messages';
import MessageArea from './pages/MessageArea';
import { addStory } from './redux/storySlice';
import getCurrentUser from './hooks/getCurrentUser';
import getSuggestedUser from './hooks/getSuggestedUser';
import getAllPost from './hooks/getAllPost';
import getAllFlicks from './hooks/getAllFlicks';
import getAllStories from './hooks/getAllStories';
import getPreviousChatUser from './hooks/getPreviousChatUsers';

import { setOnlineUsers, setSocket } from './redux/socketSlice';
import Search from './pages/Search';
import getAllNotifications from './hooks/getAllNotifications';
import Notifications from './pages/Notifications';
import { setNotificationData } from './redux/userSlice';
export const serverUrl = "https://nexo-backend-8kew.onrender.com";

function App() {
  getAllNotifications()
  getCurrentUser();
  getSuggestedUser();
  getAllPost();
  getAllFlicks();
  getAllStories();
  getPreviousChatUser();

  const { userData } = useSelector((state) => state.user);
  const { notificationData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  
    
 
  useEffect(() => {
    if (!userData?._id) return;

    const socketIo = io(serverUrl, {
      query: {
        userId: userData._id,
      },
     withCredentials: true,
    });

    socketIo?.on("newNotification",(noti)=>{
      dispatch(setNotificationData([...notificationData,noti]))
    })

    // socketIo.on("connect", () => {
    //   console.log("Socket Connected:", socketIo.id);
    // });

    socketIo.on("getOnlineUsers", (users) => {
      //console.log("ONLINE USERS:", users);
      dispatch(setOnlineUsers(users));
    });

    socketIo.on("newStory", (story) => {

    console.log("New Story Received:", story);

    dispatch(addStory(story));

});

    dispatch(setSocket(socketIo));

    return () => {
      socketIo.off("getOnlineUsers");
      socketIo.off("newStory");
      socketIo.disconnect();
      dispatch(setSocket(null));
    };

  }, [userData?._id, dispatch]);

  return (
    <Routes>
      <Route
        path='/signup'
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      <Route
        path='/signin'
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      <Route
        path='/'
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />

      <Route
        path='/profile/:userName'
        element={userData ? <Profile /> : <Navigate to="/signin" />}
      />

      <Route
        path='/story/:userName'
        element={userData ? <Story /> : <Navigate to="/signin" />}
      />

      <Route
        path='/upload'
        element={userData ? <Upload /> : <Navigate to="/signin" />}
      />
      
      <Route
        path='/search'
        element={userData ? <Search /> : <Navigate to="/signin" />}
      />

      <Route
        path='/editprofile'
        element={userData ? <EditProfile /> : <Navigate to="/signin" />}
      />

      <Route
        path='/messages'
        element={userData ? <Messages /> : <Navigate to="/signin" />}
      />

      <Route
        path='/messageArea'
        element={userData ? <MessageArea /> : <Navigate to="/signin" />}
      />
      <Route
        path='/notifications'
        element={userData ? <Notifications/> : <Navigate to="/signin" />}
      />

      <Route
        path='/flicks'
        element={userData ? <Flicks /> : <Navigate to="/signin" />}
      />

      <Route
        path='/forgotpassword'
        element={!userData ? <ForgotPaasword /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
