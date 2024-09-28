import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CKifwalletIsConnected, walletConect } from "../../reducer/transactionSlice";


const Transactions = () => {
  const dispatch = useDispatch<appDispatch>();

  // Check if the wallet is connected when the component mounts
  useEffect(() => {
    const checkWallet = async () => {
      await dispatch(CKifwalletIsConnected());
    };
    checkWallet()
  }, [dispatch]);

  // Connect wallet function
  const connectWallet = () => {
    dispatch(walletConect());
    console.log("hi there");
    
  };

  return (
    <div>
      <button onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
}

export default Transactions;
