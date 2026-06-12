export function getAllNames(roommates, expenses) {
  const allNamesSet = new Set(roommates);

  expenses.forEach((expense) => {
    allNamesSet.add(expense.paidBy);
    expense.splitAmong.forEach((name) => allNamesSet.add(name));
  });

  return Array.from(allNamesSet);
}

export function buildBalanceMatrix(names, expenses) {
  const matrix = Object.fromEntries(names.map((name) => [name, Object.fromEntries(names.map((other) => [other, 0]))]));

  expenses.forEach((expense) => {
    const share = expense.amount / expense.splitAmong.length;

    expense.splitAmong.forEach((name) => {
      if (name !== expense.paidBy) {
        matrix[name][expense.paidBy] += share;
      }
    });
  });

  names.forEach((first) => {
    names.forEach((second) => {
      if (first === second) return;

      const min = Math.min(matrix[first][second], matrix[second][first]);
      matrix[first][second] -= min;
      matrix[second][first] -= min;
    });
  });

  return matrix;
}

export function buildSummary(names, expenses) {
  const owes = Object.fromEntries(names.map((name) => [name, 0]));
  const gets = Object.fromEntries(names.map((name) => [name, 0]));

  expenses.forEach((expense) => {
    const share = expense.amount / expense.splitAmong.length;

    expense.splitAmong.forEach((name) => {
      if (name === expense.paidBy) {
        gets[expense.paidBy] += expense.amount - share;
      } else {
        owes[name] += share;
      }
    });
  });

  return names.map((name) => {
    const amountOwed = owes[name] || 0;
    const amountReceived = gets[name] || 0;

    return {
      name,
      owes: amountOwed,
      gets: amountReceived,
      net: amountReceived - amountOwed,
    };
  });
}
