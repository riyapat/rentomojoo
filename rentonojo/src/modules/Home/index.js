import React, { useEffect, useState } from 'react'
import  Avatar from '../../assets/avatar.jpg'
import Button from '../../components/Button'
import Input from '../../components/Input'
import postImg  from '../../assets/postImg.jpg'
//import { IconBookmark, IconHeart, IconLogout, IconMessageCircle, IconPlus, IconSearch, IconShare } from '@tabler/icons' 
import { AiFillHome ,AiOutlineSetting ,AiOutlineHeart,AiOutlineComment,AiOutlineShareAlt,AiOutlineLogout,AiOutlineSearch,AiOutlinePlus} from 'react-icons/ai';
import { BsFillBookmarkFill,BsSend,BsStars ,BsChevronBarExpand,BsSave} from 'react-icons/bs';
import { stats, navigations } from './data'
import { Link, useNavigate } from 'react-router-dom'
import GridLoader from 'react-spinners/GridLoader'

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            }
        })
        const data = await response.json()
        setData(data.posts)
        setUser(data.user)
        setLoading(false)
      }

      fetchPosts()
    
    }, [])

    const { _id: loggedInUserId = '', username = '', email = ''  } = user || {}

    const handleReaction = async (_id, index, reaction = 'like') => {
        try {
            const response = await fetch(`http://localhost:8000/api/${reaction}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({ id: _id })
            })
            const { updatedPost } = await response.json()
            const updatePost = data?.map((post, i) => {
                if(i === index) return updatedPost
                else return post
            })
            setData(updatePost)
        } catch (error) {
            console.log(error);
        }
        
    }

  return (
    <div className='h-screen bg-[#F2F2F2] flex overflow-hidden '>
        <div className='w-[20%] bg-white flex flex-col'>
            {
                loading ?
                <div className='flex justify-center items-center h-[30%] border-b'>
                <GridLoader/>
                </div>
                :
                <div className='h-[30%] flex justify-center items-center border-b'>
                    <div className='flex flex-col justify-center items-center'>
                    <img src={Avatar}  width='95px' height='95px' className='border-4 rounded-full p-2'/>
                        <div className='my-4 text-center'>
                        <h3 className='text-xl font-semibold'>{username}</h3>
                        <p className='text-sm font-light'>{email}</p>
                        </div>
                        <div className='h-[50px] flex justify-around w-[300px] text-center'>
                            {
                                stats.map(({id, name, stats}) => {
                                    return(
                                    <div key={id}>
                                        <h4 className='font-bold'>{stats}</h4>
                                        <p className='font-light text-sm'>{name}</p>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            <div className='h-[55%] flex flex-col justify-evenly pl-12 border-b text-gray-400 text-md font-medium'>
                {
                    navigations.map(({id, name, icon, url}) => {
                        return(
                            <Link to={url} key={id} className='flex cursor-pointer hover:text-[#F00F51]'><span className='mr-4'>{icon}</span>{name}</Link>
                        )
                    })
                }
            </div>
            <div className='h-[15%] pt-10 text-gray-400 text-md font-medium'>
                <div className='ml-12 cursor-pointer flex hover:text-[#F00F51]' onClick={() => {
                   localStorage.clear();
                   navigate('/account/signin') 
                }}><span className='mr-4'><AiOutlineLogout/></span>Log out</div>
            </div>
        </div>
        <div className='w-[60%] overflow-scroll h-full scrollbar-hide'>
            <div className='bg-white h-[75px] border-l border-r flex justify-evenly items-center pt-4 sticky top-0 shadow-lg '>
                <div className='flex justify-center items-center'>
                    <Input placeholder='Enter your search' className='w-[400px] rounded-full' />
                    <Button icon={<AiOutlineSearch/>} className='mb-4 ml-4 bg-[#F00F51] hover:bg-[#de0d4c] rounded-full' />
                </div>
                <Button icon={<AiOutlinePlus/>} label='Create new post' className='rounded-full bg-[#F00F51] hover:bg-[#de0d4c] mb-4' onClick={()=> navigate('/new-post')} />
            </div>
            {
                loading ?
                <div className='flex justify-center items-center h-[90%]'>
                <GridLoader/>
                </div>
                :
                data?.map(({_id = '', caption = '', description = '', image = '', user = {}, likes = []}, index) => {
                    const isAlreadyLiked = likes.length > 0 && likes.includes(loggedInUserId);
                    return(
                        <div className='bg-white w-[80%] mx-auto mt-24 p-8'>
                <div className='border-b flex items-center pb-4 mb-4 cursor-pointer' onClick={() => username === user.username ? navigate('/profile') : navigate(`/user/${user?.username}`)}>
                <img src={Avatar}  width='50px' height='50px' />
                    <div className='ml-4'>
                        <h3 className='text-lg leading-none font-semibold'>{user.username}</h3>
                        <p className='text-sm font-light'>{user.email}</p>
                    </div>
                </div>
                <div className='border-b pb-4 mb-4'>
                    <div className='h-[400px] flex justify-center items-center bg-gray-100'>
                    <img loading='lazy' src={postImg} className='rounded-xl max-h-full' />
                    </div>
                    <div className='flex mt-4 mb-2 pb-2 border-b'>
                        <h4 className='mr-4 font-bold'>{user.email}: </h4>
                        <p className='font-medium'>{caption}</p>
                    </div>
                    <p className='mb-4 text-sm font-normal'>{description}</p>
                </div>
                <div className='flex justify-evenly text-black text-sm font-medium'>
                    <div className='flex cursor-pointer items-center' onClick={() => isAlreadyLiked ? handleReaction(_id, index, 'unlike') : handleReaction(_id, index, 'like')}><span className='mr-2'><AiOutlineHeart fill={isAlreadyLiked ? 'red' : 'white'} color={isAlreadyLiked ? 'red' : 'black'}/></span>{likes?.length} Likes</div>
                    <div className='flex cursor-pointer items-center'><span className='mr-2'><AiOutlineComment/></span>10.5k Comments</div>
                    <div className='flex cursor-pointer items-center'><span className='mr-2'><AiOutlineShareAlt/></span>10.5k Shares</div>
                    <div className='flex cursor-pointer items-center'><span className='mr-2'><BsSave/></span>10 Saved</div>
                </div>
            </div>
                    )
                })
            }
            
        </div>
        <div className='w-[20%] bg-white flex flex-col items-center'>
            <div className='w-[300px] mt-8'>
                <h3 className='text-lg font-semibold mb-4'>Trending Feeds</h3>
                <div className='bg-[#F00F51] h-[300px]'></div>
            </div>
            <div className='w-[300px] mt-8'>
                <h3 className='text-lg font-semibold mb-4'>Suggestions for you</h3>
                <div className='bg-blue-300 h-[300px]'></div>
            </div>
            <div className='w-[300px] mt-8'>
                <h3 className='text-lg font-semibold mb-4'>Active followers</h3>
                <div className='bg-[#F00F51] h-[150px]'></div>
            </div>
        </div>
    </div>
  )
}

export default Home