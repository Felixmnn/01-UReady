import React, { useEffect, useState } from "react";
import { View } from "react-native";

type LoadingProgressBarProps = {
  active: boolean;
  durationMs?: number;
  barClassName?: string;
  trackClassName?: string;
};

const LoadingProgressBar = ({
  active,
  durationMs = 30000,
  barClassName = "bg-blue-500",
  trackClassName = "bg-gray-700",
}: LoadingProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const nextProgress = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <View className={`w-full h-3 rounded-full overflow-hidden ${trackClassName}`}>
      <View
        className={`h-full rounded-full ${barClassName}`}
        style={{ width: `${progress}%` }}
      />
    </View>
  );
};

export default LoadingProgressBar;
