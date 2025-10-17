'use server';

import { auth } from '@/auth';

type AtlasInfo = {
  ok: boolean;
  configured: boolean;
  message?: string;
  instanceSizeName?: string; // e.g., M0, M10
  providerName?: string; // AWS/GCP/AZURE
  clusterName?: string;
  mongoDBVersion?: string;
  stateName?: string; // IDLE, CREATING, etc.
};

export async function getAtlasClusterInfo(): Promise<AtlasInfo> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false, configured: false, message: 'UNAUTHORIZED' };
  }

  const publicKey = process.env.ATLAS_PUBLIC_KEY;
  const privateKey = process.env.ATLAS_PRIVATE_KEY;
  const groupId = process.env.ATLAS_GROUP_ID; // Project ID
  const clusterName = process.env.ATLAS_CLUSTER_NAME;

  if (!publicKey || !privateKey || !groupId || !clusterName) {
    return { ok: false, configured: false, message: 'MISSING_ENV' };
  }

  try {
    const authHeader = Buffer.from(`${publicKey}:${privateKey}`).toString('base64');
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}/clusters/${encodeURIComponent(clusterName)}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      // Reasonable timeout via AbortController is possible; skip to keep minimal
      // Atlas API is public internet; no credentials exposed in logs
    });

    if (!res.ok) {
      return { ok: false, configured: true, message: `HTTP_${res.status}` };
    }
    const data = (await res.json()) as any;
    const instanceSizeName: string | undefined = data?.providerSettings?.instanceSizeName;
    const providerName: string | undefined = data?.providerSettings?.providerName;
    const mongoDBVersion: string | undefined = data?.mongoDBVersion;
    const stateName: string | undefined = data?.stateName;

    return {
      ok: true,
      configured: true,
      instanceSizeName,
      providerName,
      clusterName,
      mongoDBVersion,
      stateName,
    };
  } catch {
    return { ok: false, configured: true, message: 'REQUEST_FAILED' };
  }
}


