import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setSearchData } from "../redux/userSlice";
import dp from "../assets/dp.png";

function Search() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");

  const { searchData } = useSelector((state) => state.user);

  const handleSearch = async () => {
    try {
      if (!input.trim()) {
        dispatch(setSearchData([]));
        return;
      }

      const result = await axios.get(
        `${serverUrl}/api/user/search?keyWord=${input}`,
        { withCredentials: true }
      );

      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [input]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center gap-5">

      <div className="w-full h-20 flex items-center gap-5 px-5">
        <IoMdArrowRoundBack
          className="w-6 h-6 text-white cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="w-full flex justify-center">
        <form
          className="w-[90%] max-w-[800px] h-14 rounded-full px-5 bg-gray-900 flex items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <IoSearch className="w-5 h-5 text-white" />

          <input
            type="text"
            placeholder="Search users..."
            className="w-full h-full outline-none bg-transparent px-5 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </div>

      {/* Search Results */}
      <div className="w-[90%] max-w-[800px] flex flex-col gap-3">

        {searchData?.length > 0 ? (
          searchData.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 bg-white rounded-full cursor-pointer hover:bg-gray-300"
              onClick={() => navigate(`/profile/${user?.userName}`)}
            >
              <img
                src={user?.profileImage || dp}
                alt={user?.userName}
                className="w-12 h-12 rounded-full object-cover border-2 border border-black"
              />

              <div>
                <h2 className="text-black font-semibold">
                  {user?.userName}
                </h2>

                <p className="text-gray-800 text-sm">
                  {user.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          input && (
            <p className="text-gray-400 text-center mt-5">
              No users found
            </p>
          )
        )}

      </div>
    </div>
  );
}

export default Search;