import { PlusCircle, ShoppingBasket, FileText, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import CashierView from "../components/CashierView";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "cashier", label: "User Bill", icon: FileText },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { products, loading, fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader className="w-8 h-8 animate-spin text-emerald-500" />
			</div>
		);
	}

	return (
		<div className="min-h-screen relative overflow-hidden">
			<div className="relative z-10 container mx-auto px-4 py-16">
				<motion.h1
					className="text-4xl font-bold mb-8 text-emerald-400 text-center"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				{/* Tabs */}
				<div className="flex flex-wrap justify-center gap-4 mb-8">
					{tabs.map((tab) => (
						<motion.button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-800 text-gray-300 hover:bg-gray-700"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<tab.icon className="w-5 h-5" />
							{tab.label}
						</motion.button>
					))}
				</div>

				{/* Tab Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{activeTab === "create" && <CreateProductForm />}
					{activeTab === "products" && <ProductsList />}
					{activeTab === "cashier" && <CashierView />}
				</motion.div>
			</div>
		</div>
	);
};

export default AdminPage;