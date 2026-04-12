import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Lock, Mic } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CHILD_ID = "9b2baa4b-8d74-46b9-b072-a757fca86b43";
const ACCESS_CODE = "1215";
const WINDOW_SECONDS = 60;

type VoiceLevelRow = {
  id: string;
  child_id: string;
  avg_level: number;
  peak_level: number;
  created_at: string;
};

type GuardianSessionRow = {
  id: string;
  expires_at: string;
  status: string;
};

function WaveBars({
  samples,
  active,
}: {
  samples: number[];
  active: boolean;
}) {
  const normalized = samples.length
    ? samples.map((v) => Math.max(6, Math.min(100, v / 45)))
    : Array.from({ length: 48 }, () => 6);

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-safe">
      <h2 className="mb-4 text-lg font-semibold">Live Voice Wave</h2>

      <div className="flex h-[240px] items-center justify-center overflow-hidden rounded-2xl border bg-background px-4">
        <div className="flex h-[180px] w-full items-center justify-center gap-[6px]">
          {normalized.map((value, index) => (
            <div
              key={index}
              className="w-[4px] rounded-full bg-foreground/80 transition-all duration-150"
              style={{
                height: `${value}%`,
                opacity: active ? 0.95 : 0.25,
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {active
          ? "Wave bars react to live microphone intensity while the secure window is active."
          : "Enter the code to activate the microphone window and waveform."}
      </p>
    </div>
  );
}

export default function VoiceMonitor() {
  const [rows, setRows] = useState<VoiceLevelRow[]>([]);
  const [avgLevel, setAvgLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);

  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");

  const timerRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

  const loadLatestVoiceRows = async () => {
    const { data, error } = await supabase
      .from("voice_levels")
      .select("*")
      .eq("child_id", CHILD_ID)
      .order("created_at", { ascending: false })
      .limit(48);

    if (!error && data) {
      const ordered = [...data].reverse() as VoiceLevelRow[];
      setRows(ordered);

      const latest = ordered[ordered.length - 1];
      if (latest) {
        setAvgLevel(latest.avg_level);
        setPeakLevel(latest.peak_level);
      }
    }
  };

  const restoreExistingSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("guardian_access_sessions")
      .select("id, expires_at, status")
      .eq("child_id", CHILD_ID)
      .eq("parent_id", user.id)
      .eq("status", "active")
      .gt("expires_at", nowIso)
      .order("started_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return;

    const session = data[0] as GuardianSessionRow;
    const exp = new Date(session.expires_at).getTime();
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((exp - now) / 1000));

    if (remaining > 0) {
      setActive(true);
      setSecondsLeft(remaining);
      setError("");
      await loadLatestVoiceRows();
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("voice-levels-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "voice_levels",
          filter: `child_id=eq.${CHILD_ID}`,
        },
        (payload) => {
          const row = payload.new as VoiceLevelRow;

          setRows((prev) => {
            const next = [...prev, row].slice(-48);
            return next;
          });

          setAvgLevel(row.avg_level);
          setPeakLevel(row.peak_level);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    restoreExistingSession();
  }, []);

  useEffect(() => {
    if (!active) return;

    loadLatestVoiceRows();

    pollRef.current = window.setInterval(() => {
      loadLatestVoiceRows();
    }, 500);

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          if (pollRef.current) window.clearInterval(pollRef.current);

          setActive(false);
          setAvgLevel(0);
          setPeakLevel(0);
          setRows([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [active]);

  const handleOpen = async () => {
    setError("");

    if (code !== ACCESS_CODE) {
      setError("Invalid code");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Login required");
      return;
    }

    const { data, error: rpcError } = await supabase.rpc(
      "validate_guardian_access_code",
      {
        p_child_id: CHILD_ID,
        p_parent_id: user.id,
        p_access_code: code,
        p_alert_id: null,
      }
    );

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result?.success) {
      setError(result?.message || "Access denied");
      return;
    }

    setActive(true);
    setSecondsLeft(WINDOW_SECONDS);
    setCode("");
    await loadLatestVoiceRows();
  };

  const waveformSamples = useMemo(() => {
    if (!rows.length) return Array.from({ length: 48 }, () => 6);
    return rows.map((row) => row.peak_level || row.avg_level || 6);
  }, [rows]);

  return (
    <div className="space-y-6">
      {!active ? (
        <section className="rounded-3xl border bg-card p-6 shadow-safe">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Voice Monitor Access</h1>
              <p className="text-sm text-muted-foreground">
                Enter the secure code to activate microphone monitoring for 60 seconds.
              </p>
            </div>
          </div>

          <div className="flex max-w-md gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="h-11 flex-1 rounded-xl border bg-background px-4 outline-none"
            />
            <button
              onClick={handleOpen}
              className="rounded-xl bg-primary px-5 text-primary-foreground"
            >
              Open
            </button>
          </div>

          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </section>
      ) : (
        <>
          <section className="rounded-3xl border bg-card p-5 shadow-safe">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Live Voice Monitor</h1>
                  <p className="text-sm text-muted-foreground">
                    Parent-only microphone activity from the child-side device.
                  </p>
                </div>
              </div>

              <div className="rounded-full border px-4 py-2 text-sm font-medium">
                {secondsLeft}s left
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border bg-card p-5 shadow-safe">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4" />
                Average Level
              </div>
              <div className="text-3xl font-bold">{avgLevel}</div>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-safe">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4" />
                Peak Level
              </div>
              <div className="text-3xl font-bold">{peakLevel}</div>
            </div>
          </section>

          <WaveBars samples={waveformSamples} active={active} />

          <section className="rounded-3xl border bg-card p-5 shadow-safe">
            <p className="text-sm text-muted-foreground">
              The voice monitor stays open for 60 seconds after the correct code is entered.
              During this time, the device LED stays on and the waveform reacts to nearby speech
              and sound intensity in real time.
            </p>
          </section>
        </>
      )}
    </div>
  );
}