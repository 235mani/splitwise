import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import RoommatePanel from './components/RoommatePanel';
import ExpensePanel from './components/ExpensePanel';
import DetailedPanel from './components/DetailedPanel';
import ConfirmDialog from './components/ConfirmDialog';
import { buildSummary } from './utils/expenseLogic';
import { useSwipeable } from "react-swipeable";
import Payment from './components/Payment';
import Footer from './components/Footer';

const defaultRoommates = [];

const createRoommate = (
  name,
  mobile = '',
  upiId = ''
) => ({
  id: Date.now().toString() +
      Math.random()
        .toString(36)
        .substring(2, 9),
  name,
  mobile,
  upiId,
});

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
  const [paidBy, setPaidBy] = useState('');
  const [activeTab, setActiveTab] = useState('names');
  const tabOrder = [ 'names','split', 'detailed', 'payment'];
  const [showTransactions, setShowTransactions] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('splitwise_roommates', JSON.stringify(roommates));
  }, [roommates]);

  useEffect(() => {
    localStorage.setItem('splitwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (
      roommates.length &&
      !roommates.some((r) => r.id === paidBy)
    ) {
      setPaidBy(roommates[0]?.id);
    }
  }, [roommates, paidBy]);

  const splitSelected = useMemo(() => {
    return roommates.map((roommate) => ({
      id: roommate.id,
      checked: true,
    }));
  }, [roommates]);

  const [splitAmong, setSplitAmong] = useState(splitSelected);

  useEffect(() => {
    setSplitAmong(
      roommates.map((roommate) => ({
        id: roommate.id,
        name: roommate.name,
        checked: true,
      }))
    );
  }, [roommates]);

  const summary = useMemo(
    () => buildSummary(roommates, expenses),
    [roommates, expenses]
  );

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
    setRoommates([
      ...roommates,
      createRoommate(
        name.trim(),
        mobile,
        upiId
      ),
    ]);
    setRoommateInput({ name: '', mobile: '', upiId: '' });
  };

  const removeRoommate = (idx) => {
    const roommate = roommates[idx];

    const hasExpenses =
      expenses.some(
        (expense) =>
          expense.paidBy === roommate.id ||
          expense.splitAmong.includes(
            roommate.id
          )
      );

    if (hasExpenses) {
      setConfirm({
        title: `Cannot delete roommate '${roommate.name}'`,
        message:
           `'${roommate.name}' has associated expenses. Delete those expenses before removing the roommate.`,
        singleButton: true,
      });

      return;
    }

    setConfirm({
      title: 'Remove roommate?',
      message: `Remove ${roommate.name}?`,
      onYes: () => {
        setRoommates(
          roommates.filter(
            (_, i) => i !== idx
          )
        );
        setConfirm(null);
      },
    });
  };

  const clearAllNames = () => {
    setConfirm({
      title: 'Delete all roommates?',
      message: 'This will remove all roommates and all expenses.',
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
    const selected = splitAmong.filter((item) => item.checked).map((item) => item.id);
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
    setDesc(''); setAmount(''); setExpenseDate(''); setPaidBy(roommates[0]?.id || '');
    setSplitAmong(roommates.map((roommate) => ({ id: roommate.id, name: roommate.name, checked: true })));
  };

  const editExpense = (idx) => {
    const item = expenses[idx];
    setEditIndex(idx);
    setDesc(item.desc);
    setAmount(String(item.amount));
    setExpenseDate(item.date || '');
    setPaidBy(item.paidBy);
    setSplitAmong(roommates.map((roommate) => ({ id: roommate.id, name: roommate.name, checked: item.splitAmong.includes(roommate.id) })));
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
      prev.map((roommate) =>
        roommate.id === idx
          ? {
            ...roommate,
            ...updatedRoommate,
          }
          : roommate
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

  return (
    <div className="min-h-screen text-slate-800" {...handlers}>
      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-10 md:px-6 xl:px-0">
        <main>
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
                  setPaidBy(roommates[0]?.id || '');
                  setSplitAmong(roommates.map((roommate) => ({ id: roommate.id, name: roommate.name, checked: true })));
                }}
                expenses={expenses}
                editExpense={editExpense}
                deleteExpense={deleteExpense}
                deleteAllExpenses={deleteAllExpenses}
              />
            )}

            {activeTab === 'detailed' && (
              <DetailedPanel
                roommates={roommates}
                expenses={expenses}
                showTransactions={showTransactions}
                setShowTransactions={setShowTransactions}
              />
            )}

            {activeTab === 'payment' && <Payment summary={summary} roommates={roommates} setActiveTab={setActiveTab} />}
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
