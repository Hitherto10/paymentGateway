import React, {useEffect, useState} from 'react';
import {CreditCard, Search, Lock} from 'lucide-react';
import {PaymentTab} from "../components/Payment.jsx";
import { RRRTab } from "../components/RRRTab.jsx";
import { StatusTab } from "../components/StatusTab.jsx";


function Home() {
    const [rrr, setRRR] = useState('');
    const [paymentStatus, setpaymentStatus] = useState('');
    const [service_type_id, setService_type_id] = useState('');
    const [inputBoxStatus, setInputBoxStatus] = useState('');
    const purchases = []
    const [transactionList, setTransactionList] = useState([])
    const [serviceTypes, setServiceTypes] = useState([]);
    // const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [amount, setAmount] = useState('');
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
        console.log(receiptDetails);
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
                amount: amount,
                description: document.getElementById("description").value,
                serviceTypeId: service_type_id
            })
        });

        const data = await res.json();
        const newRRR = data.RRR;
        setRRR(newRRR);
        const payment_status = await retrieveRemitaRef(newRRR);
        console.log(data)
        // console.log(payment_status.message)
        setpaymentStatus(payment_status.message);

        purchases.push({
            "RRR": newRRR,
            "payer_name": document.getElementById("name").value,
            "description": document.getElementById("description").value,
            "status": payment_status.message,
            "amount": document.getElementById("amount").value,
        });

        // console.log(purchases);

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
            // console.log(JSON.stringify(data));
        }

        fetchTransactionHistory();
    }, []);

    const handleServiceTypeChange = (event) => {
        const selectedName = event.target.value;
        const serviceType = serviceTypes.find(
            (service) => service.service_type_name === selectedName
        );
        if (!serviceType) return;

        setService_type_id(serviceType.service_type_id);

        // Handle boolean or numeric truthy values
        const isFixed =
            serviceType.is_amount_fixed === true ||
            serviceType.is_amount_fixed === 1 ||
            serviceType.is_amount_fixed === '1';

        if (isFixed) {
            setAmount(String(serviceType.amount ?? '')); // update the input
            setIsAmountFixed(true);
        } else {
            setAmount(''); // or keep previous if you prefer
            setIsAmountFixed(false);
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
        let paymentEngine = RmPaymentEngine.init({
            key: import.meta.env.VITE_PUBLIC_KEY,
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
                if (leavePayment) { /* empty */ } else {
                    makePayment();
                }
            }
        });
        // paymentEngine.showPaymentWidget();
    }


    function useRRR() {

        let payWithRRR = document.getElementById("rrrInput");

        let paymentEngine = RmPaymentEngine.init({
            key: import.meta.env.VITE_PUBLIC_KEY,
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
                if (leavePayment) { /* empty */ } else {
                    makePayment();
                }
            }
        });

        paymentEngine.showPaymentWidget();

    }
    window.onload = function () {
        setDemoData();
    };

    const filteredTransactions = [...transactionList, ...purchases].filter((t) =>
        t.RRR.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <>
            <section id="payment" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                <PaymentTab
                                    amount={amount}
                                    setAmount={setAmount}
                                    isAmountFixed={isAmountFixed}
                                    serviceTypes={serviceTypes}
                                    handleServiceTypeChange={handleServiceTypeChange}
                                    handleGenerateRRR={handleGenerateRRR}
                                />
                            ) : activeTab === 'rrr' ? (
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
                            ) : (
                                <StatusTab
                                    getStatusInfo={getStatusInfo}
                                    paymentInformation={paymentInformation}
                                    inputBoxStatus={inputBoxStatus}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>























            <div className={`${rrr === "" ? "hidden" : "block"}
            m-auto flex flex-col gap-5 rounded-2xl justify-center items-center bg-gray-300 text-center mt-6 mb-6 max-w-[500px] h-60`}>
                <h1 className="font-[Sora] text-2xl"> RRR Generated Successfully</h1>
                <span className="font-[Outfit]">RRR Generated: <span style={{color: "green"}}>{rrr}</span></span>
                <input type="button" onClick={makePayment} value="Proceed to Payment"
                       className="button px-6 w-[200px] py-2 bg-[#3a3d59] cursor-pointer text-white rounded font-[Montserrat] mb-5"/>
            </div>

        </>
    )
}

export default Home;