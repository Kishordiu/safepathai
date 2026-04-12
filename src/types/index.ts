export type SafetyStatus = 'safe' | 'monitoring' | 'suspicious' | 'high-risk' | 'emergency';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'route-deviation' | 'prolonged-stop' | 'inactivity' | 'geofence-breach' | 'school-exit' | 'pickup-mismatch' | 'device-offline' | 'connectivity-loss' | 'sos-triggered';
export type DeliveryChannel = 'app' | 'sms' | 'email' | 'call';
export type DeliveryStatus = 'sent' | 'delivered' | 'failed' | 'pending';
export type UserRole = 'parent' | 'school-admin' | 'super-admin';
export type DeviceType = 'badge' | 'pendant' | 'clip';
export type ConnectivityState = 'online' | 'offline' | 'weak-signal' | 'delayed-sync';
export type PickupStatus = 'verified' | 'pending' | 'mismatch' | 'flagged';

export interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  photoUrl: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  schoolAdminName: string;
  schoolAdminEmail: string;
  schoolAdminPhone: string;
  assignedWearableId: string;
  currentStatus: SafetyStatus;
  routineSchedule: RoutineSchedule;
  homeLocation: Coordinates;
  schoolLocation: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
  label?: string;
}

export interface RoutineSchedule {
  schoolStart: string;
  schoolEnd: string;
  expectedCommuteMins: number;
  daysOfWeek: string[];
}

export interface Wearable {
  id: string;
  deviceType: DeviceType;
  childId: string;
  childName: string;
  batteryLevel: number;
  signalStrength: number;
  firmwareVersion: string;
  lastSeen: string;
  connectivityState: ConnectivityState;
  status: 'active' | 'inactive' | 'replacement-needed';
}

export interface RouteData {
  childId: string;
  expectedRoute: Coordinates[];
  actualRoute: Coordinates[];
  stabilityScore: number;
  anomalyFlags: string[];
  stopPoints: StopPoint[];
  homeGeofence: Geofence;
  schoolGeofence: Geofence;
  travelTimeMins: number;
  expectedTravelTimeMins: number;
}

export interface StopPoint {
  location: Coordinates;
  durationMins: number;
  isExpected: boolean;
  label?: string;
}

export interface Geofence {
  center: Coordinates;
  radiusMeters: number;
  label: string;
  type: 'home' | 'school' | 'custom';
}

export interface Alert {
  id: string;
  childId: string;
  childName: string;
  type: AlertType;
  severity: AlertSeverity;
  confidence: number;
  timestamp: string;
  triggerReason: string;
  contributingConditions: string[];
  predictedRiskType: string;
  escalationState: 'new' | 'notified' | 'acknowledged' | 'resolved';
  isRead: boolean;
  trendStatus: 'escalating' | 'stable' | 'de-escalating';
  deliveries: AlertDelivery[];
}

export interface AlertDelivery {
  channel: DeliveryChannel;
  recipient: string;
  sentStatus: DeliveryStatus;
  deliveredStatus: DeliveryStatus;
  acknowledgedAt?: string;
}

export interface PickupRecord {
  id: string;
  childId: string;
  childName: string;
  authorizedPerson: string;
  pickupTime: string;
  verificationState: PickupStatus;
  mismatchFlag: boolean;
  notes?: string;
}

export interface Report {
  id: string;
  reportType: string;
  dateRange: { start: string; end: string };
  generatedBy: string;
  generatedAt: string;
  previewStatus: 'ready' | 'generating' | 'failed';
  downloadUrl?: string;
}
