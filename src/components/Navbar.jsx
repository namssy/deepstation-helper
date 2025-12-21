import React from 'react';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">DeepStation Helper</h1>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={onLogout}
                            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
