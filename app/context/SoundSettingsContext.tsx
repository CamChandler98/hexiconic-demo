import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const SOUND_SETTINGS_KEY = "sound-settings-v1";

type SoundSettings = {
  muted: boolean;
  sfxVolume: number; // 0..1
};

type SoundSettingsContextType = SoundSettings & {
  setMuted: (value: boolean) => void;
  toggleMuted: () => void;
  setSfxVolume: (value: number) => void;
};

const SoundSettingsContext = createContext<
  SoundSettingsContextType | undefined
>(undefined);

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function SoundSettingsProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [sfxVolume, setSfxVolumeState] = useState(1);

  // Load once on boot
  useEffect(() => {
    AsyncStorage.getItem(SOUND_SETTINGS_KEY).then((raw) => {
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as Partial<SoundSettings>;
        if (typeof parsed.muted === "boolean") setMuted(parsed.muted);
        if (typeof parsed.sfxVolume === "number")
          setSfxVolumeState(clamp01(parsed.sfxVolume));
      } catch {
        // ignore corrupted storage
      }
    });
  }, []);

  // Persist on change
  useEffect(() => {
    const payload: SoundSettings = { muted, sfxVolume };
    AsyncStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(payload)).catch(
      () => {},
    );
  }, [muted, sfxVolume]);

  const setSfxVolume = (value: number) => setSfxVolumeState(clamp01(value));
  const toggleMuted = () => setMuted((prev) => !prev);

  const value = useMemo(
    () => ({ muted, sfxVolume, setMuted, toggleMuted, setSfxVolume }),
    [muted, sfxVolume],
  );

  return (
    <SoundSettingsContext.Provider value={value}>
      {children}
    </SoundSettingsContext.Provider>
  );
}

export function useSoundSettings() {
  const ctx = useContext(SoundSettingsContext);
  if (!ctx)
    throw new Error(
      "useSoundSettings must be used within SoundSettingsProvider",
    );
  return ctx;
}
