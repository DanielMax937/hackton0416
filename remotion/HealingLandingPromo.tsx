import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG =
  "linear-gradient(165deg, #060a12 0%, #0c1222 42%, #141a28 78%, #0a0d14 100%)";
const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const TEXT = "#e4eaf6";
const MUTED = "#8b95ab";

export const HealingLandingPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroOpacity = interpolate(frame, [0, 36], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroY = interpolate(frame, [0, 48], [24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineW = interpolate(frame, [18, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const featureOpacity = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const priceOpacity = interpolate(frame, [200, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = spring({
    frame: Math.max(0, frame - 250),
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const ctaOpacity = interpolate(frame, [300, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glow = interpolate(frame, [0, 360], [0.12, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: BG,
        color: TEXT,
        fontFamily:
          'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% -10%, rgba(34,211,238,${glow}) 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          padding: 72,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroY}px)`,
            maxWidth: 980,
          }}
        >
          <p
            style={{
              margin: 0,
              letterSpacing: "0.28em",
              fontSize: 22,
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Ethereal · Cyber · Zen
          </p>
          <h1
            style={{
              margin: "18px 0 0",
              fontSize: 86,
              fontWeight: 200,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            心境入口
          </h1>
          <p
            style={{
              margin: "22px 0 0",
              fontSize: 30,
              fontWeight: 300,
              color: MUTED,
              maxWidth: 900,
              lineHeight: 1.45,
            }}
          >
            即时速测 · 深度整理 · 订阅月包与按次探索 · 线上分析衔接线下疗愈。
          </p>
          <div
            style={{
              marginTop: 36,
              height: 3,
              width: `${Math.round(lineW * 320)}px`,
              maxWidth: "100%",
              background: `linear-gradient(90deg, transparent, ${CYAN}, ${VIOLET}, transparent)`,
              borderRadius: 999,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 72,
            opacity: featureOpacity,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 28,
            maxWidth: 1100,
          }}
        >
          {[
            { t: "5 分钟速测", d: "不限次 · 快速识别情绪焦点。" },
            { t: "月包 29.9", d: "深度测试 + 问题模式 + 探索权益。" },
            { t: "按次 19.9", d: "探索超出 3 次后的单次增值。" },
          ].map((c) => (
            <div
              key={c.t}
              style={{
                border: "1px solid rgba(160,190,255,0.18)",
                background: "rgba(18,24,38,0.42)",
                borderRadius: 4,
                padding: "28px 26px",
                backdropFilter: "blur(12px)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 26,
                  letterSpacing: "0.08em",
                  color: CYAN,
                }}
              >
                {c.t}
              </p>
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 22,
                  color: MUTED,
                  lineHeight: 1.45,
                }}
              >
                {c.d}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 64,
            opacity: priceOpacity,
            display: "flex",
            gap: 32,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "34px 30px",
              border: `1px solid rgba(34,211,238,0.35)`,
              background: "rgba(34,211,238,0.08)",
              borderRadius: 4,
              transform: `scale(${0.96 + pulse * 0.04})`,
            }}
          >
            <p style={{ margin: 0, fontSize: 22, color: MUTED }}>订阅月包</p>
            <p style={{ margin: "12px 0 0", fontSize: 64, fontWeight: 200 }}>
              ¥29.9
              <span style={{ fontSize: 28, color: MUTED }}>/月</span>
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 22, color: MUTED }}>
              速测 + 深度测试 + 问题模式 + 探索前 3 次
            </p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "34px 30px",
              border: `1px solid rgba(167,139,250,0.38)`,
              background: "rgba(167,139,250,0.08)",
              borderRadius: 4,
            }}
          >
            <p style={{ margin: 0, fontSize: 22, color: MUTED }}>单项增值</p>
            <p style={{ margin: "12px 0 0", fontSize: 64, fontWeight: 200 }}>
              ¥19.9
              <span style={{ fontSize: 28, color: MUTED }}>/次</span>
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 22, color: MUTED }}>
              探索第 4 次起 · 或低频深度加购
            </p>
          </div>
        </div>

        <div style={{ marginTop: 56, opacity: ctaOpacity }}>
          <p style={{ margin: 0, fontSize: 34, fontWeight: 300 }}>
            线上测评与报告
            <span style={{ color: CYAN }}> 精准推荐 </span>
            森林疗愈 · 团体 · 一对一。
          </p>
          <p style={{ margin: "14px 0 0", fontSize: 24, color: MUTED }}>
            微信群运营 · 首单 8 折 · 套餐组合
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
