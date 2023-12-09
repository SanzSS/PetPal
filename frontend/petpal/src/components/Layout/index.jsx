import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return <body className="min-h-screen bg-blue1 flex flex-col">
        <div className="flex-1">
            <header>
                {/* Navigation Bar */}
                <nav className="hidden sm:flex sm:bg-blue3 sm:h-[70px] sm:text-white sm:justify-between sm:items-center sm:px-16">
                    <Link to="/search"><h1 className="text-4xl text-white font-extrabold">PetPal</h1></Link>
                    <div className="flex justify-evenly items-center">
                        <Link to="/search" className="header-item p-4">Search</Link>
                        <Link to="/create_listing" className="header-item p-4">Create a Pet</Link>
                        <Link to="/notifications" className="header-item p-4">Notifications</Link>
                        {/* Dropdown Menu */}
                        <details>
                            <summary className="cursor-pointer header-item p-4">Menu</summary>
                            <ul className="absolute text-black bg-white w-auto rounded-md p-2 flex flex-col items-center border border-blue3 mt-1 ml-[-22px]">
                                <li><Link to="/my_profile" className="dropdown-menu-item">My Account</Link></li>
                                <li><a href="../shelter/shelter-listings.html" className="dropdown-menu-item">My Pets</a></li>
                                <li><a href="/logout" className="dropdown-menu-item">Log Out</a></li>
                            </ul>
                        </details>
                    </div>
                </nav>
                {/* Mobile Navigation Bar */}
                <nav className="sm:hidden flex flex-col bg-blue3 w-screen pb-4">
                    <Link to="/search" className="self-center pt-2"><h1 className="text-4xl text-white font-extrabold">PetPal</h1></Link>
                    <details className="relative top-[-48px] right-4">
                        <summary className="absolute top-4 right-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list text-white cursor-pointer" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </summary>
                        <div className="mt-[64px] flex flex-col">
                            <Link to="/search" className="text-white bg-blue3 pl-8 py-2 header-item">Search</Link>
                            <Link to="/create_listing" className="text-white bg-blue3 pl-8 py-2 header-item">Create a Pet</Link>
                            <Link to="/my_profile" className="text-white bg-blue3 pl-8 py-2 header-item">My Account</Link>
                            <a href="../shelter/shelter-listings.html" className="text-white bg-blue3 pl-8 py-2 header-item">My Pets</a>
                            <a href="../general/notifications_shelter.html" className="text-white bg-blue3 pl-8 py-2 header-item">Notifications</a>
                            <Link to="/logout" className="text-white bg-blue3 pl-8 py-2 mb-[-48px] header-item">Log Out</Link>
                        </div>
                    </details>
                </nav>
            </header>
            <Outlet />
        </div>
        <footer className="flex w-full bg-blue3 text-white h-[3rem] justify-center items-center">
            <p className="text-center">Copyright 2023 by Victor Yao, Dian Rong, Angela Zhuo and Sanzhar Shamshiyev.</p>
        </footer>
    </body>
}

export default Layout;