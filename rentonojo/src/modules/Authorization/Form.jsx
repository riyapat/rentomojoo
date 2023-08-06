import React from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import LoginSvg from '../../assets/loginSvg.jpg'
import  RegisterSvg  from '../../assets/registerSvg.jpg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Form = ({
    isSignInPage = false
}) => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        ...(!isSignInPage && { username: '' }),
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({...data})
        })

        console.log(res, 'res');
        if(res.status === 200 && isSignInPage){
            const { token, user } = await res.json()
            console.log(token, user, 'response');
            localStorage.setItem('user:token', token)
            navigate('/');
        } else if(res.status === 401) {
            alert('Invalid Credentials')
        } else {
            alert('Error, please try again later')
        }
        
    }
    
    return (
    <div className='bg-[#d2cfdf] h-screen w-full flex justify-center items-center'>
        <div className='h-[700px] w-[1000px] bg-white flex justify-center items-center'>
            <div className={`h-full w-full flex flex-col justify-center items-center ${!isSignInPage && 'order-2'}`}>
                <div className=' text-4xl font-extrabold'>WELCOME {isSignInPage && 'BACK'}</div>
                <div className='mb-[50px] font-light'>PLEASE {isSignInPage ? 'LOGIN' : 'REGISTER'} TO CONTINUE</div>
                <form className='w-[350px]' onSubmit={(e) => handleSubmit(e)}>
                    {
                    !isSignInPage && 
                    <Input label='Username' type='text' placeholder='Enter your username' value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
                    }
                    <Input label={`Email ${isSignInPage ? ' or username' : ''}`} type={`${isSignInPage ? 'text' : 'email'}`} placeholder={`Enter your email${isSignInPage ? ' or username' : ''}`} value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    <Input label='Password' type='password' placeholder='Enter your password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                    <Button type={'submit'} label={isSignInPage ? 'Sign in' : 'Register'} className='my-5' />
                <div className=' cursor-pointer text-md hover:text-blue-700 underline' onClick={() => navigate(`${isSignInPage ? '/account/signup' : '/account/signin'}`)}> {isSignInPage ? 'Create new account' : 'Sign in'} </div>
                </form>
            </div>
            <div className={`flex justify-center items-center h-full w-full bg-[#F2F5F8] ${!isSignInPage && 'order-1'}`}>
                {
                    isSignInPage ?
                    <img src={LoginSvg} alt='login' width='300px' height='300px' />
                    :
                    <img src={RegisterSvg} alt='login' width='300px' height='300px' />
                }
            </div>
        </div>
    </div>
  )
}

export default Form