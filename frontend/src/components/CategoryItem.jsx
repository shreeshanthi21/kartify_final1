import { Link } from "react-router-dom";
import StoreMap from './StoreMap';

const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden rounded-lg group bg-white shadow-lg'>
			<Link to={"/category" + category.href}>
				<div className='cursor-pointer'>
					<div className='relative h-64 overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
						<img
							src={category.imageUrl}
							alt={category.name}
							className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
							loading='lazy'
						/>
						<div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
							<h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3>
							<p className='text-gray-200 text-sm'>Explore {category.name}</p>
						</div>
					</div>
					
					<div className='p-4 bg-white'>
						<div className='flex items-center gap-2 text-gray-600 mb-2'>
							<span className='text-lg'>📍</span>
							<span>Located in Aisle {category.aisle || 'A1'}</span>
						</div>
						
						<div className='mt-2'>
							<p className='text-sm text-gray-500 mb-2'>Find this category here:</p>
							<StoreMap activeAisle={category.aisle || 'A1'} size="small" />
						</div>
						
						<div className='mt-4 text-sm text-gray-600'>
							<div className='flex items-start gap-2'>
								<span className='text-lg mt-1'>🚶</span>
								<p>{category.navigation || 'Main Entrance → Turn right → Aisle A1'}</p>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;