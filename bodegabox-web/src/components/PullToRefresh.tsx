import { useState, useRef, ReactNode, TouchEvent } from "react";

type PullToRefreshProps = {
  onRefresh: () => void | Promise<void>;
  children: ReactNode;
  threshold?: number;
  maxPull?: number;
  style?: React.CSSProperties;
}

export function PullToRefresh({onRefresh,children,threshold = 100,maxPull = 150,style}: PullToRefreshProps) {
  const [pull, setPull] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const startY = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (refreshing) return;
    if (window.scrollY === 0) startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (refreshing) return;
    const distance = e.touches[0].clientY - startY.current;
    if (distance > 0 && window.scrollY === 0) {
      setPull(distance > maxPull ? maxPull : distance);
    }
  };

  const handleTouchEnd = async () => {
    if (refreshing) return;
    if (pull >= threshold) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setPull(0);
  };

  const loaderHeight = refreshing ? 50 : pull * 0.4;
  const arrowRotation = Math.min((pull / threshold) * 180, 180);

  return (
    <div
      style={{ ...style, touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          height: loaderHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: refreshing ? "height 0.2s ease" : "none",
        }}
      >
        {refreshing ? (
          <div
            style={{
              width: 24,
              height: 24,
              border: "3px solid #ccc",
              borderTop: "3px solid #333",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : pull > 0 ? (
          <div
            style={{
              transform: `rotate(${arrowRotation}deg)`,
              transition: "transform 0.1s linear",
              fontSize: 24,
            }}
          >
            ↓
          </div>
        ) : null}
      </div>

      <div>{children}</div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};