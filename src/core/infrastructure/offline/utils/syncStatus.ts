export function getSyncStatusLabel(status: string): string {
  switch (status) {
    case 'syncing':
      return 'Syncing';
    case 'success':
      return 'Synced';
    case 'failed':
      return 'Sync failed';
    case 'conflict':
      return 'Sync conflict';
    case 'idle':
    default:
      return '';
  }
}

export function getSyncStatusColor(status: string): string {
  switch (status) {
    case 'syncing':
      return '#92400e';
    case 'success':
      return '#166534';
    case 'failed':
      return '#991b1b';
    case 'conflict':
      return '#92400e';
    case 'idle':
    default:
      return '#64748b';
  }
}

export function getSyncStatusIcon(status: string): string {
  switch (status) {
    case 'syncing':
      return '⟳';
    case 'success':
      return '✓';
    case 'failed':
      return '✕';
    case 'conflict':
      return '⚠';
    case 'idle':
    default:
      return '';
  }
}

export function formatSyncResult(result: {
  total: number;
  succeeded: number;
  failed: number;
  conflicts: number;
}): string {
  const parts: string[] = [];

  if (result.succeeded > 0) {
    parts.push(`${result.succeeded} synced`);
  }
  if (result.failed > 0) {
    parts.push(`${result.failed} failed`);
  }
  if (result.conflicts > 0) {
    parts.push(`${result.conflicts} conflicts`);
  }

  if (parts.length === 0) {
    return 'No changes to sync';
  }

  return parts.join(', ');
}
