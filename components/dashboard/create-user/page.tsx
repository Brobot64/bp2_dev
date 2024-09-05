'use client';

import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import style from '../../all.module.css';
import MessagePopup from '../popups/MessagePopup';

const Users: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role_id, setRoleID] = useState('2');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/createModerator`,
                {
                    name,
                    email,
                    password,
                    role_id,
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log('User created:', response.data);
            setSuccessMessage('User created successfully!');
            setName('');
            setEmail('');
            setPassword('');
            setRoleID('');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Server error:', error.response.data);
                    setError(error.response.data.message || 'An error occurred.');
                } else if (error.request) {
                    console.error('No response from server:', error.request);
                    setError('Failed to communicate with the server.');
                } else {
                    console.error('Request error:', error.message);
                    setError('An unexpected error occurred.');
                }
            } else {
                console.error('Unknown error:', error);
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const closeSuccessMessage = () => {
        setSuccessMessage('');
    };

    const closeErrorMessage = () => {
        setError('');
    };

    return (
        <div className={style.cardContainer}>
            <div className={` ${style.card} ${style.w25}`}>
                <div className={style.header}>
                    Create User
                </div>
                <div className={style.body}>
                    {error && <MessagePopup message={error} onClose={closeErrorMessage} />}
                    {successMessage && <MessagePopup message={successMessage} onClose={closeSuccessMessage} />}
                    <form onSubmit={handleSubmit} className={style.formWrap}>
                        <div className={style.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                placeholder='Enter Name'
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                placeholder='Enter Email'
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                placeholder='Enter Password'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                value={role_id}
                                onChange={(e) => setRoleID(e.target.value)}
                                required
                            >
                                <option>Select User Role</option>
                                <option value="2">Moderator</option>
                                <option value="3">User</option>
                            </select>
                        </div>
                        <div className={`${style.centerContent} ${style.formGroup}`}>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : '[ Create User ]'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Users;
