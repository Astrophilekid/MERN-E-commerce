import axios from 'axios'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { motion } from 'framer-motion'

import { Link, useNavigate } from 'react-router-dom'

const AdminProfilePage = () => {
  const [user, setUser] = useState({})
  const [userList, setUserList] = useState([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [newAdmin, setNewAdmin] = useState([])
  const navigate = useNavigate()

  const getProfile = async () => {
    setProfileLoading(true)
    try {
      const { data } = await axios.get('/admin/profile')
      if (data.success) {
        setProfileLoading(false)

        setUser(data.user)
      } else {
        setProfileLoading(false)
        alert('User profile fetch failed')
      }
    } catch (error) {
      setProfileLoading(false)
      console.error('User profile error' + error)
    }
  }

  const handleSearch = async () => {
    setHasSearched(true)

    try {
      const { data } = await axios.get(`/admin/search-user?query=${search}`)
      if (data.success) {
        console.log(data)
        setNewAdmin(data.users)
      } else {
        setNewAdmin((prev) => {
          return [...prev]
        })
      }
    } catch (error) {
      console.error('Failed to search users:', error)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    setHasSearched(false)
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `/admin/search-suggestion/?searchTerm=${search}`
        )
        // console.log(data)
        setUserList(data.suggestions)
      } catch (error) {
        console.error('Could not fetch products:', error)
      }
    }

    if (search) {
      fetchUser()
    }
  }, [search])

  return (
    <>
      <div className="text-2xl sm:text-3xl font-semibold h-14  rounded-sm w-full border-b flex items-center  text-slate-800 mb-5 pl-5">
        <button
          className="bg-slate-700 hover:bg-slate-900 mb-1 items-center  flex mt-2 rounded-full text-white text-lg text-center mr-3 transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => navigate(-1)}
        >
          <img src="/go back.png" alt="go back" className="h-6" />
        </button>
        Admin Profile
      </div>
      <div className="w-full h-full flex max-md:flex-col gap-10 items-center justify-center pb-10 px-5">
        {/* profile */}
        <div className="w-9/12  sm:w-3/5 md:w-6/12 lg:w-4/12  h-80 r p-5 flex flex-col bg-violet-100 rounded-md">
          {profileLoading ? (
            <div className="w-full h-full flex justify-center items-center gap-y-4 font-medium ">
              <CircularProgress style={{ scale: '1.5' }} />
            </div>
          ) : (
            <div className="w-full b h-full flex pl-7  flex-col gap-y-4 font-medium ">
              <div className="w-full flex justify-between border-b mb-1">
                <h1 className="text-2xl lg:text-3xl font-semibold  mb-3">
                  Profile
                </h1>
                <button className="h-8 bg-gray-500 transition-all hover:bg-accent p-1 rounded-xl active:scale-95">
                  <img
                    src="/edit.png"
                    className="object-contain max-h-full max-w-full"
                    alt="edit"
                  />
                </button>
              </div>
              <div className="flex h-16 items-center justify-start gap-x-10">
                <img
                  src={user?.image}
                  alt="user profile pic"
                  className="object-contain rounded-full max-h-full"
                />
                <p className="text-xl lg:text-2xl font-semibold">
                  {user?.name}
                </p>
              </div>
              <div className="flex gap-x-10">
                email &nbsp; <p>: &nbsp; {user?.email}</p>
              </div>
              <div className="flex gap-x-7">
                mobile &nbsp; <p>: &nbsp; {user?.mobile}</p>
              </div>
              <div className="flex gap-x-2">
                created at &nbsp;
                <p>: &nbsp; {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm self-end text-blue-500"
              >
                reset password?
              </Link>
            </div>
          )}
        </div>
        <div className="md:self-start flex flex-col w-96 ">
          <p className="text-2xl font-medium mb-5">Add New admin?</p>
          <div className="flex items-center   focus:border-2 rounded-md  justify-center  ">
            <input
              type="text"
              value={search}
              className="placeholder:text-base "
              placeholder="enter email..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              className="h-10 -ml-1 rounded-tr-xl rounded-br-xl  flex w-16 justify-center items-center  z-[1] border   outline-secondary border-slate-400 bg-slate-200 hover:bg-slate-300 transition-all"
              onClick={handleSearch}
            >
              <img
                whileTap={{ scale: 0.95 }}
                src="../../assets/icons/search.png"
                alt="search"
                className="w-7 cursor-pointer active:scale-90 transition-all"
              />
            </div>
          </div>

          {/* search results */}
          {search.length > 0 && !hasSearched && (
            <div className="relative w-full ">
              <div className="cursor-pointer top-16 z-50 w-full border shadow-md bg-purple-100 p-1 h-fit rounded-lg ">
                {userList.length > 0 ? (
                  userList.map((value, i) => (
                    <p
                      key={i}
                      onClick={() => {
                        setSearch(value.email)
                        setHasSearched(true)
                      }}
                      className=" p-1 border-b rounded-lg hover:bg-purple-300 hover:font-medium  my-1 "
                    >
                      {value.email}
                    </p>
                  ))
                ) : (
                  <p className=" p-1 border-b rounded-lg  font-medium italic hover:font-medium my-1 ">
                    {`No user found "`}
                  </p>
                )}
              </div>
            </div>
          )}

          {newAdmin.length > 0 &&
            newAdmin.map((user, i) => (
              <div
                key={i}
                className="flex justify-between mt-3 bg-slate-100 rounded-xl p-1 "
              >
                <div className="flex flex-col">
                  <div>{user.email}</div>
                  <div>{user.name}</div>
                </div>
                <button>{user.isAdmin ? 'remove admin' : 'make  admin'}</button>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
export default AdminProfilePage
