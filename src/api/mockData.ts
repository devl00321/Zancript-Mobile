// Mock data for Zancrypt Mobile UI

export const mockUser = {
  id: 'usr_1',
  displayName: 'Wahid',
  email: 'wahid@zancrypt.com',
};

export const mockMetrics = {
  filesStored: 47,
  filesAddedToday: 2,
  totalShards: 423,
  activeNodes: 6,
  totalNodes: 6,
  storageUsedGB: 2.3,
  storageTotalGB: 5.0,
};

export const mockNodes = [
  { id: 'n1', name: 'node-mumbai-01', provider: 'Oracle', region: 'Asia South', status: 'online', uptime: 99.6, latency: 42 },
  { id: 'n2', name: 'node-frankfurt-01', provider: 'GCP', region: 'Europe West', status: 'online', uptime: 100, latency: 61 },
  { id: 'n3', name: 'node-singapore-01', provider: 'Oracle', region: 'Asia East', status: 'online', uptime: 98, latency: 38 },
  { id: 'n4', name: 'node-oregon-01', provider: 'AWS', region: 'US West', status: 'online', uptime: 97, latency: 89 },
  { id: 'n5', name: 'node-tokyo-01', provider: 'Fly.io', region: 'Asia NE', status: 'degraded', uptime: 87.5, latency: 999 }, // 999 = timeout
  { id: 'n6', name: 'node-amsterdam-01', provider: 'Hetzner', region: 'Europe NW', status: 'online', uptime: 100, latency: 55 },
];

export const mockAuditLogs = [
  { id: 'a1', action: 'UPLOAD', file: 'quarterly-report.pdf', sub: '3 shards · 6 nodes', time: '14:32' },
  { id: 'a2', action: 'DOWNLOAD', file: 'invoice-march.pdf', sub: 'decrypted locally', time: '14:31' },
  { id: 'a3', action: 'SHARE', file: 'contract-draft.docx', sub: 'HTML wrapper · 24h', time: '12:00' },
];

export const mockFiles = [
  { id: 'f1', encrypted_filename: 'enc_8f72.bin', size: '4.2 MB', type: 'PDF', shards: 6, status: ['online','online','online','online','online','offline'] },
  { id: 'f2', encrypted_filename: 'enc_3b91.bin', size: '310 KB', type: 'PDF', shards: 6, status: ['online','online','online','online','online','online'] },
  { id: 'f3', encrypted_filename: 'enc_c44a.bin', size: '88 KB', type: 'DOCX', shards: 6, status: ['online','online','online','online','online','online'] },
  { id: 'f4', encrypted_filename: 'enc_991f.bin', size: '2.1 MB', type: 'PNG', shards: 6, status: ['online','online','online','online','online','online'] },
  { id: 'f5', encrypted_filename: 'enc_002b.bin', size: '48 MB', type: 'MP4', shards: 10, status: ['online','online','online','online','online','online'] },
];

// Mapping to decrypt mock files client side
export const mockDecryptedNames: Record<string, string> = {
  'enc_8f72.bin': 'quarterly-report.pdf',
  'enc_3b91.bin': 'invoice-march.pdf',
  'enc_c44a.bin': 'contract-draft.docx',
  'enc_991f.bin': 'product-mockup.png',
  'enc_002b.bin': 'demo-recording.mp4',
};

export const mockSecurityEvents = [
  { id: 'e1', severity: 'low', title: 'Passkey registered', detail: 'MacBook Pro · May 18, 2026' },
  { id: 'e2', severity: 'medium', title: 'Login from new IP', detail: '102.88.x.x · May 20, 2026' },
  { id: 'e3', severity: 'low', title: 'File shared', detail: 'contract-draft.docx · 24h link' },
  { id: 'e4', severity: 'high', title: 'Multiple failed attempts', detail: '3 invalid access key tries' },
];

export const mockSessions = [
  { id: 's1', device: 'desktop', name: 'MacBook Pro', detail: '102.88.x.x · Just now', current: true },
  { id: 's2', device: 'mobile', name: 'iPhone 15', detail: '102.88.x.x · 2h ago', current: false },
];
