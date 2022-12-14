import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Stack, CircularProgress } from '@mui/material';
import userThunk from '../features/user/user.service';
import MDInput from '../ui/MDInput';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const signinValidationSchema = Yup.object().shape({
    email: Yup.string().required('Vui lòng nhập địa chỉ email!').email('Địa chỉ email không đúng!'),
    password: Yup.string().required('Vui lòng nhập mật khẩu!').min(6, 'Mật khẩu phải ít nhất 6 ký tự!').max(40, 'Mật khẩu không được nhiều hơn 40 ký tự!'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signinValidationSchema) });
  const loginHandle = (data) => {
    setLoading(true);
    dispatch(userThunk.loginAPI(data))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
      .catch((error) => {
        setTimeout(() => {
          setLoading(false);
          setOpenError(true);
          setErrorMessage(error);
        }, 2000);
        setTimeout(() => {
          setOpenError(false);
          setErrorMessage('');
        }, 5000);
      });
  };
  useEffect(() => {
    if (user.isLoggedIn) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user.isLoggedIn, navigate]);

  return (
    <div className="login">
      <div className="card">
        <div className="card-header">
          <h3>Đăng nhập</h3>
        </div>
        <div className="card-body">
          <form onSubmit={loginHandle}>
            <div className="form-group">
              <MDInput id="email" name="email" {...register('email')} error={errors.email ? true : false} type="email" label="Email" fullWidth />
              <Typography fontSize="14px" variant="inherit" color="primary">
                {errors.email?.message}
              </Typography>
            </div>
            <div className="form-group">
              <MDInput id="password" name="password" {...register('password')} error={errors.password ? true : false} type="password" label="Mật khẩu" fullWidth />
              <Typography fontSize="14px" variant="inherit" color="primary">
                {errors.password?.message}
              </Typography>
            </div>
            <div className="form-group">
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ marginBottom: '5px' }}>
                {loading ? <CircularProgress size={30} sx={{ color: '#3d85c6' }} /> : null}
                {openError ? <span style={{ fontsize: '14px', color: '#cc0033' }}> {errorMessage}</span> : null}
              </Stack>
            </div>
            <div className="form-group">
              <button className="btn" onClick={handleSubmit(loginHandle)}>
                Đăng nhập
              </button>
            </div>
            <div className="form-group">
              <span>
                <p>Bạn chưa có tài khoản?</p>
                <Link to="/messager/register">Đăng ký</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
