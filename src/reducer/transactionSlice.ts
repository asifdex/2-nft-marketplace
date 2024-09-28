import * as ethers from "ethers";

import TransactionABI from "../components/ABI/Transaction.json";
import dotenv from "dotenv";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

dotenv.config(); 


const createEthContract = async () => {
  const contractAddress = "0x1C4078fE11aaBe0B21e8Ca6f93ec05dc6e6A7a57";

  if (typeof window.ethereum !== "undefined" && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(
      contractAddress!,
      TransactionABI,
      signer
    );
    return transactionsContract;
  }
};

export const CKifwalletIsConnected = createAsyncThunk(
  "transaction/CKifwalletIsConnected",
  async (_, thunkApi) => {
    if (!window.ethereum) return alert("install metamask");

    const accounts =await window.ethereum.request({ method: "eth_accounts" });
    console.log(accounts, "account");
    console.log(accounts.length,"eth");
    

    if (accounts.length) {
      thunkApi.dispatch(setCurrentAccount(accounts[0]));
      thunkApi.dispatch(getAllTransaction());
      console.log(accounts.length);
    }
   await createEthContract();
  }
);
export const walletConect = createAsyncThunk(
  "transaction/connectWallet",
  async (_, thankApi) => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      thankApi.dispatch(setCurrentAccount(accounts[0]));
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllTransaction = createAsyncThunk(
  "transaction/getaAlltrans",
  async (_, trunkApi) => {
    try {
      const transactionContract = await createEthContract();
      if (!transactionContract) {
        console.log("failed to connect etherium wallet");
        return;
      }
      const availableTransaction =
        await transactionContract.getAllTransaction();
        console.log(availableTransaction,"structTransation");
        
      const structedTransation = availableTransaction.map(
        (transaction: any) => ({
          addressfrom: transaction.sender,
          addressTo: transaction.receiver,
          ammount: parseInt(transaction.ammount._hex) / 10 ** 18,
          message: transaction.message,
          keyword: transaction.keyword,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
        })
      );
      return structedTransation;
    } catch (error) {
      console.log(error);
    }
  }
);

export const sendTransaction = createAsyncThunk(
  "transaction/getaAlltrans",
  async (_, trunkAPI) => {
    const state = trunkAPI.getState() as { transaction: transactionState };
    const { formData, currentAccount } = state.transaction;
    if (window.ethereum) {
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await createEthContract();

      const parsedAmount = ethers.parseEther(amount);

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: `0x${parsedAmount.toString(16)}`,
          },
        ],
      });

      if (transactionContract) {
        try {
          const addToBlock = await transactionContract.addToBlockChain(
            addressTo,
            parsedAmount,
            message,
            keyword
          );
          trunkAPI.dispatch(setIsLoading(true));
          await addToBlock.wait();
          trunkAPI.dispatch(setIsLoading(false));

          const transactionCount = await transactionContract.getTransactionCount();
          localStorage.setItem("transactionCount", transactionCount.toNumber());
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
);

export const logoutWallet = createAsyncThunk(
  "transaction/logoutWallet",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setCurrentAccount(null)); // Reset current account
    thunkAPI.dispatch(setTransactions([])); // Optionally reset transactions
    // Clear any other related state if necessary
  }
);



const initialState: transactionState = {
  formData: { addressTo: "", amount: "", keyword: "", message: "" },
  currentAccount: null,
  isLoading: false,
  transactionCount: 0,
  transactions: [],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setFromData: (
      state,
      action: PayloadAction<transactionState["formData"]>
    ) => {
      state.formData = action.payload;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // logOutwallet : (state)=>{
    //   state.currentAccount =null
    // }
  },
  extraReducers :(builder)=>{
    builder.addCase(getAllTransaction.fulfilled,(state,action) =>{
      state.transactions =action.payload || []
    })
  }
});
export const { setCurrentAccount, setFromData, setIsLoading, setTransactions, } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
