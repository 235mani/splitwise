export function getRoommateMap(roommates) {
  return Object.fromEntries(
    roommates.map((roommate) => [
      roommate.id,
      roommate,
    ])
  );
}

export function getAllIds(roommates, expenses) {
  const ids = new Set(
    roommates.map((roommate) => roommate.id)
  );

  expenses.forEach((expense) => {
    ids.add(expense.paidBy);

    expense.splitAmong.forEach((id) =>
      ids.add(id)
    );
  });

  return Array.from(ids);
}

export function buildBalanceMatrix(
  roommateIds,
  expenses
) {
  const matrix = Object.fromEntries(
    roommateIds.map((id) => [
      id,
      Object.fromEntries(
        roommateIds.map((otherId) => [
          otherId,
          0,
        ])
      ),
    ])
  );

  expenses.forEach((expense) => {
    if (!expense.splitAmong.length) return;

    const share =
      expense.amount /
      expense.splitAmong.length;

    expense.splitAmong.forEach((roommateId) => {
      if (
        roommateId !== expense.paidBy
      ) {
        matrix[roommateId][expense.paidBy] +=
          share;
      }
    });
  });

  roommateIds.forEach((firstId) => {
    roommateIds.forEach((secondId) => {
      if (firstId === secondId) return;

      const min = Math.min(
        matrix[firstId][secondId],
        matrix[secondId][firstId]
      );

      matrix[firstId][secondId] -= min;
      matrix[secondId][firstId] -= min;
    });
  });

  return matrix;
}

export function buildSummary(
  roommates,
  expenses
) {
  const paid = Object.fromEntries(
    roommates.map((roommate) => [
      roommate.id,
      0,
    ])
  );

  const share = Object.fromEntries(
    roommates.map((roommate) => [
      roommate.id,
      0,
    ])
  );

  expenses.forEach((expense) => {
    if (!expense.splitAmong.length) return;

    const splitShare =
      expense.amount /
      expense.splitAmong.length;

    if (
      paid[expense.paidBy] !== undefined
    ) {
      paid[expense.paidBy] +=
        expense.amount;
    }

    expense.splitAmong.forEach((id) => {
      if (share[id] !== undefined) {
        share[id] += splitShare;
      }
    });
  });

  return roommates.map((roommate) => ({
    id: roommate.id,
    name: roommate.name,
    mobile: roommate.mobile,
    upiId: roommate.upiId,
    paid: paid[roommate.id] || 0,
    share: share[roommate.id] || 0,
    net:
      (paid[roommate.id] || 0) -
      (share[roommate.id] || 0),
  }));
}

export function getRoommateName(
  roommateMap,
  id
) {
  return (
    roommateMap[id]?.name ??
    'Unknown User'
  );
}

export function getRoommateById(
  roommateMap,
  id
) {
  return roommateMap[id] ?? null;
}