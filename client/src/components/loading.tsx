import React from 'react'

const Loading = () => {
    return (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden'>
            <div className='flex flex-col items-center justify-center gap-8 relative z-10'>
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
                        <div className="w-full h-full border-4 border-transparent border-t-[#494bd6] rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
                    </div>

                    <div className="absolute top-2 left-2 w-20 h-20 border-4 border-gray-100 dark:border-gray-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
                        <div className="w-full h-full border-4 border-transparent border-t-[#e7234a] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}

export default Loading