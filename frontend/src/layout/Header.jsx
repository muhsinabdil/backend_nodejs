import React from "react";
import { TbBasket } from "react-icons/tb";

const Header = () => {
  const menuItems = [
    {
      name: "Profil",
      url: "/profile",
    },
    {
      name: "Admin",
      url: "/admin",
    },
    {
      name: "Logout",
      url: "/logout",
    },
  ];
  return (
    <div className="bg-red-500 h-16 px-2 flex items-center justify-between">
      <div className="text-5xl">Muhsin Abdil</div>

      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <input
            className="p-2 outline-none rounded-lg"
            type="text"
            placeholder="arama yap"
          />
          <div className="p-2 ml-1 bg-white rounded-lg cursor-pointer text-green-600">
            Ara
          </div>
        </div>
        <div className="relative">
          <img src="https://www.svgrepo.com/logo.svg" alt="" />
          <div className="absolute">
            {menuItems.map((item, i) => (
              <div key={i}>{item.name}</div>
            ))}
          </div>
        </div>
        <div className="relative">
          <TbBasket />
          <div className="absolute">4</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
