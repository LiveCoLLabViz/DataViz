import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../redux/slices/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(logoutAction());
  };

  return { user, token, isAuthenticated, loading, error, logout };
}

//what are hooks? Hooks are functions that let you "hook into" React state and lifecycle features from function components.
//  They allow you to use state and other React features without writing a class component. In this code,
//  the useAuth hook is a custom hook that provides authentication-related state and actions to components that use it. It uses the useSelector hook to access the Redux store's auth state and the useDispatch hook to dispatch actions to the store.
