import React, { useState } from 'react'
import { Input } from './Input'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

const CreateResumeForm = ({ onSuccess }) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleCreateResume = async (e) => {
        e.preventDefault()
        if (!title) {
            setError("Please enter resume title")
            return
        }
        setError("")
        
        try {
            // Create resume using API
            const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, { title });
            
            // Call onSuccess if provided
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess();
            }
            
            // Navigate to the edit page with the resume ID from API response
            navigate(`/edit-resume/${response.data._id}`);
        } catch (error) {
            console.error('Error creating resume:', error);
            setError('Something went wrong. Please try again later')
        }
    }

    return (
        <div>
            <form onSubmit={handleCreateResume}>
                <Input
                    label="Resume Title"
                    placeholder="Enter Resume Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={error}
                />
                <button className='bg-violet-600 text-white px-4 py-2 rounded-lg w-full mt-4'>Create Resume</button>
            </form>
        </div>
    )
}

export default CreateResumeForm
