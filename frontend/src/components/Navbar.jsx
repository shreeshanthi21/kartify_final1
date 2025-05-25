import { UserPlus, LogIn, LogOut, Lock, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
						Kartify
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300
						ease-in-out'
						>
							Home
						</Link>
						<Link
							to={"/supermarket-map"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300
						ease-in-out flex items-center'
						>
							<Map className='inline-block mr-1' size={20} />
							<span className='hidden sm:inline'>Map</span>
						</Link>
						{user && (
							<Link
								to={"/bill-scanner"}
								className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
							>
								<span className='inline-block mr-1'>🧾</span>
								<span className='hidden sm:inline'>Grocery Billing</span>
							</Link>
						)}
						{!user && (
							<>
								<Link
									to='/signup'
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
								>
									<UserPlus className='inline-block mr-1' size={20} />
									<span className='hidden sm:inline'>Sign Up</span>
								</Link>
								<Link
									to='/login'
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
								>
									<LogIn className='inline-block mr-1' size={20} />
									<span className='hidden sm:inline'>Login</span>
								</Link>
							</>
						)}
						{user && (
							<>
								{isAdmin && (
									<Link
										to='/secret-dashboard'
										className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
									>
										<Lock className='inline-block mr-1' size={20} />
										<span className='hidden sm:inline'>Admin</span>
									</Link>
								)}
								<button
									onClick={logout}
									className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
								>
									<LogOut className='inline-block mr-1' size={20} />
									<span className='hidden sm:inline'>Logout</span>
								</button>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;