import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const { ethereum } = window;

export interface TransactionState {
  formData: {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
  };
  currentAccount: string;
  isLoading: boolean;
  transactionCount: number;
  transactions: any[];
}

const initialState: TransactionState = {
  formData: { addressTo: "", amount: "", keyword: "", message: "" },
  currentAccount: "",
  isLoading: false,
  transactionCount: Number(localStorage.getItem("transactionCount")) || 0,
  transactions: [],
};

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const checkIfWalletIsConnected = createAsyncThunk("transaction/checkIfWalletIsConnected", async (_, thunkAPI) => {
  try {
    if (!ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      thunkAPI.dispatch(setCurrentAccount(accounts[0]));
      thunkAPI.dispatch(getAllTransactions());
    } else {
      console.log("No accounts found");
    }
  } catch (error) {
    console.error(error);
  }
});

export const connectWallet = createAsyncThunk("transaction/connectWallet", async (_, thunkAPI) => {
  try {
    if (!ethereum) return alert("Please install MetaMask.");

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    thunkAPI.dispatch(setCurrentAccount(accounts[0]));
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});

export const getAllTransactions = createAsyncThunk("transaction/getAllTransactions", async (_, thunkAPI) => {
  try {
    if (ethereum) {
      const transactionsContract = createEthereumContract();
      const availableTransactions = await transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map((transaction: any) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / 10 ** 18,
      }));

      return structuredTransactions;
    } else {
      console.log("Ethereum is not present");
    }
  } catch (error) {
    console.error(error);
  }
});

export const sendTransaction = createAsyncThunk("transaction/sendTransaction", async (_, thunkAPI) => {
  const state = thunkAPI.getState() as { transaction: TransactionState };
  const { formData, currentAccount } = state.transaction;

  try {
    if (ethereum) {
      const { addressTo, amount, keyword, message } = formData;
      const transactionsContract = createEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208", // 21000 GWEI
          value: parsedAmount._hex,
        }],
      });

      const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      thunkAPI.dispatch(setIsLoading(true));
      await transactionHash.wait();
      thunkAPI.dispatch(setIsLoading(false));

      const transactionCount = await transactionsContract.getTransactionCount();
      localStorage.setItem("transactionCount", transactionCount.toNumber());
    } else {
      console.log("No ethereum object");
    }
  } catch (error) {
    console.error(error);
  }
});

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<TransactionState["formData"]>) => {
      state.formData = action.payload;
    },
    setCurrentAccount: (state, action: PayloadAction<string>) => {
      state.currentAccount = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTransactions: (state, action: PayloadAction<any[]>) => {
      state.transactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload || [];
    });
  },
});

export const { setFormData, setCurrentAccount, setIsLoading, setTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
