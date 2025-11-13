import React from 'react'

const Progress = ({ progress = 0, total = 5, color, bgcolor }) => {
    return (
        <div className='flex gap-1.5'>
            {[...Array(total)].map((_, index) => (
                <div key={index}
                    className={`w-2 h-2 rounded transition-all
                        ${index < progress ? "bg-cyan-500" : "bg-cyan-100"}`}
                    style={{
                        backgroundColor:
                            index < progress ?
                                color || "rgba(1,1,1,1)" :
                                bgcolor || "rgba(1,1,1,0.1)"
                    }}>

                </div>
            ))}
        </div>
    )
}

export default Progress
