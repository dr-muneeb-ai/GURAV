import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const {
    setShowSearch,
    getCartItems,
    navigate,
    token,
    setToken,
    setCartItems,
    user,
    products,
  } = useContext(ShopContext);

  // Derived from live product data so the dropdown always matches what's
  // actually in the shop (falls back to the standard set while products
  // are still loading, so the menu never looks empty on first paint).
  const categories =
    products && products.length > 0
      ? [...new Set(products.map((p) => p.category).filter(Boolean))]
      : ["Watches", "Sneakers", "Hoodies", "Accessories"];

  const subCategories =
    products && products.length > 0
      ? [...new Set(products.map((p) => p.subCategory).filter(Boolean))]
      : [];

  const goToCategory = (category) => {
    setVisible(false);
    navigate(`/collection?category=${encodeURIComponent(category)}`);
  };

  const goToSubCategory = (subCategory) => {
    setVisible(false);
    navigate(`/collection?subCategory=${encodeURIComponent(subCategory)}`);
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCartItems({});
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={assets.logo}
              className="w-28 sm:w-34 object-contain"
              alt="Logo"
            />
          </Link>

          {/* Desktop Navigation */}
         <ul className="hidden sm:flex items-center gap-3 text-base">

            <NavLink
              to="/"
              style={{ fontFamily: "Prata, serif" }}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`
              }
            >
              Home
            </NavLink>

            {/* SHOP - dropdown on hover (desktop) */}
            <li className="relative group list-none">
              <NavLink
                to="/collection"
                style={{ fontFamily: "Prata, serif" }}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full transition-all duration-300 inline-block ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Dropdown panel */}
              <div
                className="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  pt-4
                  opacity-0
                  invisible
                  translate-y-2
                  group-hover:opacity-100
                  group-hover:visible
                  group-hover:translate-y-0
                  transition-all
                  duration-300
                  z-50
                "
              >
                <div
                  className="
                    w-[420px]
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-6
                    grid
                    grid-cols-2
                    gap-6
                  "
                >

                  {/* Categories */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[3px] text-[#b9572c] font-semibold mb-3">
                      Categories
                    </p>

                    <div className="flex flex-col gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => goToCategory(cat)}
                          className="text-left text-sm text-gray-700 hover:text-[#b9572c] transition-colors"
                          type="button"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub Categories */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[3px] text-[#b9572c] font-semibold mb-3">
                      Type
                    </p>

                    <div className="flex flex-col gap-2">
                      {subCategories.length > 0 ? (
                        subCategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => goToSubCategory(sub)}
                            className="text-left text-sm text-gray-700 hover:text-[#b9572c] transition-colors"
                            type="button"
                          >
                            {sub}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">—</p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 pt-3 border-t border-gray-100">
                    <Link
                      to="/collection"
                      className="text-xs uppercase tracking-[2px] text-black font-semibold hover:text-[#b9572c] transition-colors"
                    >
                      View All →
                    </Link>
                  </div>

                </div>
              </div>
            </li>

            {["About", "Contact", "Orders"].map((item, index) => (
              <NavLink
                to={`/${item.toLowerCase()}`}
      		key={index}
      		style={{ fontFamily: "Prata, serif" }}
      		className={({ isActive }) =>
      		   `px-4 py-1.5 rounded-full transition-all duration-300 ${
          		isActive
          		? "bg-black text-white shadow-md"
            		: "text-gray-600 hover:bg-gray-100 hover:text-black"
		}`
	      }
	    >
	      {item}
	    </NavLink>
	  ))}

	</ul>

          {/* Right Icons */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <Link to="/collection">
              <img
                onClick={() => setShowSearch(true)}
                src={assets.search_icon}
                className="w-5 cursor-pointer hover:scale-110 transition-transform"
                alt="Search"
              />
            </Link>

            {/* Profile */}
            <div className="group relative">
              {user?.profileImage ? (
                <img
                  onClick={() =>
                    navigate(token ? "/profile" : "/login")
                  }
                  src={user.profileImage}
                  className="w-7 h-7 rounded-full object-cover cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                  alt="Profile"
                />
              ) : (
                <img
                  onClick={() =>
                    navigate(token ? "/profile" : "/login")
                  }
                  src={assets.profile_icon}
                  className="w-5 cursor-pointer hover:scale-110 transition-transform"
                  alt="Profile"
                />
              )}

              {token && (
                <div className="group-hover:block hidden absolute right-0 pt-4">
                  <div className="flex flex-col gap-3 w-40 py-4 px-5 bg-white text-gray-600 rounded-lg shadow-xl border border-gray-100">
                    <p className="font-semibold text-black">
                      {user?.name || "User"}
                    </p>

                    <p
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer hover:text-black"
                    >
                      My Profile
                    </p>

                    <p
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer hover:text-black"
                    >
                      Orders
                    </p>

                    <p
                      onClick={logout}
                      className="cursor-pointer hover:text-black"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className="w-5 min-w-5 hover:scale-110 transition-transform"
                alt="Cart"
              />

              <p className="absolute right-[-7px] bottom-[-7px] w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[9px]">
                {getCartItems()}
              </p>
            </Link>

            {/* Mobile Menu */}
            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              className="w-5 cursor-pointer sm:hidden"
              alt="Menu"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white z-[60] transition-all duration-300 ${
          visible ? "w-72" : "w-0"
        } overflow-hidden shadow-2xl sm:hidden`}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-5 right-5 text-xl text-gray-700"
        >
          ✕
        </button>

        <ul className="flex flex-col gap-6 mt-20 px-8 text-gray-700 font-semibold overflow-y-auto max-h-[calc(100vh-100px)]">

          <NavLink
            to="/"
            onClick={() => setVisible(false)}
            className="py-3 border-b border-gray-200 hover:text-black"
          >
            Home
          </NavLink>

          {/* SHOP - expandable (mobile) */}
          <div className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setMobileShopOpen((prev) => !prev)}
              className="w-full flex items-center justify-between py-3 hover:text-black"
            >
              <span>Shop</span>
              <span
                className={`text-sm transition-transform duration-300 ${
                  mobileShopOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {mobileShopOpen && (
              <div className="pb-3 pl-3 flex flex-col gap-3">

                <p className="text-[10px] uppercase tracking-[2px] text-[#b9572c] font-semibold mt-1">
                  Categories
                </p>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => goToCategory(cat)}
                    className="text-left text-sm font-normal text-gray-600 hover:text-black"
                    type="button"
                  >
                    {cat}
                  </button>
                ))}

                {subCategories.length > 0 && (
                  <>
                    <p className="text-[10px] uppercase tracking-[2px] text-[#b9572c] font-semibold mt-2">
                      Type
                    </p>

                    {subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => goToSubCategory(sub)}
                        className="text-left text-sm font-normal text-gray-600 hover:text-black"
                        type="button"
                      >
                        {sub}
                      </button>
                    ))}
                  </>
                )}

                <NavLink
                  to="/collection"
                  onClick={() => setVisible(false)}
                  className="text-left text-sm font-semibold text-black mt-1"
                >
                  View All →
                </NavLink>

              </div>
            )}
          </div>

          {["About", "Contact", "Orders"].map((item, index) => (
            <NavLink
              to={`/${item.toLowerCase()}`}
              key={index}
              onClick={() => setVisible(false)}
              className="py-3 border-b border-gray-200 hover:text-black"
            >
              {item}
            </NavLink>
          ))}

          {token ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setVisible(false)}
                className="py-3 border-b border-gray-200 hover:text-black"
              >
                My Profile
              </NavLink>

              <p
                onClick={() => {
                  setVisible(false);
                  logout();
                }}
                className="py-3 border-b border-gray-200 hover:text-black cursor-pointer"
              >
                Logout
              </p>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setVisible(false)}
              className="py-3 border-b border-gray-200 hover:text-black"
            >
              Login
            </NavLink>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
