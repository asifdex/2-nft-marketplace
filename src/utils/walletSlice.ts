export const walletSlice = (wallet: string) => {
    if (!wallet) return "Wallet address not available"; // Fallback for undefined wallet
    return `${wallet.slice(0, 5)}...${wallet.slice(wallet.length - 5, wallet.length)}`;
  };
  