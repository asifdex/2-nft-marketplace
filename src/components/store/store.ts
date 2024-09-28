
import { configureStore } from "@reduxjs/toolkit";
import transactionsSlice from "../../reducer/transactionSlice";

const store = configureStore ({
    reducer:{
        transactions : transactionsSlice,
    }
})



export default store