const Search = () => {
    return <>
        <main class="flex flex-col items-center pb-16">
            <h1 class="text-6xl my-12 text-blue3 font-extrabold">Search</h1>
            <div class="grid lg:grid-cols-[15%_85%] gap-2 sm:w-3/4 w-10/12">
                {/* Filter Column */}
                <form class="hidden lg:flex lg:flex-col lg:justify-start lg:pt-[120px]">
                    <p class="mb-2">Filter By:</p>
                    <div class="filter-div">
                        <label for="filter-by-species">Species</label>
                        <select id="filter-by-species" name="species" class="filter-menu">
                            <option value=""></option>
                            <option value="dog">Dogs</option>
                            <option value="cat">Cats</option>
                            <option value="hamster">Hamsters</option>
                            <option value="turtle">Turtles</option>
                        </select>
                    </div>
                    <div class="filter-div">
                        <label for="filter-by-breed">Breed</label>
                        <select id="filter-by-breed" name="breed" class="filter-menu">
                            <option value=""></option>
                            <option value="husky">Husky</option>
                            <option value="bordercollie">Border Collie</option>
                            <option value="germanshepard">German Shepard</option>
                            <option value="chihuahua">Chihuahua</option>
                        </select>
                    </div>
                    <div class="filter-div">
                        <label for="filter-by-age">Age</label>
                        <select id="filter-by-age" name="age" class="filter-menu">
                            <option value=""></option>
                            <option value="puppy">Puppy (0-11 months)</option>
                            <option value="young">Young (1-3 years)</option>
                            <option value="adult">Adult (4-11 years)</option>
                            <option value="senior">Senior (12+ years)</option>
                        </select>
                    </div>
                    <div class="filter-div">
                        <label for="filter-by-gender">Gender</label>
                        <select id="filter-by-gender" name="gender" class="filter-menu">
                            <option value=""></option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div class="filter-div">
                        <label for="filter-by-size">Size</label>
                        <select id="filter-by-size" name="size" class="filter-menu">
                            <option value=""></option>
                            <option value="0-20">0-20 lbs</option>
                            <option value="21-40">21-40 lbs</option>
                            <option value="41-60">41-60 lbs</option>
                            <option value="61+">61+ lbs</option>
                        </select>
                    </div>
                    <input onclick="location.href='../search/search-seeker-filtered.html';" type="button" value="Save Filters" class="button mt-2 cursor-pointer" />
                </form>
                {/* Search Column */}
                <div class="h-full w-full gap-4">
                    {/* Search */}
                    <form class="col-span-2 lg:p-4">
                        <div class="flex justify-between">
                            <input type="text" placeholder="Search pets" class="h-16 md:w-[83%] w-[75%] text-2xl p-4 rounded-xl shadow-md" />
                            <a href="" class="text-center md:w-[15%] w-[22%] bg-blue3 text-white font-extrabold text-2xl flex justify-center items-center rounded-xl shadow-md hover:text-blue3 hover:bg-white hover:border-2 hover:border-black">
                                Search
                            </a>
                        </div>
                        <div class="block sm:mt-2 mt-4">
                            <label for="sort">Sort By:</label>
                            <select id="sort" name="sort-by" class="rounded shadow-md">
                                <option value=""></option>
                                <option value="">Breed A to Z</option>
                                <option value="">Breed Z to A</option>
                                <option value="">Age</option>
                                <option value="">Recent Listing</option>
                                <option value="">Oldest Listing</option>
                            </select>
                            <a href="../search/search-seeker-sorted.html" class="button cursor-pointer px-1 ml-1">Save</a>
                        </div>
                    </form>
                    {/* Mobile Filter By Dropdown */}
                    <details class="pt-4 lg:hidden">
                        <summary class="mb-2 text-white bg-blue3 font-bold rounded p-2 shadow-md inline-block cursor-pointer hover:text-blue3 hover:bg-white hover:border-2 hover:border-black border-2 border-blue3">Filter By:</summary>
                        <form class="flex flex-col justify-start lg:hidden">
                            <div class="filter-div">
                                <label for="filter-by-species">Species</label>
                                <select id="filter-by-species" name="species" class="filter-menu">
                                    <option value=""></option>
                                    <option value="dog">Dogs</option>
                                    <option value="cat">Cats</option>
                                    <option value="hamster">Hamsters</option>
                                    <option value="turtle">Turtles</option>
                                </select>
                            </div>
                            <div class="filter-div">
                                <label for="filter-by-breed">Breed</label>
                                <select id="filter-by-breed" name="breed" class="filter-menu">
                                    <option value=""></option>
                                    <option value="husky">Husky</option>
                                    <option value="bordercollie">Border Collie</option>
                                    <option value="germanshepard">German Shepard</option>
                                    <option value="chihuahua">Chihuahua</option>
                                </select>
                            </div>
                            <div class="filter-div">
                                <label for="filter-by-age">Age</label>
                                <select id="filter-by-age" name="age" class="filter-menu">
                                    <option value=""></option>
                                    <option value="puppy">Puppy (0-11 months)</option>
                                    <option value="young">Young (1-3 years)</option>
                                    <option value="adult">Adult (4-11 years)</option>
                                    <option value="senior">Senior (12+ years)</option>
                                </select>
                            </div>
                            <div class="filter-div">
                                <label for="filter-by-gender">Gender</label>
                                <select id="filter-by-gender" name="gender" class="filter-menu">
                                    <option value=""></option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div class="filter-div">
                                <label for="filter-by-size">Size</label>
                                <select id="filter-by-size" name="size" class="filter-menu">
                                    <option value=""></option>
                                    <option value="0-20">0-20 lbs</option>
                                    <option value="21-40">21-40 lbs</option>
                                    <option value="41-60">41-60 lbs</option>
                                    <option value="61+">61+ lbs</option>
                                </select>
                            </div>
                            <input onclick="location.href='search-seeker-filtered.html';" type="button" value="Save Filters" class="button mb-4 cursor-pointer" />
                        </form>
                    </details>
                    {/* Cards */}
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:p-2">
                    {/*
                    {listings.map((listing) => (
                        <ListingCard listing={listing} />
                    ))}
                    */}    
                    </div>
                    <div class="text-center flex justify-center mt-4">
                        <a href="" class="inline button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold">&lt;</a>
                        <p class="inline text-white bg-blue3 font-bold rounded h-8 shadow-md px-2 py-1 mx-2">Page 1</p>
                        <a href="" class="inline button px-2 py-1 border-2 border-blue3 hover:text-blue3 font-extrabold">&gt;</a>
                    </div>
                </div>
            </div>
        </main>
    </>
}

export default Search