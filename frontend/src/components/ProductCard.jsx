import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
	return (
		<motion.div
			className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='overflow-hidden'>
				<img
					src={product.image}
					alt={product.name}
					className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
				/>
			</div>
			<div className='p-4'>
				<h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
				<p className='text-emerald-300 font-medium mb-4'>₹{product.price.toFixed(2)}</p>
				<p className='text-sm text-gray-300 mb-4'>{product.description}</p>
				<div className='flex justify-between items-center'>
					<p className='text-sm text-gray-400'>
						<span className={product.countInStock > 0 ? 'text-emerald-400' : 'text-red-400'}>
							{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
						</span>
					</p>
					<div className='bg-gray-700 px-3 py-1 rounded-full'>
						<span className='text-sm text-gray-300'>Qty: </span>
						<span className='text-sm font-medium text-emerald-400'>{product.countInStock}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default ProductCard;