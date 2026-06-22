import { useState } from "react";
import QRCode from "react-qr-code";

export default function Payment({
    summary,
    roommates,
    setActiveTab,
}) {
    const [selectedPayment, setSelectedPayment] = useState(null);

    const roommateMap = Object.fromEntries(
        roommates.map((roommate) => [
            roommate.id,
            roommate,
        ])
    );

    const getRoommate = (id) =>
        roommateMap[id];

    const getUpiId = (id) => {
        const roommate = getRoommate(id);
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
                fromId: debtors[i].id,
                toId: creditors[j].id,
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
        receiverId,
        amount
    ) => {
        const receiver =
            getRoommate(receiverId);

        if (!receiver?.upiId) {
            return "";
        }

        return `upi://pay?pa=${receiver.upiId}&pn=${encodeURIComponent(
            receiver.name
        )}&am=${amount}&cu=INR`;
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-whiteshadow-sm">
                <div className="mb-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                        UPI Payments
                    </h2>
                    <span className="text-xs text-slate-500">(Shows final transactions required to settle up)</span>
                </div>

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
                                        {
                                            roommateMap[item.fromId]?.name
                                        } → {
                                            roommateMap[item.toId]?.name
                                        }
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        Amount Due
                                    </div>

                                    <div className="text-lg font-bold text-red-600">
                                        ₹{item.amount.toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {!getUpiId(item.toId) && (
                                        <div className="text-xs text-red-500">
                                            No UPI ID configured for&nbsp;
                                            <span className="font-semibold">
                                                '{roommateMap[item.toId]?.name}'
                                            </span>
                                            <button
                                                onClick={() => setActiveTab("names")}
                                                className="ml-2 text-blue-600 underline"
                                            >
                                                Configure UPI
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        disabled={!getUpiId(item.toId)}
                                        onClick={() =>
                                            setSelectedPayment({
                                                payerId: item.fromId,
                                                receiverId: item.toId,
                                                amount: item.amount,
                                            })
                                        }
                                        className="btn-premium disabled:cursor-not-allowed disabled:opacity-50"
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
                                selectedPayment.receiverId,
                                selectedPayment.amount
                            )}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <div className="font-semibold">
                            Pay to:
                            {
                                roommateMap[
                                    selectedPayment.receiverId
                                ]?.name
                            }
                        </div>

                        <div className="text-sm text-gray-500">
                            From:
                            {
                                roommateMap[
                                    selectedPayment.payerId
                                ]?.name
                            }
                        </div>

                        <div className="text-xl font-bold">
                            ₹{selectedPayment.amount.toFixed(2)}
                        </div>

                        <div className="text-sm text-slate-500 mt-2">
                            UPI ID:{" "}
                            {getUpiId(
                                selectedPayment.receiverId
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