import logo from './logo.svg';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import theme from './assets/theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './features/user/user.slice';
import Home from './components/Home';
import messageThunk from './features/message/message.service';
import { PrivateComponent } from './components/PrivateRoute';
function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.isLoggedIn) {
      dispatch(userActions.isUserLoggedIn());
    }
  }, [dispatch, user.isLoggedIn]);

  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(messageThunk.getFriendsAPI());
    }
  }, [dispatch, user.isLoggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateComponent>
              <Home />
            </PrivateComponent>
          }
        />
        <Route path="/messager/login" element={<Login />} />
        <Route path="/messager/register" element={<Register />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
