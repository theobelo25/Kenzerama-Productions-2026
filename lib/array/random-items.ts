export function getRandomItems<T>(arr: T[], numItems: number) {
  const shuffled = [...arr];
  let currentIndex = shuffled.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled.slice(0, numItems);
}
