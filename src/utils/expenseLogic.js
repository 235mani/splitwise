export function getAllNames(roommates, expenses) {
  const allNamesSet = new Set(
    roommates.map((r) =>
      typeof r === 'string'
        ? r
        : r.name
    )
  );

  expenses.forEach((expense) => {
    allNamesSet.add(expense.paidBy);

    expense.splitAmong.forEach((name) =>
      allNamesSet.add(name)
    );
  });

  return Array.from(allNamesSet);
}

export function buildBalanceMatrix(
  names,
  expenses
) {
  const matrix = Object.fromEntries(
    names.map((name) => [
      name,
      Object.fromEntries(
        names.map((other) => [other, 0])
      ),
    ])
  );

  expenses.forEach((expense) => {
    const share =
      expense.amount /
      expense.splitAmong.length;

    expense.splitAmong.forEach((name) => {
      if (name !== expense.paidBy) {
        matrix[name][expense.paidBy] +=
          share;
      }
    });
  });

  names.forEach((first) => {
    names.forEach((second) => {
      if (first === second) return;

      const min = Math.min(
        matrix[first][second],
        matrix[second][first]
      );

      matrix[first][second] -= min;
      matrix[second][first] -= min;
    });
  });

  return matrix;
}

export function buildSummary(
  names,
  expenses
) {
  const paid = Object.fromEntries(
    names.map((name) => [name, 0])
  );

  const share = Object.fromEntries(
    names.map((name) => [name, 0])
  );

  expenses.forEach((expense) => {
    const splitShare =
      expense.amount /
      expense.splitAmong.length;

    paid[expense.paidBy] +=
      expense.amount;

    expense.splitAmong.forEach((name) => {
      share[name] += splitShare;
    });
  });

  return names.map((name) => ({
    name,
    paid: paid[name],
    share: share[name],
    net: paid[name] - share[name],
  }));
}