import React, {useEffect, useState} from 'react';


function InlinePayment() {
    const [rrr, setRRR] = useState('');
    const [paymentStatus, setpaymentStatus] = useState('');
    const [service_type_id, setService_type_id] = useState('');
    const [inputBoxStatus, setInputBoxStatus] = useState('');
    const [purchases, setPurchasesTable] = useState([])
    const [transactionList, setTransactionList] = useState([])
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [amount, setAmount] = useState(0);
    const [isAmountFixed, setIsAmountFixed] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    // const checkRRRInput = document.getElementById('checkRRRInput');

    async function checkRRRInput () {
        const input = document.getElementById('checkRRRInput').value;
        const scopeStatus = await checkRRRStatus(input);
        setInputBoxStatus(scopeStatus.toString()); // update textbox with new status
    }



    const TABLE_HEAD = ["RRR", "Full Name", "Amount", "Description", "Payment Date", "Status"];


    async function checkRRRStatus(rrr) {
        const res = await fetch(`/api/check-status/${rrr}`);
        const data = await res.json();
        return data.message;
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
        const payment_status = await checkRRRStatus(newRRR);
        setpaymentStatus(payment_status);

        purchases.push({
            "RRR": newRRR,
            "payer_name": document.getElementById("name").value,
            "description": document.getElementById("description").value,
            "status": payment_status,
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
        const payment_status = await checkRRRStatus(rrr);
        setpaymentStatus(payment_status);

        purchases.push(
            {
                "RRR": rrr,
                "payer_name": document.getElementById("name").value,
                "description": document.getElementById("description").value,
                "status": paymentStatus,
                "amount": document.getElementById("amount").value,
            }
        )
        console.log(purchases);

        const res = await fetch('/api/save-to-db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                db_RRR: rrr,
                db_payer_name: document.getElementById("name").value,
                db_description: document.getElementById("description").value,
                db_status: payment_status,
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
    window.onload = function () {
        setDemoData();
    };

    const filteredTransactions = [...transactionList, ...purchases].filter((t) =>
        t.RRR.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <>
            <section
                className="max-w-[500px] m-auto bg-[#f9f9f9] rounded-lg content-center overflow-hidden">

                <div className="p-6 lg:p-10 space-y-5 font-[Montserrat] text-[13px]">


                    <form id="payment-form">

                        <div className="form-floating mb-3 mt-3">
                            <h1 className="text-3xl lg:text-4xl font-bold font-[Outfit] text-gray-800 lg:mb-12">
                                Proceed to make payment<br/>
                                {/*<span style={{color: "#28909E"}}>{rrr}</span>*/}
                                {/*<input type="text" disabled={true} className="form-control input rounded-md w-[100%] font-[Montserrat] text-xl font-bold text-[green]" id="js-rrr" name="rrr" value={rrr}/>*/}
                            </h1>

                        </div>

                        <div className="grid grid-cols-2  gap-5 font-white">

                            <input id="name" type="text" placeholder="Name"
                                   className="input rounded-md font-[Montserrat] text-[13px] bg-[white] border p-2"/>

                            <input id="email" type="email" placeholder="Email"
                                   className="input rounded-md font-[Montserrat] text-[13px] bg-[white] border p-2"/>

                            <input id="phone" type="tel" placeholder="Phone"
                                   className="input rounded-md font-[Montserrat] text-[13px] bg-[white] border p-2"/>

                            <input id="amount" type="text" placeholder="Amount"
                                   value={amount}
                                   onChange={(e) => setAmount(e.target.value)}
                                   disabled={isAmountFixed}
                                   className="input rounded-md font-[Montserrat] text-[13px] border p-2"/>

                            <select name="cars" id="cars" className="input rounded-md font-[Montserrat] text-[13px] bg-[white] border p-2" onChange={handleServiceTypeChange}>
                                <option value="Select an option" hidden>What are you paying for</option>
                                {serviceTypes.map((service_type_details) => (
                                    <option id="serviceTypeID" key={service_type_details.service_type_id}>
                                        {service_type_details.service_type_name}
                                    </option>
                                ))}


                            </select>

                            <textarea id="description" placeholder="Payment Description"
                                      className="input rounded-md font-[Montserrat] text-[13px] bg-[white] border p-2"/>
                        </div>
                        <button type="button" onClick={handleGenerateRRR}
                                className="button px-6 py-2 bg-[#3a3d59] cursor-pointer text-white rounded font-[Montserrat] m-5 ms-0">
                            Generate RRR
                        </button>
                    </form>



                </div>

            </section>


            <div className={`${rrr === "" ? "hidden" : "block"}
            m-auto flex flex-col gap-5 rounded-2xl justify-center items-center bg-gray-300 text-center mt-6 mb-6 max-w-[500px] h-60`}>
                <h1 className="font-[Sora] text-2xl"> RRR Generated Successfully</h1>
                <span className="font-[Outfit]">RRR Generated: <span style={{color: "green"}}>{rrr}</span></span>
                <input type="button" onClick={makePayment} value="Proceed to Payment"
                       className="button px-6 w-[200px] py-2 bg-[#3a3d59] cursor-pointer text-white rounded font-[Montserrat] mb-5"/>
            </div>



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
                                key={head}
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


            <div className="flex items-center w-xl m-7 justify-center p-5 bg-blue-300">
                <input
                    type="number"
                    placeholder="Input RRR"
                    id="checkRRRInput"
                    className="bg-white border rounded-2xl p-3 me-2"
                />
                <button
                    type="submit"
                    onClick={checkRRRInput}
                    className="bg-gray-800 text-white rounded-xl px-4 py-2 me-2"
                >
                    Submit
                </button>
                <span className="bg-transparent rounded p-3"
                >Status of Payment: {inputBoxStatus}</span>
            </div>

        </>
    )
}

export default InlinePayment;