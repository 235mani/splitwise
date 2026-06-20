import { useState } from "react";
import QRCode from "react-qr-code";

export default function Payment({ summary }) {
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Demo UPI IDs
  const upiMap = {
    mani: "talampally.manideep@ybl",
    deep: "talampally.manideep@ybl",
    talampally: "talampally.manideep@ybl",
  };

  // Convert summary to payment settlements
  const settlements = [];

  Object.entries(summary || {}).forEach(([ind, obj]) => {
    if (obj.net < 0) {
      settlements.push({
        from: obj.name,
        amount: Math.abs(obj.net),
      });
    }
  });

  const generateUpiLink = (person, amount) => {
    const upiId = upiMap[person] || "8522033044@ybl";

    return `upi://pay?pa=${upiId}&pn=${person}&am=${amount}&cu=INR&mc=0000&mode=01&purpose=00`;
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
                    {item.from}
                  </div>

                  <div className="text-sm text-gray-500">
                    Amount Due
                  </div>

                  <div className="text-lg font-bold text-red-600">
                    ₹{item.amount.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setSelectedPayment({
                        person: item.from,
                        amount: item.amount,
                      })
                    }
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
                  >
                    Show QR
                  </button>

                    {/* {generateUpiLink(item.from, item.amount)} */}
                  <a
                    href={generateUpiLink(
                      item.from,
                      item.amount
                    )}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                  >
                    Pay Now
                  </a>
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
                selectedPayment.person,
                selectedPayment.amount
              )}
            />
          </div>

          <div className="mt-4 text-center">
            <div className="font-semibold">
              {selectedPayment.person}
            </div>

            <div className="text-xl font-bold">
              ₹{selectedPayment.amount.toFixed(2)}
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setSelectedPayment(null)}
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