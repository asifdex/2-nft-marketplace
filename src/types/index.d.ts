interface Window {
  ethereum?: any;
}


declare type RootState = ReturnType <typeof store.getState>;

declare type appDispatch =typeof store.dispatch;

declare type InputProps = {
  placeholder: string;
  name?: string;
  type?: string;
  value?: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>,name:string) => void;
};


declare  type transactionState ={
  formData: {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
  };
  currentAccount: string | null;
  isLoading: boolean;
  transactionCount: number;
  transactions: Transaction[];
}
declare type TransactionsCardProps ={
  addressTo: string;
  addressFrom:string
  amount: string;
  keyword: string;
  message: string;
  timestamp:string;
  url?:string
}
