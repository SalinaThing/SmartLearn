export async function generateLast12MonthsAnalytics(model) {
  const last12Months = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Set to the first day of the month

  const promises = [];

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28,
    );

    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28,
    );

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    promises.push(
      model.countDocuments({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      }).then(count => ({ monthYear, count }))
    );
  }

  // Execute all 12 MongoDB queries concurrently to eliminate blocking network delays!
  const results = await Promise.all(promises);
  last12Months.push(...results);

  return last12Months;
}
