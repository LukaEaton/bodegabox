import React, { useState, useRef, ReactNode, TouchEvent } from "react";

interface PullToRefreshProps {
  onRefresh: () => void | Promise<void>;
  children: ReactNode;
  threshold?: number;
  maxPull?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 100,
  maxPull = 150,
}) => {
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

  // Loader height scales proportionally
  const loaderHeight = refreshing ? 50 : pull * 0.4;
  // Arrow rotation (0 to 180deg as pull goes from 0 to threshold)
  const arrowRotation = Math.min((pull / threshold) * 180, 180);

  return (
    <div
      style={{ touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loader */}
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

      {/* Content stays in place */}
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

export default PullToRefresh;