import React, { useEffect } from "react";
import { collection } from "@/config/images";
import Image from "next/image";
import NavBarItem from "../NavBarItem";
import { useDispatch, useSelector } from "react-redux";
import { logoutWallet, walletConect } from "@/reducer/transactionSlice";



const header = () => {
  const dispatch =useDispatch<appDispatch>();
  const {currentAccount} =useSelector((state:RootState)=>state.transactions);

  const handleClick = () => {
    if (currentAccount) {
      dispatch(logoutWallet());
    } else {
      dispatch(walletConect());
    }
  };
  useEffect(()=>{},[handleClick])
  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 bg-black h-36">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Image src={collection} alt="logo" width={120} height={90} />
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
      
        ))}
        
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]" onClick={()=>handleClick() }>
        {currentAccount ? "Log Out" :"Login" } 
        </li>
      </ul>
      
    </nav>
  );
};

export default header;