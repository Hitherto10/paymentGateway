import React from 'react';
import { CheckCircle, Search } from 'lucide-react';

export function StatusTab({ getStatusInfo, paymentInformation, inputBoxStatus }) {
  return (
    <div className="space-y-6">
      {!paymentInformation ? (
        <>
          <div className="text-center">
            <Search className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Payment Status</h3>
            <p className="text-gray-600">Enter your payment reference to track your transaction</p>
          </div>
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Reference</label>
            <input
              type="text"
              placeholder="Enter RRR (e.g., 24000706140)"
              id="checkRRRInput"
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-mono"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={getStatusInfo}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Check Status
            </button>
          </div>
        </>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                <p className="text-4xl font-bold text-gray-900">₦{parseInt(inputBoxStatus.amount).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Method of Payment</label>
                  <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.channel}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Payment Reference (RRR)</label>
                  <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.RRR}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Payment Date</label>
                  <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{new Date(inputBoxStatus.paymentDate).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Status Code</label>
                  <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.status}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Payer Name</label>
                    <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.payerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Payer Email</label>
                    <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.payerEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Note: This is an official receipt for your transaction.
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusTab;
