import { useState } from "react";
import QRCode from "react-qr-code";

export default function Payment({
    summary,
    roommates,
}) {
    const [selectedPayment, setSelectedPayment] = useState(null);

    const getRoommate = (name) =>
        roommates.find((r) => r.name === name);

    const getUpiId = (name) => {
        const roommate = getRoommate(name);
        return roommate?.upiId || "";
    };

    function calculateSettlements(summary) {
        const creditors = summary
            .filter((p) => p.net > 0)
            .map((p) => ({ ...p }));

        const debtors = summary
            .filter((p) => p.net < 0)
            .map((p) => ({
                ...p,
                net: Math.abs(p.net),
            }));

        const settlements = [];

        let i = 0;
        let j = 0;

        while (
            i < debtors.length &&
            j < creditors.length
        ) {
            const amount = Math.min(
                debtors[i].net,
                creditors[j].net
            );

            settlements.push({
                from: debtors[i].name,
                to: creditors[j].name,
                amount,
            });

            debtors[i].net -= amount;
            creditors[j].net -= amount;

            if (debtors[i].net < 0.01) i++;
            if (creditors[j].net < 0.01) j++;
        }

        return settlements;
    }

    const settlements = calculateSettlements(
        summary || []
    );

    const generateUpiLink = (
        receiverName,
        amount
    ) => {
        const receiver =
            getRoommate(receiverName);

        if (!receiver?.upiId) {
            return "";
        }

        return `upi://pay?pa=${receiver.upiId}&pn=${encodeURIComponent(
            receiver.name
        )}&am=${amount}&cu=INR`;
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-3xl font-bold">
                    UPI Payments
                </h2>

                {settlements.length === 0 ? (
                    <p className="text-gray-500">
                        No pending payments 🎉
                    </p>
                ) : (
                    <div className="space-y-4">
                        {settlements.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
                            >
                                <div>
                                    <div className="font-semibold">
                                        {item.from} → {item.to}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        Amount Due
                                    </div>

                                    <div className="text-lg font-bold text-red-600">
                                        ₹{item.amount.toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {!getUpiId(item.to) && (
                                        <div className="text-xs text-red-500">
                                            No UPI ID configured for&nbsp;
                                            <span className="font-semibold">
                                                 '{item.to}'
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        disabled={!getUpiId(item.to)}
                                        onClick={() =>
                                            setSelectedPayment({
                                                payer: item.from,
                                                receiver: item.to,
                                                amount: item.amount,
                                            })
                                        }
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Pay via QR
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedPayment && (
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-2xl font-bold">
                        Scan & Pay
                    </h3>

                    <div className="flex justify-center">
                        <QRCode
                            size={220}
                            value={generateUpiLink(
                                selectedPayment.receiver,
                                selectedPayment.amount
                            )}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <div className="font-semibold">
                            Pay to: {selectedPayment.receiver}
                        </div>

                        <div className="text-sm text-gray-500">
                            From: {selectedPayment.payer}
                        </div>

                        <div className="text-xl font-bold">
                            ₹{selectedPayment.amount.toFixed(2)}
                        </div>

                        <div className="text-sm text-slate-500 mt-2">
                            UPI ID:{" "}
                            {getUpiId(
                                selectedPayment.receiver
                            )}
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() =>
                                setSelectedPayment(null)
                            }
                            className="rounded-lg bg-gray-200 px-4 py-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}