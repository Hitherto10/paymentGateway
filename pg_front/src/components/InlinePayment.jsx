import React, {useEffect, useState} from 'react';

import {
    CreditCard,
    CheckCircle,
    ArrowRight,
    Search,
    Lock,
    Mail,
} from 'lucide-react';



function InlinePayment() {

    const [rrr, setRRR] = useState('');
    const [paymentStatus, setpaymentStatus] = useState('');
    const [service_type_id, setService_type_id] = useState('');
    const [inputBoxStatus, setInputBoxStatus] = useState('');
    const purchases = [];
    const [transactionList, setTransactionList] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [amount, setAmount] = useState(0);
    const [isAmountFixed, setIsAmountFixed] = useState(false);
    const [receiptDetails, setReceiptDetails] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const TABLE_HEAD = ["RRR", "Full Name", "Amount", "Description", "Payment Date", "Status"];
    const [activeTab, setActiveTab] = useState('payment');
    const [paymentInformation, setPaymentInformation] = useState(null);

    async function getStatusInfo () {
        const input = document.getElementById('checkRRRInput').value;
        const scopeStatus = await retrieveRemitaRef(input);
        setInputBoxStatus(scopeStatus);
        setPaymentInformation(scopeStatus)
        console.log(scopeStatus);
    }

    async function retrieveRemitaRef(rrr) {
        const res = await fetch(`/api/check-status/${rrr}`);
        const data = await res.json();
        setReceiptDetails(data);
        console.log(data);
        return data;
    }

    async function handleGenerateRRR() {
        const res = await fetch('/api/generate-rrr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payerName: document.getElementById("name").value,
                payerEmail: document.getElementById("email").value,
                payerPhone: document.getElementById("phone").value,
                amount: document.getElementById("amount").value,
                description: document.getElementById("description").value,
                serviceTypeId: service_type_id
            })
        });

        const data = await res.json();
        const newRRR = data.RRR;
        setRRR(newRRR);
        const payment_status = await retrieveRemitaRef(newRRR);
        console.log(payment_status.message)
        setpaymentStatus(payment_status.message);

        purchases.push({
            "RRR": newRRR,
            "payer_name": document.getElementById("name").value,
            "description": document.getElementById("description").value,
            "status": payment_status.message,
            "amount": document.getElementById("amount").value,
        });

        console.log(purchases);

        return(data.RRR)
    }

    useEffect(() => {
        async function fetchServiceTypes() {
            const res = await fetch('http://localhost:3000/api/service-types');
            const data = await res.json();
            setServiceTypes(data);
        }

        fetchServiceTypes();
    }, []);

    useEffect(() => {
        async function fetchTransactionHistory() {
            const res = await fetch('http://localhost:3000/api/transaction-history');
            const data = await res.json();
            // let transactionData = JSON.stringify(data);
            setTransactionList(data)
            console.log(JSON.stringify(data));
        }

        fetchTransactionHistory();
    }, []);

    const handleServiceTypeChange = (event) => {
        const serviceType = serviceTypes.find(service => service.service_type_name === event.target.value);


        if (serviceType) {
            setSelectedServiceType(serviceType);
            setService_type_id(serviceType.service_type_id);
            if (serviceType.is_amount_fixed  === 1){
                setAmount(serviceType.amount);
                setIsAmountFixed(true);
                document.getElementById("amount").disabled = true;
            }else{
                setAmount(0);
                setIsAmountFixed(false);
            }
        }
    };

    async function savePaymentDetails() {
        const payment_status = await retrieveRemitaRef(rrr);
        setpaymentStatus(payment_status.message);

        purchases.push(
            {
                "RRR": rrr,
                "payer_name": document.getElementById("name").value,
                "description": document.getElementById("description").value,
                "status": paymentStatus,
                "amount": document.getElementById("amount").value,
            }
        )

        const res = await fetch('/api/save-to-db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                db_RRR: rrr,
                db_payer_name: document.getElementById("name").value,
                db_description: document.getElementById("description").value,
                db_status: payment_status.message,
                db_amount: document.getElementById("amount").value,
            })
        });

        const data = await res.json();
        if (data.success) {
            console.log("Payment details saved successfully");
        } else {
            console.error("Failed to save payment details", data.error);
        }
    }

    function makePayment() {

        let form = document.querySelector("#payment-form");
        let paymentEngine = RmPaymentEngine.init({
            key: "QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=",
            processRrr: true,
            transactionId: Math.floor(Math.random()*1101233),
            extendedData: {
                customFields: [
                    {
                        name: "rrr",
                        value: rrr
                    }
                ]
            },
            onSuccess: function (response) {
                savePaymentDetails();
                console.log('callback Successful Response', response);
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "https://remita.net/");
                xhr.send();
            },
            onError: function (response) {
                console.log('callback Error Response', response);
            },
            onClose: function () {
                let leavePayment = confirm("Abandon Payment?");
                if (leavePayment) {

                } else {
                    makePayment();
                }
            }
        });
        paymentEngine.showPaymentWidget();


    }
    function useRRR() {

        let payWithRRR = document.getElementById("rrrInput");
        let paymentEngine = RmPaymentEngine.init({
            key: "QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=",
            processRrr: true,
            transactionId: Math.floor(Math.random()*1101233),
            extendedData: {
                customFields: [
                    {
                        name: "rrr",
                        value: payWithRRR.value
                    }
                ]
            },
            onSuccess: function (response) {
                savePaymentDetails();
                console.log('callback Successful Response', response);
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "https://remita.net/");
                xhr.send();
            },
            onError: function (response) {
                console.log('callback Error Response', response);
            },
            onClose: function () {
                let leavePayment = confirm("Abandon Payment?");
                if (leavePayment) {

                } else {
                    makePayment();
                }
            }
        });
        paymentEngine.showPaymentWidget();


    }
    // window.onload = function () {
    //     setDemoData();
    // };

    const filteredTransactions = [...transactionList, ...purchases].filter((t) =>
        t.RRR.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <>
            <section id="payment" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/*<form id="payment-form">*/}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-[Sora] font-bold text-gray-900 mb-4">Payment Portal</h2>
                        <p className="text-xl font-[Outfit] text-gray-600">Make payments or check transaction status</p>
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                         {/*Tab Navigation*/}
                        <div className="flex border-b border-gray-200">
                            <button type="button"
                                onClick={() => setActiveTab('payment')}
                                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                    activeTab === 'payment'
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                <CreditCard className="w-5 h-5 inline mr-2" />
                                Make Payment
                            </button>
                            <button type="button"
                                onClick={() => setActiveTab('rrr')}
                                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                    activeTab === 'rrr'
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                <Lock className="w-5 h-5 inline mr-2" />
                                Pay with Generated RRR
                            </button>
                            <button type="button"
                                onClick={() => setActiveTab('status')}
                                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                    activeTab === 'status'
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                <Search className="w-5 h-5 inline mr-2" />
                                Check Status
                            </button>
                        </div>

                        <div className="p-8">
                            {activeTab === 'payment' ? (
                                    <div className="space-y-6">
                                        <form>
                                            <div className="grid font-[Montserrat] text-sm md:grid-cols-2 gap-6">

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payer Name</label>
                                                    <input id="name" type="text" placeholder="Name"
                                                           className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"/>

                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                                    <input id="email"
                                                           type="email"
                                                           name="payment_email"
                                                           placeholder="Email"
                                                           className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                    <input id="phone" type="tel" placeholder="Phone"
                                                           className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"/>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
                                                    <input id="amount" type="text" placeholder="Amount"
                                                           value={amount}
                                                           onChange={(e) => setAmount(e.target.value)}
                                                           disabled={isAmountFixed}
                                                           className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"/>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2"> Service
                                                    </label>
                                                    <select className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" onChange={handleServiceTypeChange}>
                                                        <option value="Select an option" hidden>What are you paying for</option>
                                                        {serviceTypes.map((service_type_details) => (
                                                            <option id="serviceTypeID" key={service_type_details.service_type_id}>
                                                                {service_type_details.service_type_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                                    <textarea id="description" placeholder="Payment Description"
                                                              className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"/>
                                                </div>

                                            </div>

                                            <button type="button" onClick={handleGenerateRRR}
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center">
                                                <Lock className="w-5 h-5 mr-2" />
                                                Generate RRR
                                            </button>
                                        </form>
                                    </div>
                                ) :
                                activeTab === 'rrr' ? (
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

                                                        <input type="number"
                                                               autoComplete="off"
                                                               className="input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-mono" id="rrrInput" name="rrr" placeholder="Enter RRR (e.g., 24000706140)"/>
                                                    </div>

                                                    <div className="flex justify-center">
                                                        <button type="button" onClick={useRRR}
                                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center">
                                                            <Lock className="w-5 h-5 mr-2" />
                                                            Proceed to Payment
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                ) :
                                (
                                    <div className="space-y-6">
                                        {!paymentInformation ? (
                                            <>
                                              <div className="text-center">
                                                  <Search className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Payment Status</h3>
                                                  <p className="text-gray-600">Enter RRR to check status</p>
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
                                                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2 rounded-xl hover:from-green-700 hover:to-emerald-700
                                                      transition-all transform
                                                      hover:scale-105 shadow-lg flex items-center">
                                                      <CheckCircle className="w-5 h-5 mr-2" />
                                                      Check Status
                                                  </button>
                                              </div>

                                          </>
                                       ) :
                                       (
                                           <div className="max-w-2xl mx-auto">
                                               <div className="text-center mb-8">
                                                   <div className="flex justify-center mb-4">
                                                       <h2>{inputBoxStatus.message}</h2>
                                                   </div>
                                                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Status</h3>
                                                   {/*<div className={`inline-flex items-center px-4 py-2 rounded-full-text-sm font-semibold border ${paymentStatus.status}`}>*/}
                                                   {/*    {paymentStatus.status.charAt(0).toUpperCase() + paymentStatus.status.slice(1)}*/}
                                                   {/*</div>*/}
                                               </div>

                                               {/* Payment Details Card */}
                                               <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                                                   {/* Amount Section */}
                                                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                                                       <div className="text-center">
                                                           <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                                                           <p className="text-4xl font-bold text-gray-900">₦{parseInt(inputBoxStatus.amount).toLocaleString()}</p>
                                                       </div>
                                                   </div>

                                                   {/* Details Grid */}
                                                   <div className="p-6 space-y-4">
                                                       <div className="grid md:grid-cols-2 gap-6">
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Method of Payment</label>
                                                               <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.channel}</p>
                                                           </div>
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Order ID</label>
                                                               <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.orderId}</p>
                                                           </div>
                                                       </div>

                                                       <div className="grid md:grid-cols-3 gap-6">
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Date & Time</label>
                                                               <p className="text-gray-900">{new Date(inputBoxStatus.transactionDate
                                                               ).toLocaleString()}</p>
                                                           </div>
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Fee Charged </label>
                                                               <p className="text-gray-900">₦{inputBoxStatus.chargeFee}</p>
                                                           </div>
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Biller Name </label>
                                                               <p className="text-gray-900">{inputBoxStatus.billerName}</p>
                                                           </div>
                                                       </div>

                                                       <div>
                                                           <label className="block text-sm font-semibold text-gray-500 mb-1">Description</label>
                                                           <p className="text-gray-900">{inputBoxStatus.paymentDescription}</p>
                                                       </div>

                                                       {inputBoxStatus.rrr && (
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">RRR</label>
                                                               <p className="text-gray-900 font-mono bg-gray-50 py-2 rounded-lg">{inputBoxStatus.rrr}</p>
                                                           </div>
                                                       )}
                                                   </div>

                                                   {/* Customer Information */}
                                                   <div className="bg-gray-50 p-6 border-t border-gray-200">
                                                       <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
                                                       <div className="grid md:grid-cols-3 gap-4">
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Name</label>
                                                               <p className="text-gray-900">{inputBoxStatus.payerName}</p>
                                                           </div>
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
                                                               <p className="text-gray-900">{inputBoxStatus.payerEmail}</p>
                                                           </div>
                                                           <div>
                                                               <label className="block text-sm font-semibold text-gray-500 mb-1">Phone</label>
                                                               <p className="text-gray-900">{inputBoxStatus.payerPhoneNumber}</p>
                                                           </div>
                                                       </div>
                                                   </div>

                                                   {/*Action Buttons*/}
                                                   <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                                                       <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center">
                                                           <Mail className="w-5 h-5 mr-2" />
                                                           Email Receipt
                                                       </button>
                                                       <button className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center">
                                                           <ArrowRight className="w-5 h-5 mr-2" />
                                                           Download PDF
                                                       </button>
                                                       <button
                                                           onClick={() => {setPaymentInformation(null); }}
                                                           className="sm:w-auto bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center"
                                                       >
                                                           <Search className="w-5 h-5 mr-2" />
                                                           New Search
                                                       </button>
                                                   </div>
                                               </div>
                                           </div>
                                       )}
                                    </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>


            {/*RRR Generated Div*/}
            <div className={`${rrr === "" ? "hidden" : "block"}
            m-auto flex flex-col gap-5 rounded-2xl justify-center items-center bg-gray-300 text-center mt-6 mb-6 max-w-[500px] h-60`}>
                <h1 className="font-[Sora] text-2xl"> RRR Generated Successfully</h1>
                <span className="font-[Outfit]">RRR Generated: <span style={{color: "green"}}>{rrr}</span></span>
                <input type="button" onClick={makePayment} value="Proceed to Payment"
                       className="button px-6 w-[200px] py-2 bg-[#3a3d59] cursor-pointer text-white rounded font-[Montserrat] mb-5"/>
            </div>


            {/*TRANSACTION HISTORY*/}
            <div className="max-w-[1000px] m-[auto] relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by RRR"
                        className="border p-2 rounded w-full sm:w-1/3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <table className="w-full p-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {TABLE_HEAD.map((head, index) => (
                            <th
                                key={index}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 px-6 py-3 transition-colors hover:bg-blue-gray-50"
                            >
                                {head}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTransactions.map((transaction, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">
                                {transaction.RRR}
                            </td>
                            <th scope="row"
                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <div>
                                    <div className="text-base font-semibold">{transaction.payer_name}</div>
                                    <div className="font-normal text-gray-500">neil.sims@flowbite.com</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium">{transaction.amount}</a>
                            </td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium">{transaction.description}</a>
                            </td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium">{transaction.transaction_date}</a>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className={`h-2.5 w-2.5 rounded-full ${transaction.status === "Transaction Pending" ? "bg-yellow-500" : "bg-green-500"} me-2`}></div>
                                    {transaction.status}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>
        </>
    )
}

export default InlinePayment;