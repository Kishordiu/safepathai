import { useEffect, useMemo, useState } from 'react';
import { supabase, hasSupabaseConfig } from '@/lib/supabase';
import type { Alert, AlertDelivery, Child, Coordinates, PickupRecord, RouteData, Wearable } from '@/types';

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  mobile_number: string | null;
  role: 'parent' | 'school_admin' | 'super_admin';
  school_name: string | null;
};

type ChildRow = {
  id: string;
  name: string;
  age: number | null;
  grade: string | null;
  school_name: string;
  parent_id: string;
  status: string | null;
  home_lat: number | null;
  home_lng: number | null;
  school_lat: number | null;
  school_lng: number | null;
  routine_schedule: string | null;
};

type DeviceRow = {
  id: string;
  child_id: string;
  device_type: string | null;
  battery_level: number | null;
  signal_strength: string | null;
  firmware_version: string | null;
  last_seen: string | null;
  status: string | null;
};

type AlertRow = {
  id: string;
  child_id: string;
  severity: string | null;
  title: string | null;
  message: string | null;
  reason: string | null;
  confidence: number | null;
  acknowledged: boolean | null;
  created_at: string;
};

type AlertDeliveryRow = {
  alert_id: string;
  channel: string;
  recipient_value: string;
  status: string;
  sent_at: string | null;
};

type PickupRow = {
  id: string;
  child_id: string;
  picked_up_by: string | null;
  verifier_name: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
};

type SafeZoneRow = {
  child_id: string;
  zone_name: string;
  zone_type: string;
  center_lat: number;
  center_lng: number;
  radius_meters: number;
};

type LocationLogRow = {
  child_id: string;
  latitude: number;
  longitude: number;
  motion_state?: string | null;
  inactivity_seconds?: number | null;
  network_status?: string | null;
  device_status?: string | null;
  created_at: string;
};

type RouteProfileRow = {
  child_id: string;
  route_name: string;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
  expected_duration_minutes: number | null;
};

type TimelineEvent = {
  time: string;
  event: string;
  status: 'safe' | 'monitoring' | 'suspicious' | 'high-risk' | 'emergency';
  icon: 'route' | 'stop' | 'alert' | 'pickup';
};

const emptyState = {
  children: [] as Child[],
  wearables: [] as Wearable[],
  alerts: [] as Alert[],
  routes: [] as RouteData[],
  pickupRecords: [] as PickupRecord[],
  timelineEvents: [] as TimelineEvent[],
};

export function useAppData() {
  const [state, setState] = useState(emptyState);
  const [loading, setLoading] = useState<boolean>(hasSupabaseConfig);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const load = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;
        if (!user) {
          if (active) {
            setState(emptyState);
            setLoading(false);
          }
          return;
        }

        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, mobile_number, role, school_name')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!active) return;
        setProfile(profileRow as ProfileRow);

        let childrenQuery = supabase.from('children').select('*').order('created_at', { ascending: false });
        if (profileRow.role === 'parent') {
          childrenQuery = childrenQuery.eq('parent_id', user.id);
        } else if (profileRow.role === 'school_admin') {
          childrenQuery = childrenQuery.eq('school_name', profileRow.school_name ?? '');
        }

        const { data: childRows, error: childError } = await childrenQuery;
        if (childError) throw childError;

        const children = (childRows ?? []) as ChildRow[];
        const childIds = children.map((c) => c.id);
        if (!childIds.length) {
          if (active) {
            setState(emptyState);
            setLoading(false);
          }
          return;
        }

        const parentIds = [...new Set(children.map((c) => c.parent_id))];
        const schoolNames = [...new Set(children.map((c) => c.school_name).filter(Boolean))];

        const [
          { data: deviceRows, error: deviceError },
          { data: alertRows, error: alertError },
          { data: deliveryRows, error: deliveryError },
          { data: pickupRows, error: pickupError },
          { data: locationRows, error: locationError },
          { data: zoneRows, error: zoneError },
          { data: routeRows, error: routeError },
          { data: parentProfiles, error: parentProfilesError },
          { data: schoolAdmins, error: schoolAdminError },
        ] = await Promise.all([
          supabase.from('devices').select('*').in('child_id', childIds),
          supabase.from('alerts').select('*').in('child_id', childIds).order('created_at', { ascending: false }),
          supabase.from('alert_deliveries').select('alert_id, channel, recipient_value, status, sent_at'),
          supabase.from('pickup_records').select('*').in('child_id', childIds).order('created_at', { ascending: false }),
          supabase.from('location_logs').select('child_id, latitude, longitude, motion_state, inactivity_seconds, network_status, device_status, created_at').in('child_id', childIds).order('created_at', { ascending: true }),
          supabase.from('safe_zones').select('child_id, zone_name, zone_type, center_lat, center_lng, radius_meters').in('child_id', childIds),
          supabase.from('route_profiles').select('child_id, route_name, start_lat, start_lng, end_lat, end_lng, expected_duration_minutes').in('child_id', childIds),
          parentIds.length ? supabase.from('profiles').select('id, full_name, email, mobile_number').in('id', parentIds) : Promise.resolve({ data: [], error: null } as any),
          schoolNames.length ? supabase.from('profiles').select('full_name, email, mobile_number, school_name').eq('role', 'school_admin').in('school_name', schoolNames) : Promise.resolve({ data: [], error: null } as any),
        ]);

        [deviceError, alertError, deliveryError, pickupError, locationError, zoneError, routeError, parentProfilesError, schoolAdminError].forEach((err) => {
          if (err) throw err;
        });

        const parentMap = new Map((parentProfiles ?? []).map((p: any) => [p.id, p]));
        const schoolAdminMap = new Map((schoolAdmins ?? []).map((p: any) => [p.school_name, p]));
        const childNameById = new Map(children.map((c) => [c.id, c.name]));
        const zoneMap = groupBy((zoneRows ?? []) as SafeZoneRow[], 'child_id');
        const routeMap = groupBy((routeRows ?? []) as RouteProfileRow[], 'child_id');
        const logsMap = groupBy((locationRows ?? []) as LocationLogRow[], 'child_id');
        const alertMap = groupBy((alertRows ?? []) as AlertRow[], 'child_id');
        const pickupMap = groupBy((pickupRows ?? []) as PickupRow[], 'child_id');
        const deliveryMap = groupBy((deliveryRows ?? []) as AlertDeliveryRow[], 'alert_id');

        const mappedChildren: Child[] = children.map((row) => {
          const parent = parentMap.get(row.parent_id) as any;
          const schoolAdmin = schoolAdminMap.get(row.school_name) as any;
          return {
            id: row.id,
            name: row.name,
            age: row.age ?? 0,
            grade: row.grade ?? 'Student',
            school: row.school_name,
            photoUrl: '',
            parentId: row.parent_id,
            parentName: parent?.full_name ?? 'Registered Parent',
            parentEmail: parent?.email ?? '',
            parentPhone: parent?.mobile_number ?? '',
            schoolAdminName: schoolAdmin?.full_name ?? 'School Admin',
            schoolAdminEmail: schoolAdmin?.email ?? '',
            schoolAdminPhone: schoolAdmin?.mobile_number ?? '',
            assignedWearableId: '',
            currentStatus: statusMap(row.status),
            routineSchedule: parseRoutineSchedule(row.routine_schedule),
            homeLocation: { lat: row.home_lat ?? 12.9716, lng: row.home_lng ?? 80.2212, label: 'Home' },
            schoolLocation: { lat: row.school_lat ?? 12.938, lng: row.school_lng ?? 80.141, label: row.school_name },
          };
        });

        const mappedWearables: Wearable[] = ((deviceRows ?? []) as DeviceRow[]).map((row) => ({
          id: row.id,
          deviceType: normalizeDeviceType(row.device_type),
          childId: row.child_id,
          childName: childNameById.get(row.child_id) ?? 'Assigned child',
          batteryLevel: row.battery_level ?? 0,
          signalStrength: signalToPercent(row.signal_strength),
          firmwareVersion: row.firmware_version ?? 'v1.0.0',
          lastSeen: row.last_seen ?? new Date().toISOString(),
          connectivityState: deviceStatusMap(row.status),
          status: row.status === 'offline' ? 'inactive' : 'active',
        }));

        const mappedAlerts: Alert[] = ((alertRows ?? []) as AlertRow[]).map((row) => ({
          id: row.id,
          childId: row.child_id,
          childName: childNameById.get(row.child_id) ?? 'Student',
          type: inferAlertType(row.title, row.reason, row.message),
          severity: severityMap(row.severity),
          confidence: row.confidence ?? 75,
          timestamp: row.created_at,
          triggerReason: row.message ?? row.title ?? 'Alert raised',
          contributingConditions: [row.reason ?? row.message ?? 'Safety anomaly detected'],
          predictedRiskType: row.title ?? 'Risk Event',
          escalationState: row.acknowledged ? 'acknowledged' : 'notified',
          isRead: !!row.acknowledged,
          trendStatus: row.severity === 'critical' ? 'escalating' : row.severity === 'high' ? 'stable' : 'de-escalating',
          deliveries: ((deliveryMap.get(row.id) ?? []) as AlertDeliveryRow[]).map(mapDelivery),
        }));

        const mappedPickups: PickupRecord[] = ((pickupRows ?? []) as PickupRow[]).map((row) => ({
          id: row.id,
          childId: row.child_id,
          childName: childNameById.get(row.child_id) ?? 'Student',
          authorizedPerson: row.picked_up_by ?? 'Authorized Contact',
          pickupTime: row.created_at,
          verificationState: pickupStatusMap(row.status),
          mismatchFlag: row.status === 'mismatch',
          notes: row.notes ?? '',
        }));

        const mappedRoutes = mappedChildren.map((child) => buildRouteForChild(child, logsMap.get(child.id) ?? [], zoneMap.get(child.id) ?? [], (routeMap.get(child.id) ?? [])[0]));
        const timelineEvents = buildTimeline(mappedChildren, (locationRows ?? []) as LocationLogRow[], mappedAlerts, mappedPickups);
        const enrichedChildren = mappedChildren.map((child) => ({
          ...child,
          assignedWearableId: mappedWearables.find((w) => w.childId === child.id)?.id ?? '',
        }));

        if (!active) return;
        setState({
          children: enrichedChildren,
          wearables: mappedWearables,
          alerts: mappedAlerts,
          routes: mappedRoutes,
          pickupRecords: mappedPickups,
          timelineEvents,
        });
      } catch (error) {
        console.error('SafePath data loading error', error);
        if (active) setState(emptyState);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    const channelName = `safepath-live-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'location_logs' }, () => load())
      .subscribe();

    return () => {
      active = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return {
    ...state,
    loading,
    usingMockData: false,
    profile,
  };
}

function mapDelivery(row: AlertDeliveryRow): AlertDelivery {
  const status = row.status === 'queued' ? 'pending' : normalizeDeliveryStatus(row.status);
  return {
    channel: normalizeChannel(row.channel),
    recipient: row.recipient_value,
    sentStatus: status,
    deliveredStatus: status,
    acknowledgedAt: row.sent_at ?? undefined,
  };
}

function buildRouteForChild(child: Child, logs: LocationLogRow[], zones: SafeZoneRow[], routeProfile?: RouteProfileRow): RouteData {
  const orderedLogs = [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const actualRoute: Coordinates[] = orderedLogs.map((log) => ({ lat: log.latitude, lng: log.longitude }));
  const expectedRoute = routeProfile?.start_lat && routeProfile?.end_lat
    ? buildExpectedRoute(
        { lat: routeProfile.start_lat, lng: routeProfile.start_lng ?? child.homeLocation.lng, label: 'Start' },
        { lat: routeProfile.end_lat, lng: routeProfile.end_lng ?? child.schoolLocation.lng, label: 'End' },
      )
    : [];

  const stopPoints = orderedLogs
    .filter((log) => (log.inactivity_seconds ?? 0) >= 30)
    .map((log, idx) => ({
      location: { lat: log.latitude, lng: log.longitude },
      durationMins: Math.max(1, Math.round((log.inactivity_seconds ?? 0) / 60)),
      isExpected: false,
      label: idx === 0 ? 'Observed stop' : `Stop ${idx + 1}`,
    }));

  const anomalyFlags = deriveAnomalies(orderedLogs);
  const travelTimeMins = orderedLogs.length > 1
    ? Math.max(1, Math.round((new Date(orderedLogs.at(-1)!.created_at).getTime() - new Date(orderedLogs[0].created_at).getTime()) / 60000))
    : child.routineSchedule.expectedCommuteMins;

  const homeZone = zones.find((zone) => zone.zone_type === 'home');
  const schoolZone = zones.find((zone) => zone.zone_type === 'school');

  return {
    childId: child.id,
    expectedRoute,
    actualRoute,
    stabilityScore: actualRoute.length ? (anomalyFlags.length ? 72 : 96) : 0,
    anomalyFlags,
    stopPoints,
    homeGeofence: {
      center: homeZone ? { lat: homeZone.center_lat, lng: homeZone.center_lng, label: homeZone.zone_name } : child.homeLocation,
      radiusMeters: homeZone?.radius_meters ?? 150,
      label: homeZone?.zone_name ?? 'Home Zone',
      type: 'home',
    },
    schoolGeofence: {
      center: schoolZone ? { lat: schoolZone.center_lat, lng: schoolZone.center_lng, label: schoolZone.zone_name } : child.schoolLocation,
      radiusMeters: schoolZone?.radius_meters ?? 200,
      label: schoolZone?.zone_name ?? 'School Zone',
      type: 'school',
    },
    travelTimeMins,
    expectedTravelTimeMins: routeProfile?.expected_duration_minutes ?? child.routineSchedule.expectedCommuteMins,
  };
}

function buildExpectedRoute(home: Coordinates, school: Coordinates): Coordinates[] {
  const mid1 = { lat: home.lat + (school.lat - home.lat) * 0.28, lng: home.lng + (school.lng - home.lng) * 0.25 };
  const mid2 = { lat: home.lat + (school.lat - home.lat) * 0.58, lng: home.lng + (school.lng - home.lng) * 0.56 };
  const mid3 = { lat: home.lat + (school.lat - home.lat) * 0.8, lng: home.lng + (school.lng - home.lng) * 0.82 };
  return [home, mid1, mid2, mid3, school];
}

function buildTimeline(children: Child[], logs: LocationLogRow[], alerts: Alert[], pickups: PickupRecord[]): TimelineEvent[] {
  const childNameById = new Map(children.map((child) => [child.id, child.name]));
  const items: Array<{ time: string; event: string; status: TimelineEvent['status']; icon: TimelineEvent['icon']; ts: number }> = [];

  logs.slice(-6).forEach((log) => {
    items.push({
      time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: `${childNameById.get(log.child_id) ?? 'Child'} • ${timelineLabel(log)}`,
      status: (log.inactivity_seconds ?? 0) >= 30 ? 'monitoring' : 'safe',
      icon: (log.inactivity_seconds ?? 0) >= 30 ? 'stop' : 'route',
      ts: new Date(log.created_at).getTime(),
    });
  });

  alerts.slice(0, 4).forEach((alert) => {
    items.push({
      time: new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: `${alert.childName} • ${alert.title ?? alert.triggerReason}`,
      status: alert.severity === 'critical' ? 'emergency' : alert.severity === 'high' ? 'high-risk' : 'suspicious',
      icon: 'alert',
      ts: new Date(alert.timestamp).getTime(),
    });
  });

  pickups.slice(0, 3).forEach((pickup) => {
    items.push({
      time: new Date(pickup.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: `${pickup.childName} • Pickup ${pickup.verificationState}`,
      status: pickup.mismatchFlag ? 'suspicious' : 'safe',
      icon: 'pickup',
      ts: new Date(pickup.pickupTime).getTime(),
    });
  });

  return items.sort((a, b) => b.ts - a.ts).slice(0, 8).map(({ ts, ...rest }) => rest);
}

function timelineLabel(log: LocationLogRow) {
  if ((log.inactivity_seconds ?? 0) >= 30) return `Observed stop for ${Math.max(1, Math.round((log.inactivity_seconds ?? 0) / 60))} min`;
  if (/walk/i.test(log.motion_state ?? '')) return 'Moving along active route';
  if (/slow|idle|still/i.test(log.motion_state ?? '')) return 'Reduced motion detected';
  return 'Location update received';
}

function deriveAnomalies(logs: LocationLogRow[]) {
  const flags = new Set<string>();
  if (logs.some((log) => (log.inactivity_seconds ?? 0) >= 30)) flags.add('prolonged-stop');
  if (logs.some((log) => /still|idle|slow/i.test(log.motion_state ?? ''))) flags.add('motion-anomaly');
  if (logs.some((log) => /offline|delayed/i.test(log.network_status ?? '') || /offline|delayed/i.test(log.device_status ?? ''))) flags.add('device-offline');
  return [...flags];
}

function parseRoutineSchedule(value: string | null) {
  const fallback = {
    schoolStart: '08:00',
    schoolEnd: '15:00',
    expectedCommuteMins: 20,
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  };
  if (!value) return fallback;
  const match = value.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)?/i);
  if (!match) return { ...fallback, schoolStart: '07:45', schoolEnd: '08:20', expectedCommuteMins: 35 };
  return {
    schoolStart: to24h(match[1], match[2]),
    schoolEnd: to24h(match[3], match[4]),
    expectedCommuteMins: 35,
    daysOfWeek: fallback.daysOfWeek,
  };
}

function to24h(time: string, suffix?: string) {
  if (!suffix) return time;
  let [hours, minutes] = time.split(':').map(Number);
  const upper = suffix.toUpperCase();
  if (upper === 'PM' && hours < 12) hours += 12;
  if (upper === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function statusMap(status?: string | null): Child['currentStatus'] {
  switch (status) {
    case 'monitoring':
      return 'monitoring';
    case 'suspicious':
      return 'suspicious';
    case 'high_risk':
    case 'high-risk':
      return 'high-risk';
    case 'emergency':
      return 'emergency';
    default:
      return 'safe';
  }
}

function deviceStatusMap(status?: string | null): Wearable['connectivityState'] {
  switch (status) {
    case 'online':
      return 'online';
    case 'syncing':
      return 'delayed-sync';
    case 'delayed_sync':
      return 'delayed-sync';
    default:
      return 'offline';
  }
}

function signalToPercent(signal?: string | null) {
  if (!signal) return 78;
  if (/excellent/i.test(signal)) return 96;
  if (/good/i.test(signal)) return 82;
  if (/weak/i.test(signal)) return 49;
  return 72;
}

function severityMap(value?: string | null): Alert['severity'] {
  if (value === 'critical') return 'critical';
  if (value === 'high') return 'high';
  if (value === 'medium') return 'medium';
  return 'low';
}

function inferAlertType(title?: string | null, reason?: string | null, message?: string | null): Alert['type'] {
  const source = `${title ?? ''} ${reason ?? ''} ${message ?? ''}`.toLowerCase();
  if (source.includes('pickup')) return 'pickup-mismatch';
  if (source.includes('inactive')) return 'inactivity';
  if (source.includes('offline') || source.includes('connect')) return 'device-offline';
  if (source.includes('stop')) return 'prolonged-stop';
  if (source.includes('school')) return 'school-exit';
  return 'route-deviation';
}

function pickupStatusMap(status?: string | null): PickupRecord['verificationState'] {
  switch (status) {
    case 'verified':
      return 'verified';
    case 'mismatch':
      return 'mismatch';
    default:
      return 'pending';
  }
}

function normalizeChannel(channel: string): AlertDelivery['channel'] {
  return ['app', 'sms', 'email', 'call'].includes(channel) ? (channel as AlertDelivery['channel']) : 'app';
}

function normalizeDeliveryStatus(status: string): AlertDelivery['deliveredStatus'] {
  if (status === 'delivered') return 'delivered';
  if (status === 'failed') return 'failed';
  return 'sent';
}

function normalizeDeviceType(deviceType?: string | null): Wearable['deviceType'] {
  return deviceType === 'badge' || deviceType === 'clip' ? deviceType : 'pendant';
}

function groupBy<T extends Record<string, any>>(items: T[], key: keyof T) {
  const map = new Map<any, T[]>();
  items.forEach((item) => {
    const groupKey = item[key];
    const group = map.get(groupKey) ?? [];
    group.push(item);
    map.set(groupKey, group);
  });
  return map;
}
