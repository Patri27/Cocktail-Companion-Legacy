import React, { useState } from 'react';
import { PageProps } from '../interfaces/Props';
import { register } from '../apiComs/myApi';
import { User } from '../interfaces/User';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/LOGO.png';
import { useAuth } from '../context/authContext';

export default function Register({ setPage }: PageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const { setUser } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const userData: User = await register(username, password);
      // console.log(userData);

      if (userData) {
        userData.username = username;

        setUser(userData);
        setPage('search');

        setRegistrationStatus('success');
      }
    } catch (err) {
      setRegistrationStatus(err as string);
    }
  }
  const navigate = useNavigate();

  return (
    <div className='register-page'>
      <header className='page-header'>
        <div className='header-wrapper'>
          <div
            className='logo'
            onClick={() => {
              setPage('search');
              navigate('/');
            }}
          >
            <img src={logo} alt='Logo' />
          </div>
          <div className='button-container'>
            <Link to='/' className='login-button'>
              back
            </Link>
          </div>
        </div>
      </header>
      <form onSubmit={e => handleSubmit(e)}>
        <div className='item-form'>
          <label htmlFor='username'>Username</label>
          <input
            id='username'
            className='form-input'
            name='username'
            required={true}
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className='item-form'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            className='form-input'
            name='password'
            required={true}
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type='submit'>Register</button>
        {registrationStatus &&
          (registrationStatus === 'success' ? (
            <div className='success-message'>User registered successfully.</div>
          ) : (
            <div className='error-message'>{registrationStatus.toString()}</div>
          ))}
      </form>
    </div>
  );
}
