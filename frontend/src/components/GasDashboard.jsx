import { useState, useEffect } from 'react';
import { Client, UserOperationBuilder } from 'userop'; 
import { formatUnits } from 'ethers'; // Import specific utilities

function useGasTracker() {
  const [gasSavings, setGasSavings] = useState({ total: 0, txCount: 0 });
  const [client, setClient] = useState(null);
  const [builder, setBuilder] = useState(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const client = await Client.init('https://rpc-testnet.nerochain.io');
        const builder = new UserOperationBuilder();
        
        // Configure Paymaster options
        builder.setPaymasterOptions({
          rpc: 'https://paymaster-testnet.nerochain.io',
          apikey: process.env.API_KEY,
          type: 'erc20',
          token: 'SPHERE'
        });

        setClient(client);
        setBuilder(builder);
      } catch (error) {
        console.error('Error initializing gas tracker:', error);
      }
    };

    initClient();
  }, []);

  const updateGasSavings = async () => {
    if (!client || !builder) return;

    try {
      // Get current gas estimates
      const supportedTokens = await client.getSupportedTokens(builder);
      const gasData = await client.buildUserOperation(builder);
      
      // Calculate savings based on Paymaster rules
      const totalSaved = gasData.maxFeePerGas.mul(gasData.preVerificationGas);
      const txCount = await client.provider.getTransactionCount(gasData.sender);

      setGasSavings({
        total: formatUnits(totalSaved, 18), // Use directly imported formatUnits
        txCount: txCount
      });
    } catch (error) {
      console.error('Error updating gas savings:', error);
    }
  };

  return { gasSavings, updateGasSavings };
}

export default function GasDashboard() {
  const { gasSavings, updateGasSavings } = useGasTracker();
  const [remainingTxs, setRemainingTxs] = useState(10);

  useEffect(() => {
    updateGasSavings();
    const interval = setInterval(updateGasSavings, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gasSavings.txCount >= 0) {
      setRemainingTxs(10 - gasSavings.txCount);
    }
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