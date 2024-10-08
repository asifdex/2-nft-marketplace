import { dummyData } from "@/config/dummy";
import useFetch from "@/hook/useFatch";
import { walletSlice } from "@/utils/walletSlice";
import React from "react";
import { useSelector } from "react-redux";

const TransactionsCard = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  keyword,
  amount,
  url,
}: TransactionsCardProps) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div
      className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a
            href={`https://bscscan.com/address/${addressFrom}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-white text-base">
              From: {walletSlice(addressFrom)}
            </p>
          </a>
          <a
            href={`https://bscscan.com/address/${addressTo}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-white text-base">To: {walletSlice(addressTo)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
        </div>
        <img
          src={gifUrl || url}
          alt="nature"
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">
            {timestamp || "No timestamp available"}
          </p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount } = useSelector(
    (state: RootState) => state.transactions
  );

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <>
            <h3 className="text-white text-3xl text-center my-2">
              Latest Transactions
            </h3>
            <div className="flex flex-wrap justify-center items-center mt-10">
              {transactions
                ? [...dummyData,...transactions]
                    .reverse()
                    .map((transaction: TransactionsCardProps, i: number) => {
                      console.log(transaction); // Log each transaction
                      return <TransactionsCard key={i} {...transaction} />;
                    })
                : null}
            </div>
          </>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}
      </div>
    </div>
  );
};

export default Transactions;
