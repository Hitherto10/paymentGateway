import React from 'react';
import { Lock } from 'lucide-react';

// Payment tab content extracted from Home
// Receives state and handlers via props from Home for minimal change
export function PaymentTab({
  amount,
  setAmount,
  isAmountFixed,
  serviceTypes,
  handleServiceTypeChange,
  handleGenerateRRR,
}) {
  return (
    <div className="space-y-6">
      <form>
        <div className="grid font-[Montserrat] text-sm md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payer Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              name="payment_email"
              placeholder="Email"
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Phone"
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
            <input
              id="amount"
              type="text"
              placeholder="Amount"
              value={amount ?? ''}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isAmountFixed}
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2"> Service</label>
            <select
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onChange={handleServiceTypeChange}
            >
              <option value="Select an option" hidden>
                What are you paying for
              </option>
              {serviceTypes.map((service_type_details) => (
                <option id="serviceTypeID" key={service_type_details.service_type_id}>
                  {service_type_details.service_type_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              placeholder="Payment Description"
              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateRRR}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center"
        >
          <Lock className="w-5 h-5 mr-2" />
          Generate RRR
        </button>
      </form>
    </div>
  );
}

export default PaymentTab;
