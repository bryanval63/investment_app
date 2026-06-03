export const findLastItemByDate = <T extends { date: Date }>(items: T[]): T => {
  return items.reduce((latest, current) => {
    const currentDate = new Date(current.date).getTime();
    const latestDate = new Date(latest.date).getTime();

    return currentDate > latestDate ? current : latest;
  });
};

export const findFirstItemByDate = <T extends { date: Date }>(
  items: T[],
): T => {
  return items.reduce((first, current) => {
    const currentDate = new Date(current.date).getTime();
    const firstDate = new Date(first.date).getTime();

    return currentDate < firstDate ? current : first;
  });
};

export const findSecondLastItemByDate = <T extends { date: Date }>(
  items: T[],
): T | null => {
  if (items.length < 2) return null;

  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[1];
};
