import React from 'react'
import Home from '../modules/Home'
import Form from '../modules/Authorization'
import { Navigate, Route, Routes as Router } from 'react-router-dom'
import CreatePost from '../modules/CreatePost'
import Profile from '../modules/Profile'
import People from '../modules/People'

const PrivateRoute = ({children}) => {
    const isUserLoggedIn = window.localStorage.getItem('user:token') || true
    const isFormPages = window.location.pathname.includes('account')

    if(isUserLoggedIn && !isFormPages){
        return children
    }else if(!isUserLoggedIn && isFormPages){
        return children
    }else{
        const redirectUrl = isUserLoggedIn ? '/' : '/account/signin'
        return <Navigate to={redirectUrl} replace/>
    }
}

const Routes = () => {
    const routes = [
        {
            id: 1,
            name: 'home',
            path: '/',
            Component: <Home/>
        },
        {
            id: 2,
            name: 'sign in',
            path: '/account/signin',
            Component: <Form/>
        },
        {
            id: 3,
            name: 'sign up',
            path: '/account/signup',
            Component: <Form/>
        },
        {
            id: 4,
            name: 'create post',
            path: '/new-post',
            Component: <CreatePost/>
        },
        {
            id: 5,
            name: 'my profile',
            path: '/profile',
            Component: <Profile/>
        },
        {
            id: 6,
            name: 'people',
            path: '/user/:username',
            Component: <People/>
        },
    ]
  return (
    <Router>
        {
            routes.map(({id, name, path, Component}) => {
                return <Route key={id} path={path} element={<PrivateRoute>{Component}</PrivateRoute>} />
            })
        }
    </Router>
  )
}

export default Routes