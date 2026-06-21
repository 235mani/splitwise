import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import RoommatePanel from './components/RoommatePanel';
import ExpensePanel from './components/ExpensePanel';
import SummaryPanel from './components/SummaryPanel';
import DetailedPanel from './components/DetailedPanel';
import ConfirmDialog from './components/ConfirmDialog';
import { buildSummary, getAllNames } from './utils/expenseLogic';
import { useSwipeable } from "react-swipeable";
import Payment from './components/Payment';
import Footer from './components/Footer';

const defaultRoommates = [
  { name: 'Alice', mobile: '', upiId: '' },
  { name: 'Bob', mobile: '', upiId: '' },
  { name: 'Charlie', mobile: '', upiId: '' },
];

function readStoredArray(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [roommates, setRoommates] = useState(() => readStoredArray('splitwise_roommates', defaultRoommates));
  const [expenses, setExpenses] = useState(() => readStoredArray('splitwise_expenses', []));
  // const [roommateInput, setRoommateInput] = useState('');
  const [roommateInput, setRoommateInput] = useState({
    name: '',
    mobile: '',
    upiId: '',
  });
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [paidBy, setPaidBy] = useState(
    () => readStoredArray('splitwise_roommates', defaultRoommates)[0]?.name || ''
  );
  const [activeTab, setActiveTab] = useState('names');
  const tabOrder = ['names', 'split', 'detailed', 'payment'];
  const [showTransactions, setShowTransactions] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (
      roommates.length &&
      typeof roommates[0] === 'string'
    ) {
      setRoommates(
        roommates.map((name) => ({
          name,
          mobile: '',
          upiId: '',
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('splitwise_roommates', JSON.stringify(roommates));
  }, [roommates]);

  useEffect(() => {
    localStorage.setItem('splitwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (
      roommates.length &&
      !roommates.some((r) => r.name === paidBy)
    ) {
      setPaidBy(roommates[0]?.name);
    }
  }, [roommates, paidBy]);

  const splitSelected = useMemo(() => {
    return roommates.map((roommate) => ({
      name: roommate.name,
      checked: true,
    }));
  }, [roommates]);

  const [splitAmong, setSplitAmong] = useState(splitSelected);

  useEffect(() => {
    setSplitAmong(
      roommates.map((roommate) => ({
        name: roommate.name,
        checked: true,
      }))
    );
  }, [roommates]);

  const allNames = useMemo(() => getAllNames(roommates, expenses), [roommates, expenses]);

  const addRoommate = () => {
    if (!roommateInput.name.trim()) {
      setConfirm({ title: 'Name is required', message: 'Please enter a name for the roommate.', singleButton: true });
      return;
    }
    const { name, mobile, upiId } = roommateInput;
    if (!name) return;
    if (roommates.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      setConfirm({ title: 'Roommate already exists', message: 'That name is already on the list.', singleButton: true });
      return;
    }
    setRoommates([...roommates, { name, mobile, upiId }]);
    setRoommateInput({ name: '', mobile: '', upiId: '' });
  };

  const removeRoommate = (idx) => {
    const name = roommates[idx].name;
    setConfirm({
      title: 'Remove roommate?',
      message: `This will also remove any expenses involving ${name}.`,
      onYes: () => {
        setExpenses(expenses.filter((e) => e.paidBy !== name && !e.splitAmong.includes(name)));
        setRoommates(roommates.filter((_, i) => i !== idx));
        setConfirm(null);
      },
    });
  };

  const clearAllNames = () => {
    setConfirm({
      title: 'Delete all roommates?',
      message: 'This will also remove all expenses associated with these roommates.',
      onYes: () => {
        setExpenses([]);
        setRoommates([]);
        setConfirm(null);
      },
    });
  };

  const addExpense = () => {
    const descValue = desc.trim();
    const amountValue = amount.trim();
    if (!descValue || !amountValue) return;
    const parts = amountValue.split(/[,+]/).map((p) => p.trim()).filter(Boolean);
    if (!parts.every((p) => /^\d+(\.\d+)?$/.test(p))) {
      setConfirm({ title: 'Invalid amount', message: 'Use only numbers separated by commas or plus signs.' });
      return;
    }
    const parsedAmount = parts.reduce((sum, p) => sum + parseFloat(p), 0);
    const selected = splitAmong.filter((item) => item.checked).map((item) => item.name);
    if (!selected.length) {
      setConfirm({ title: 'Select someone to split with', message: 'Choose at least one roommate.' });
      return;
    }
    const newExpense = { desc: descValue, amount: parsedAmount, paidBy, splitAmong: selected, date: expenseDate || null };
    if (editIndex !== null) {
      const updated = [...expenses];
      updated[editIndex] = newExpense;
      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }
    setDesc(''); setAmount(''); setExpenseDate(''); setPaidBy(roommates[0]?.name || '');
    setSplitAmong(roommates.map((roommate) => ({ name: roommate.name, checked: true })));
  };

  const editExpense = (idx) => {
    const item = expenses[idx];
    setEditIndex(idx);
    setDesc(item.desc);
    setAmount(String(item.amount));
    setExpenseDate(item.date || '');
    setPaidBy(item.paidBy);
    setSplitAmong(roommates.map((roommate) => ({ name: roommate.name, checked: item.splitAmong.includes(roommate.name) })));
    setActiveTab('split');
  };

  const deleteExpense = (idx) => {
    setConfirm({
      title: 'Delete expense?',
      message: 'This action cannot be undone.',
      onYes: () => {
        setExpenses(expenses.filter((_, i) => i !== idx));
        setConfirm(null);
      },
    });
  };

  const updateRoommate = (
    idx,
    updatedRoommate
  ) => {
    setRoommates((prev) =>
      prev.map((roommate, i) =>
        i === idx ? updatedRoommate : roommate
      )
    );
  };

  const deleteAllExpenses = () => {
    setConfirm({
      title: 'Delete all expenses?',
      message: 'This action cannot be undone.',
      onYes: () => {
        setExpenses([]);
        setConfirm(null);
      },
    });
  };

  const handlers = useSwipeable({
    onSwiped: ({ dir, deltaX, deltaY }) => {
      const horizontal = Math.abs(deltaX);
      const vertical = Math.abs(deltaY);

      // Ignore normal scrolling
      if (horizontal < 50) return;

      // Require horizontal movement to dominate
      if (horizontal < vertical * 3) return;

      const currentIndex = tabOrder.indexOf(activeTab);

      if (dir === "Left" && currentIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIndex + 1]);
      }

      if (dir === "Right" && currentIndex > 0) {
        setActiveTab(tabOrder[currentIndex - 1]);
      }
    },

    preventScrollOnSwipe: false,
    trackTouch: true,
  });

  const summary = useMemo(() => buildSummary(allNames, expenses), [allNames, expenses]);

  return (
    <div className="min-h-screen text-slate-800" {...handlers}>
      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-6 md:px-6 lg:px-0">
        <main className="rounded-3xl">
          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          <section>
            {activeTab === 'names' && (
              <RoommatePanel
                roommates={roommates}
                roommateInput={roommateInput}
                setRoommateInput={setRoommateInput}
                addRoommate={addRoommate}
                removeRoommate={removeRoommate}
                clearAllNames={clearAllNames}
                updateRoommate={updateRoommate}
              />
            )}

            {activeTab === 'split' && (
              <ExpensePanel
                desc={desc}
                setDesc={setDesc}
                amount={amount}
                setAmount={setAmount}
                expenseDate={expenseDate}
                setExpenseDate={setExpenseDate}
                paidBy={paidBy}
                setPaidBy={setPaidBy}
                roommates={roommates}
                splitAmong={splitAmong}
                setSplitAmong={setSplitAmong}
                addExpense={addExpense}
                editIndex={editIndex}
                cancelEdit={() => {
                  setEditIndex(null);
                  setDesc('');
                  setAmount('');
                  setExpenseDate('');
                  setPaidBy(roommates[0]?.name || '');
                  setSplitAmong(roommates.map((roommate) => ({ name: roommate.name, checked: true })));
                }}
                expenses={expenses}
                editExpense={editExpense}
                deleteExpense={deleteExpense}
                deleteAllExpenses={deleteAllExpenses}
              />
            )}

            {activeTab === 'brief' && <SummaryPanel summary={summary} />}

            {activeTab === 'detailed' && (
              <DetailedPanel
                roommates={roommates}
                expenses={expenses}
                showTransactions={showTransactions}
                setShowTransactions={setShowTransactions}
              />
            )}

            {activeTab === 'payment' && <Payment summary={summary} roommates={roommates} />}
          </section>
        </main>
      </div>
      <Footer />
      <ConfirmDialog
        confirm={confirm}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          confirm?.onYes?.();
          setConfirm(null);
        }}
         showOnlyOkay={confirm?.singleButton}
      />
    </div>
  );
}

export default App;
