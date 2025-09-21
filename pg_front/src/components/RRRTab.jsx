import React from 'react';
import { Lock } from 'lucide-react';

export function RRRTab({ useRRR }) {
  return (
    <div className="space-y-6">
      <form>
        <div className="space-y-6">
          <div className="text-center">
            <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pay with Generated RRR</h3>
            <p className="text-gray-600">Enter your Remita Retrieval Reference (RRR) to proceed with payment</p>
          </div>

          <div className="max-w-md mx-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remita Retrieval Reference (RRR)</label>
            <input
              type="number"
              autoComplete="off"
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-mono"
              id="rrrInput"
              name="rrr"
              placeholder="Enter RRR (e.g., 24000706140)"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={useRRR}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              <Lock className="w-5 h-5 mr-2" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RRRTab;
