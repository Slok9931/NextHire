"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Briefcase, Home, Info, LogOut, Menu, User, User2, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ModeToggle } from './modeToggle'
import { useAppData } from '@/context/AppContext'

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const {isAuth, setIsAuth, user, setUser, loading, logoutUser} = useAppData();

    const logoutHandler = async () => {
        await logoutUser();
    }

  return (
      <nav className='z-50 sticky top-0 bg-background/80 border-b backdrop-blur-md shadow-sm'>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                  
                  <div className="flex items-center">
                      <Link href={'/'} className='flex items-center gap-1 group'>
                          <div className="text-2xl font-bold font-mono tracking-tight">
                              <span className="text-[#494bd6]">Next</span>
                              <span className="text-[#e7234a]">Hire</span>
                          </div>
                      </Link>
                  </div>

                  <div className="hidden md:flex items-center space-x-1">
                      <Link href='/'>
                        <Button variant='ghost' className='flex items-center gap-2 font-medium cursor-pointer'><Home size={16} /> Home</Button>
                      </Link>
                      <Link href='/jobs'>
                          <Button variant='ghost' className='flex items-center gap-2 font-medium cursor-pointer'><Briefcase size={16} /> Jobs</Button>
                      </Link>
                      <Link href='/about'>
                          <Button variant='ghost' className='flex items-center gap-2 font-medium cursor-pointer'><Info size={16} /> About</Button>
                      </Link>
                  </div>

                  <div className="hidden md:flex items-center gap-3">
                      {loading ? null : <>
                          {isAuth ? (
                              <Popover>
                                  <PopoverTrigger asChild>
                                      <button className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                                          <Avatar className='h-9 w-9 ring-2 ring-offset-2 ring-offset-background ring-[#010092]/20 cursor-pointer hover:ring-[#010092]/40 transition-all'>
                                              <AvatarImage src={user ? user.profile_pic as string : ''} alt={user?.name} />
                                              <AvatarFallback className='bg-[#dcdcf3] dark:bg-[#010092] text-[#494bd6]'>{user ? user.name.charAt(0) : <User2 />}</AvatarFallback>
                                          </Avatar>
                                      </button>
                                  </PopoverTrigger>
                                  <PopoverContent className='w-56 p-2' align='end'>
                                      <div className="px-3 py-2 mb-2 border-b">
                                          <p className="text-sm font-semibold">{user?.name}</p>
                                          <p className="text-xs opacity-60 truncate">{user?.email}</p>
                                      </div>
                                      <Link href='/account'>
                                          <Button className='w-full justify-start gap-2 cursor-pointer' variant={'ghost'}><User size={16} />My Profile</Button>
                                      </Link>
                                      <Button onClick={logoutHandler} className='w-full justify-start gap-2 cursor-pointer mt-1' variant={'destructive'}><LogOut size={16} /> Logout
                                      </Button>
                                  </PopoverContent>
                              </Popover>
                          ) : (
                              <Link href='/login'>
                                  <Button className='gap-2 cursor-pointer'><User size={16} /> Sign In</Button>
                              </Link>
                          )}
                      </>}
                      <ModeToggle />
                  </div>

                  <div className="md:hidden flex items-center gap-3">
                      <ModeToggle />
                      <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label='Toggle Menu'>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
                  </div>
              </div>
          </div>

          <div className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="px-3 py-3 space-x-1 space-y-1 bg-background/95 backdrop-blur-md">
                  {/*  isAuth or user */}
                  <Link href='/' onClick={toggleMenu}>
                      <Button variant='ghost' className='w-full justify-start gap-3 h-11'><Home size={18} /> Home</Button>
                  </Link>
                  <Link href='/jobs' onClick={toggleMenu}>
                      <Button variant='ghost' className='w-full justify-start gap-3 h-11'><Briefcase size={18} /> Jobs</Button>
                  </Link>
                  <Link href='/about' onClick={toggleMenu}>
                      <Button variant='ghost' className='w-full justify-start gap-3 h-11'><Info size={18} /> About</Button>
                  </Link>

                  {isAuth ? (
                      <>
                          <Link href='/account' onClick={toggleMenu}>
                              <Button className='w-full justify-start gap-3 h-11' variant={'ghost'}><User size={18} /> My Profile</Button>
                          </Link>
                          <Button onClick={() => { logoutHandler(); toggleMenu(); }} className='w-full justify-start gap-3 h-11' variant={'destructive'}><LogOut size={18} /> Logout</Button>
                      </>
                  ) : (
                      <Link href='/login' onClick={toggleMenu}>
                          <Button className='w-full justify-start gap-3 h-11 mt-2'><User size={18} /> Sign In</Button>
                      </Link>
                  )}
              </div>
          </div>
    </nav>
  )
}

export default Navbar
