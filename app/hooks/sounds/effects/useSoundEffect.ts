import { useSoundSettings } from "@/app/context/SoundSettingsContext";
import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";

type SoundOptions = {
  volume?: number; // local multiplier (0..1)
  rate?: number;
  shouldUnloadOnUnmount?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function useSoundEffect(
  source: number,
  { volume = 1.0, rate = 1.0, shouldUnloadOnUnmount = true }: SoundOptions = {},
) {
  const { muted, sfxVolume } = useSoundSettings();

  const soundRef = useRef<Audio.Sound | null>(null);
  const [ready, setReady] = useState(false);

  // Combine global SFX level with local volume unless muted.
  const finalVolume = muted ? 0 : clamp01(sfxVolume * volume);

  useEffect(() => {
    let mounted = true;
    setReady(false);

    async function load() {
      try {
        const { sound } = await Audio.Sound.createAsync(source, {
          volume: finalVolume,
          rate,
          shouldCorrectPitch: true,
        });

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        setReady(true);
      } catch {
        if (mounted) setReady(false);
      }
    }

    load();

    return () => {
      mounted = false;
      if (shouldUnloadOnUnmount) {
        soundRef.current?.unloadAsync();
        soundRef.current = null;
        setReady(false);
      }
    };
  }, [source, rate, shouldUnloadOnUnmount, finalVolume]);

  // Keep loaded sound volume synchronized with current settings.
  useEffect(() => {
    const s = soundRef.current;
    if (!s) return;
    s.setStatusAsync({ volume: finalVolume }).catch(() => {});
  }, [finalVolume]);

  const play = useCallback(async () => {
    if (!ready) return;
    if (muted) return;

    try {
      await soundRef.current?.replayAsync();
    } catch {
      // Ignore playback errors from transient audio lifecycle issues.
    }
  }, [ready, muted]);

  return { play, ready };
}
