/* Tweaks panel — motion + texture controls */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lag": 0.12,
  "split": 1,
  "distort": 1,
  "grid": 0.5,
  "glowOpacity": 0.65
}/*EDITMODE-END*/;

function PortfolioTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    window.PORTFOLIO_TWEAKS = { lag: t.lag, split: t.split, distort: t.distort };
    const root = document.documentElement;
    root.style.setProperty("--grid-alpha", String(t.grid));
    root.style.setProperty("--glow-opacity", String(t.glowOpacity));
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Preview card motion" />
      <TweakSlider label="Follow lag" value={t.lag} min={0.04} max={0.3} step={0.01}
                   onChange={(v) => setTweak("lag", v)} />
      <TweakSlider label="RGB split" value={t.split} min={0} max={2.5} step={0.1}
                   onChange={(v) => setTweak("split", v)} />
      <TweakSlider label="Squash & stretch" value={t.distort} min={0} max={2} step={0.1}
                   onChange={(v) => setTweak("distort", v)} />
      <TweakSlider label="Glow strength" value={t.glowOpacity} min={0} max={1} step={0.05}
                   onChange={(v) => setTweak("glowOpacity", v)} />
      <TweakSection label="Texture" />
      <TweakSlider label="Grid opacity" value={t.grid} min={0} max={1} step={0.05}
                   onChange={(v) => setTweak("grid", v)} />
    </TweaksPanel>
  );
}

const tweaksRoot = document.createElement("div");
tweaksRoot.id = "tweaks-root";
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<PortfolioTweaks />);
