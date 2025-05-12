import { useState, useEffect, useCallback } from 'react';
import { Client, UserOperationBuilder } from 'userop'; 
import { formatUnits } from 'ethers'; 

function useGasTracker() {
  const [gasSavings, setGasSavings] = useState({ total: 0, txCount: 0 });
  const [client, setClient] = useState(null);
  const [builder, setBuilder] = useState(null);

  // initialize client/builder once
  useEffect(() => {
    Client.init('https://rpc-testnet.nerochain.io')
      .then(c => {
        const b = new UserOperationBuilder();
        b.setPaymasterOptions({
          rpc: 'https://paymaster-testnet.nerochain.io',
          apikey: process.env.API_KEY,
          type: 'erc20',
          token: 'SPHERE'
        });
        setClient(c);
        setBuilder(b);
      })
      .catch(console.error);
  }, []);

  // memoize updateGasSavings so ESLint can track its deps
  const updateGasSavings = useCallback(async () => {
    if (!client || !builder) return;

    try {
      const gasData = await client.buildUserOperation(builder);
      const totalSaved = gasData.maxFeePerGas.mul(gasData.preVerificationGas);
      const txCount = await client.provider.getTransactionCount(gasData.sender);

      setGasSavings({
        total: formatUnits(totalSaved, 18),
        txCount
      });
    } catch (error) {
      console.error('Error updating gas savings:', error);
    }
  }, [client, builder]);  // <- list all variables used inside  

  return { gasSavings, updateGasSavings };
}

export default function GasDashboard() {
  const { gasSavings, updateGasSavings } = useGasTracker();
  const [remainingTxs, setRemainingTxs] = useState(10);

  // include updateGasSavings in deps
  useEffect(() => {
    updateGasSavings();
    const interval = setInterval(updateGasSavings, 15000);
    return () => clearInterval(interval);
  }, [updateGasSavings]);  // <- ESLint satisfied :contentReference[oaicite:0]{index=0}

  useEffect(() => {
    setRemainingTxs(10 - gasSavings.txCount);
  }, [gasSavings.txCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Your Gas Savings
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Saved:</span>
            <span className="text-xl font-medium text-purple-600">
              {gasSavings.total || '0.00'} SPHERE
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Free Txs Remaining:</span>
            <span
              className={`
                inline-block px-3 py-1 text-sm font-semibold rounded-full
                ${remainingTxs > 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              `}
            >
              {remainingTxs}
            </span>
          </div>
        </div>

        <button
          onClick={updateGasSavings}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
