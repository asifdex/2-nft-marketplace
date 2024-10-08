import React from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import Input from "../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  CKifwalletIsConnected,
  sendTransaction,
  setFromData,
} from "@/reducer/transactionSlice";
import { walletSlice } from "@/utils/walletSlice";

const Hero = () => {
  const dispatch = useDispatch<appDispatch>();
  const { formData, isLoading, currentAccount ,transactionCount} = useSelector(
    (state: RootState) => state.transactions
  );
  const { addressTo, amount, keyword, message } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>,name:string) => {
    const value = e.target.value;
    console.log({...formData, [name]: value});
    dispatch(setFromData({ ...formData, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> ): void => {
    e.preventDefault();
    console.log("Form data before sending:", formData);

dispatch(sendTransaction());
    if (!addressTo || !amount || !keyword || !message) return;
    
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex gap-5 md:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world. Buy and sell cryptocurrencies easily on
            Krypto.
          </p>
          {!currentAccount && (
            <button
              type="button"
              onClick={()=> dispatch(CKifwalletIsConnected())}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className="rounded-tl-2xl commonstyle">Reliability</div>
            <div className="commonstyle">Security</div>
            <div className="sm:rounded-tr-2xl commonstyle">Ethereum</div>
            <div className="sm:rounded-bl-2xl commonstyle">Web 3.0</div>
            <div className="commonstyle">Low Fees</div>
            <div className="rounded-br-2xl commonstyle">Blockchain</div>
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                {currentAccount && (
                  <p className="text-white font-light text-sm">
                    {walletSlice(currentAccount)}
                  </p>
                )}
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
          <p className="text-lg text-white"> hi there {transactionCount}</p>
            <Input
              placeholder="Address To"
              name="addressTo"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Amount (ETH)"
              name="amount"
              type="number"
              handleChange={handleChange}
            />
            <Input
              placeholder="Keyword (Gif)"
              name="keyword"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Enter Message"
              name="message"
              type="text"
              handleChange={handleChange}
            />

            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {isLoading ? (
              <div>loading ...</div>
            ) : (
              <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
                
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Send now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
