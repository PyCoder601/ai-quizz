export function getRemainingTime(lastReset: string): string {
  const resetDate = new Date(lastReset);
  const nextReset = new Date(resetDate.getTime() + 5 * 60 * 60 * 1000); // + 5 heures
  const now = new Date();

  const diffMs = nextReset.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Quota réinitialisé.';
  }

  const diffH = Math.floor(diffMs / (1000 * 60 * 60));

  return `Revenez dans ${diffH}h`;
}
