import { initPaymaster } from '@nerochain/sdk';

export const paymaster = initPaymaster({
  rpcUrl: import.meta.env.VITE_NERO_RPC,
  contractAddress: import.meta.env.VITE_PAYMASTER_CONTRACT
});