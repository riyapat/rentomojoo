import { AiFillHome ,AiOutlineSetting ,AiOutlineHeart,AiOutlineComment,AiOutlineShareAlt,AiOutlineLogout,AiOutlineSearch,AiOutlinePlus} from 'react-icons/ai';
import { BsFillBookmarkFill,BsSend,BsStars ,BsChevronBarExpand,BsSave} from 'react-icons/bs';
import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import Avatar  from '../../assets/avatar.jpg'
import postImg  from '../../assets/postImg.jpg'
import Button from '../../components/Button'
import GridLoader from 'react-spinners/GridLoader'
import { stats } from '../Home/data'


const People = () => {

    const { username } = useParams()
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState([])
    const [isFollowed, setIsFollowed] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getPosts = async () => {
            setLoading(true)
            console.log('ffff')
            const response = await fetch(`http://localhost:8000/api/people?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('user:token')}`
                }
            })
            const data = await response.json()
            setPosts(data?.posts)
            setUser(data?.userDetail)
            setIsFollowed(data?.isFollowed)
            setLoading(false)
        }

        getPosts()

    }, [])

    const handleFollowing = async ( purpose = 'follow' ) => {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/${purpose}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ id: user.id })
        })
        const data = await response.json()
        setIsFollowed(data?.isFollowed)
        setLoading(false)
    }

    if(loading || !(posts?.length)) return <div className='flex justify-center items-center h-screen'><GridLoader/></div>

    return (
        <div className='flex justify-center items-center'>
            <div className='flex flex-col items-center p-10'>
                <div className='flex flex-col justify-center items-center'>
                <img src={Avatar}  width='120px' height='120px' className='border-4 rounded-full p-2' />
                    <div className='my-4 text-center'>
                        <h3 className='text-xl font-semibold'>{user?.username}</h3>
                        <p className='text-sm font-light'>{user?.email}</p>
                    </div>
                    <div className='flex justify-around w-[600px] text-center my-4 border p-4'>
                        {
                            stats.map(({ id, name, stats }) => {
                                return (
                                    <div key={id}>
                                        <h4 className='font-bold text-2xl'>{stats}</h4>
                                        <p className='font-light text-lg'>{name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        {
                            !isFollowed ?
                            <Button label='Follow' disabled={loading} onClick={() => handleFollowing('follow')} />
                            :
                            <Button label='Unfollow' disabled={loading} onClick={() => handleFollowing('unfollow')} />
                        }
                    </div>
                </div>
                <div className='flex justify-between flex-wrap'>
                    {
                        posts?.length > 0 &&
                        posts?.map(({ _id, caption = '', description = '', image = '' }) => {
                            return (
                                <div className='w-[400px] mt-6 mx-2 flex flex-col border p-4 rounded-lg'>
                                    <div className='pb-4 mb-4'>
                                        <div className='h-[300px] flex justify-center items-center bg-gray-100'>
                                            <img src={postImg} alt="Post" className='rounded-xl max-h-full' />
                                        </div>
                                        <div className='flex mt-4 mb-2 pb-2 justify-center'>
                                            <p className='font-medium text-center'>{caption}</p>
                                        </div>
                                        <p className='mb-4 text-sm font-normal text-center'>{description}</p>
                                    </div>
                                    <div className='flex justify-evenly text-black text-sm font-medium'>
                                        <div className='flex items-center'><span className='mr-2'><AiOutlineHeart /></span>10.5k</div>
                                        <div className='flex items-center'><span className='mr-2'><AiOutlineComment /></span>10.5k</div>
                                        <div className='flex items-center'><span className='mr-2'><AiOutlineShareAlt /></span>10.5k</div>
                                        <div className='flex items-center'><span className='mr-2'><BsSave/></span>10</div>
                                    </div>
                                </div>
                            )
                        })

                    }
                </div>
            </div>
        </div>
    )
}

export default People