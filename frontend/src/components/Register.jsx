import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Avatar, Stack, CircularProgress, Alert } from '@mui/material';
import userThunk from '../features/user/user.service';
import MDInput from '../ui/MDInput';
const Register = () => {
  const [fileInputState, setFileInputState] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewSource, setPreviewSource] = useState();
  // * validation shema
  const signupValidationSchema = Yup.object().shape({
    username: Yup.string().required('Vui lòng nhập tên đăng nhập!'),
    email: Yup.string().required('Vui lòng nhập địa chỉ email!').email('Địa chỉ email không đúng!'),
    password: Yup.string().required('Vui lòng nhập mật khẩu!').min(6, 'Mật khẩu phải ít nhất 6 ký tự!').max(40, 'Mật khẩu không được nhiều hơn 40 ký tự!'),
    confirmPassword: Yup.string()
      .required('Vui lòng nhập lại mật khẩu')
      .oneOf([Yup.ref('password'), null], 'Xác nhập mật khẩu không trùng khớp'),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  // todo useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signupValidationSchema) });

  const registerHandle = (data) => {
    if (previewSource) {
      data.image = previewSource;
    }
    setLoading(true);
    dispatch(userThunk.registerAPI(data))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          setOpenSuccess(true);
          setSuccessMessage('Tạo tài khoản thành công!');
        }, 2000);
        setTimeout(() => {
          navigate('/messager/login');
        }, 3000);
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

  return (
    <div className="register">
      <div className="card">
        <div className="card-header">
          <h3>Đăng ký</h3>
        </div>
        <div className="card-body">
          <form onSubmit={registerHandle}>
            <div className="form-group">
              <MDInput id="firstName" name="firstName" type="text" {...register('username')} error={errors.username ? true : false} label="Tên đăng nhập" />
              <Typography fontSize="14px" variant="inherit" color="primary">
                {errors.username?.message}
              </Typography>
            </div>
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
              <MDInput id="confirmPassword" name="confirmPassword" {...register('confirmPassword')} error={errors.confirmPassword ? true : false} type="password" label="Nhập lại mật khẩu" fullWidth />
              <Typography fontSize="14px" variant="inherit" color="primary">
                {errors.confirmPassword?.message}
              </Typography>
            </div>
            <div className="form-group">
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} sx={{ height: '70px' }}>
                {previewSource && <Avatar src={previewSource} alt="tiep" />}
                <div className="file">
                  <input type="file" name="image" id="image" onChange={handleFileInputChange} value={fileInputState} />
                </div>
              </Stack>
            </div>
            <div className="form-group">
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ marginBottom: '5px' }}>
                {loading ? <CircularProgress size={30} sx={{ color: '#3d85c6' }} /> : null}
                {openError ? <span style={{ fontsize: '14px', color: '#cc0033' }}> {errorMessage}</span> : null}
                {openSuccess ? <span style={{ fontsize: '14px', color: '#41bc66' }}> {successMessage}</span> : null}
              </Stack>
            </div>
            <div className="form-group">
              <button className="btn" onClick={handleSubmit(registerHandle)}>
                Đăng ký
              </button>
            </div>

            <div className="form-group">
              <span>
                <p>Bạn đã có tài khoản?</p>
                <Link to="/messager/login">Đăng nhập</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
