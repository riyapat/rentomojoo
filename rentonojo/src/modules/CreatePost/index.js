import React, { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
    const [data, setData] = useState({
        caption: '',
        desc: '',
        img: ''
    })
    const [url, setUrl] = useState('')
    const navigate = useNavigate()

    const uploadImage = async() => {
        const formData = new FormData();
        formData.append('file', data.img);
        formData.append('upload_preset', 'insta-clone');
        formData.append('cloud_name', 'dqogewdnp')

        const res = await fetch(`https://api.cloudinary.com/v1_1/dqogewdnp/upload`, {
            method: 'POST',
            body: formData
        })
        if(res.status === 200){
            return await res.json()
        }else{
            return "Error"
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { secure_url } = await uploadImage()
        setUrl(secure_url);
        
        const response = await fetch('http://localhost:8000/api/new-post', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${localStorage.getItem('user:token')}`
            },
            body: JSON.stringify({
                caption: data.caption,
                desc: data.desc,
                url: secure_url,
            })
        });
        if(response.status === 200){
            navigate('/')
        }else{
            console.log('Error');
        }

    }

  return (
    <div className='flex justify-center items-center h-screen'>
        <div className=' w-[800px] h-[600px] p-6'>
            <form onSubmit={(e) => handleSubmit(e)}>
            <Input placeholder='Caption ...' name='title' className='py-4' value={data.caption} onChange={(e) => setData({ ...data, caption: e.target.value })} isRequired={true} />
            <textarea rows={10} className='w-full border shadow p-4 resize-none' placeholder='Description' value={data.desc} onChange={(e) => setData({ ...data, desc: e.target.value })} required />
            <Input type='file' name='image' className='py-4 hidden' onChange={(e) => setData({ ...data, img: e.target.files[0] })} isRequired={false} />
            <label htmlFor='image' className='cursor-pointer p-4 border shadow w-full' >{data?.img?.name || 'Upload image'}</label>
            <Button label='Create post' type='submit' className='bg-[#F00F51] hover:bg-[#d20d48] mt-6' />
            </form>
        </div>
    </div>
  )
}

export default CreatePost