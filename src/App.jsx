import { useState, useCallback } from "react";

const DATA = {
  classes: {
    Barbarian: ["Berserker", "Wildheart", "Wild Magic", "Giant"],
    Bard: ["College of Lore", "College of Valour", "College of Swords", "College of Spirits"],
    Cleric: ["Life Domain", "Light Domain", "Knowledge Domain", "Nature Domain", "Tempest Domain", "Trickery Domain", "War Domain", "Spore Domain"],
    Druid: ["Circle of the Land", "Circle of the Moon", "Circle of Spores", "Circle of Stars"],
    Fighter: ["Battle Master", "Eldritch Knight", "Champion", "Arcane Archer"],
    Monk: ["Way of the Open Hand", "Way of Shadow", "Way of the Four Elements", "Way of the Astral Self"],
    Paladin: ["Oath of Devotion", "Oath of the Ancients", "Oath of Vengeance", "Oathbreaker"],
    Ranger: ["Beast Master", "Hunter", "Gloom Stalker", "Swarmkeeper"],
    Rogue: ["Thief", "Arcane Trickster", "Assassin", "Soulknife"],
    Sorcerer: ["Draconic Bloodline", "Wild Magic", "Storm Sorcery", "Shadow Magic"],
    Warlock: ["The Fiend", "The Great Old One", "Archfey", "Hexblade"],
    Wizard: ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Necromancy", "Illusion", "Transmutation", "Bladesinging"],
  },
  backgrounds: ["Acolyte", "Charlatan", "Criminal", "Entertainer", "Folk Hero", "Guild Artisan", "Haunted One", "Noble", "Outlander", "Sage", "Soldier", "Urchin"],
  companions: [
    { name: "Shadowheart", act: 1 }, { name: "Astarion", act: 1 }, { name: "Gale", act: 1 },
    { name: "Lae'zel", act: 1 }, { name: "Wyll", act: 1 }, { name: "Karlach", act: 1 },
    { name: "Halsin", act: 2 }, { name: "Minthara", act: 2 }, { name: "Jaheira", act: 2 }, { name: "Minsc", act: 3 },
  ],
  decisions: {
    safe: [
      { cat: "Alignment", opts: ["Heroic — help everyone you can", "Self-serving — your needs come first", "Chaotic — let morality be situational"] },
      { cat: "Combat Style", opts: ["Aggressive frontliner", "Tactical support and control", "Stealth and subterfuge", "Pure magic artillery"] },
      { cat: "Dialogue Approach", opts: ["Persuasion & charm", "Intimidation", "Deception & lies", "Insight — read everyone"] },
      { cat: "Roleplay Focus", opts: ["Min-max every build", "Lean into your character concept", "Complete every side quest", "Rush the main story"] },
    ],
    spoiler: [
      { cat: "Origin", opts: ["Play as Tav (custom character)", "Play as Dark Urge"] },
      { cat: "Act 1 — The Grove", opts: ["Save the Grove (defeat the goblin leaders)", "Side with the goblins (Minthara route)", "Knock out Minthara — recruit both her and Halsin"] },
      { cat: "Shadowheart's Path", opts: ["Help Shadowheart embrace Shar's will", "Guide Shadowheart away from Shar toward the light"] },
      { cat: "Astarion's Fate", opts: ["Let Astarion perform the Rite of Profane Ascension", "Convince Astarion to remain a regular spawn"] },
      { cat: "Act 3 — Allegiance", opts: ["Side with the Emperor (Mind Flayer)", "Trust Orpheus the Githyanki Prince", "Sacrifice a companion to become a Mind Flayer"] },
      { cat: "Ending", opts: ["Destroy the Netherbrain", "Dominate the Netherbrain and seize power"] },
    ],
  },
};

const EMOJI = { Barbarian:"⚔️", Bard:"🎵", Cleric:"✨", Druid:"🌿", Fighter:"🛡️", Monk:"👊", Paladin:"⚜️", Ranger:"🏹", Rogue:"🗡️", Sorcerer:"🌀", Warlock:"👁️", Wizard:"🔮" };
const DEMOJI = { "Alignment":"⚖️", "Combat Style":"⚔️", "Dialogue Approach":"💬", "Roleplay Focus":"🎭", "Origin":"🎭", "Act 1 — The Grove":"🌿", "Shadowheart's Path":"🌑", "Astarion's Fate":"🧛", "Act 3 — Allegiance":"🧠", "Ending":"👑" };

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
const CLS = Object.keys(DATA.classes);

function generate(sp, cm) {
  const pc = pick(CLS);
  const pool = cm === "party" ? DATA.companions.filter(c => c.act === 1) : DATA.companions;
  const count = cm === "party" ? 3 : cm === "random" ? Math.floor(Math.random() * 4) + 3 : parseInt(cm);
  const comps = pickN(pool, count).map(c => { const ac = pick(CLS); return { ...c, cls: ac, sub: pick(DATA.classes[ac]) }; });
  const decisions = (sp === "safe" ? DATA.decisions.safe : [...DATA.decisions.safe, ...DATA.decisions.spoiler])
    .map(d => ({ cat: d.cat, choice: pick(d.opts) }));
  return {
    origin: sp === "safe" ? "Custom Character (Tav)" : pick(["Custom Character (Tav)", "Dark Urge"]),
    pClass: pc, pSub: pick(DATA.classes[pc]), bg: pick(DATA.backgrounds), comps, decisions,
  };
}

const lbl = { fontSize: ".67rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#907050", marginBottom: ".3rem" };
const cardSt = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,163,90,.22)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.25rem" };

export default function App() {
  const [sp, setSp] = useState("safe");
  const [cm, setCm] = useState("random");
  const [res, setRes] = useState(null);
  const [ok, setOk] = useState(false);
  const roll = useCallback(() => { setRes(generate(sp, cm)); setOk(false); }, [sp, cm]);
  const copy = () => {
    if (!res) return;
    const txt = ["BG3 PLAYTHROUGH PARAMETERS", "", "CHARACTER", `Origin: ${res.origin}`, `Class: ${res.pClass} — ${res.pSub}`, `Background: ${res.bg}`, "", "PARTY", ...res.comps.map(c => `${c.name}: ${c.cls} — ${c.sub}`), "", "KEY DECISIONS", ...res.decisions.map(d => `${d.cat}: ${d.choice}`)].join("\n");
    navigator.clipboard.writeText(txt).then(() => { setOk(true); setTimeout(() => setOk(false), 2500); });
  };

  const OBtn = ({ v, cur, set, main, sub }) => (
    <button onClick={() => set(v)} style={{ display: "block", width: "100%", textAlign: "left", padding: ".65rem .9rem", borderRadius: "8px", border: cur === v ? "1px solid #c4a35a" : "1px solid rgba(196,163,90,.18)", background: cur === v ? "rgba(196,163,90,.13)" : "rgba(255,255,255,.025)", cursor: "pointer", color: cur === v ? "#f5e090" : "#907868", fontFamily: "Georgia,serif", marginBottom: ".4rem" }}>
      <span style={{ fontWeight: "bold", fontSize: ".875rem" }}>{main}</span>
      {sub && <><br /><span style={{ fontSize: ".72rem", opacity: .7 }}>{sub}</span></>}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0a0a16 0%,#16082a 50%,#080f08 100%)", fontFamily: "Georgia,serif", color: "#e8d5a3" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fadeUp .38s ease}`}</style>
      <header style={{ background: "linear-gradient(180deg,rgba(196,163,90,.12) 0%,transparent 100%)", borderBottom: "1px solid rgba(196,163,90,.25)", padding: "2.5rem 1.5rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: ".7rem", letterSpacing: ".35em", color: "#c4a35a", textTransform: "uppercase", marginBottom: ".5rem" }}>Forgotten Realms · Patch 8</div>
        <h1 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: "bold", margin: "0 0 .5rem", background: "linear-gradient(135deg,#f5e090,#c4a35a,#f5e090)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>BG3 Playthrough Generator</h1>
        <p style={{ color: "#907050", fontSize: ".9rem", margin: 0, fontStyle: "italic" }}>Roll the dice on your next adventure through Faerûn</p>
      </header>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <div style={cardSt}>
          <h2 style={{ margin: "0 0 1.1rem", fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#c4a35a" }}>⚙️ Options</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ ...lbl, marginBottom: ".75rem" }}>Spoiler Tolerance</div>
              <OBtn v="safe" cur={sp} set={setSp} main="🙈 Spoiler-Free" sub="Style, alignment & approach" />
              <OBtn v="full" cur={sp} set={setSp} main="👁️ Full Spoilers" sub="Story branches & major choices" />
            </div>
            <div>
              <div style={{ ...lbl, marginBottom: ".75rem" }}>Companion Count</div>
              <OBtn v="random" cur={cm} set={setCm} main="🎲 Random (3–6)" />
              <OBtn v="party" cur={cm} set={setCm} main="👥 Active party of 3" />
              <OBtn v="4" cur={cm} set={setCm} main="4 companions" />
              <OBtn v="6" cur={cm} set={setCm} main="6 companions" />
            </div>
          </div>
        </div>

        <button onClick={roll} style={{ width: "100%", padding: "1.05rem", background: "linear-gradient(135deg,#7a5910,#c4a35a,#7a5910)", border: "none", borderRadius: "10px", color: "#1a0e00", fontFamily: "Georgia,serif", fontSize: "1.05rem", fontWeight: "bold", letterSpacing: ".1em", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 22px rgba(196,163,90,.28)", marginBottom: "1.75rem" }}>🎲 Roll My Playthrough</button>

        {res && (
          <div className="fu">
            <div style={cardSt}>
              <h3 style={{ margin: "0 0 1rem", fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#c4a35a" }}>🧙 Your Character</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".85rem" }}>
                {[{ l: "Origin", v: res.origin }, { l: "Class", v: `${EMOJI[res.pClass]} ${res.pClass}`, s: res.pSub }, { l: "Background", v: res.bg }].map(i => (
                  <div key={i.l} style={{ background: "rgba(196,163,90,.07)", borderRadius: "8px", padding: ".9rem", borderLeft: "3px solid rgba(196,163,90,.5)" }}>
                    <div style={lbl}>{i.l}</div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#f5e090" }}>{i.v}</div>
                    {i.s && <div style={{ fontSize: ".78rem", color: "#c4a35a", marginTop: ".15rem", fontStyle: "italic" }}>{i.s}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div style={cardSt}>
              <h3 style={{ margin: "0 0 1rem", fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#c4a35a" }}>👥 Your Party ({res.comps.length} companions)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))", gap: ".75rem" }}>
                {res.comps.map(c => (
                  <div key={c.name} style={{ background: "rgba(196,163,90,.05)", borderRadius: "8px", padding: ".85rem", border: "1px solid rgba(196,163,90,.12)" }}>
                    <div style={{ fontWeight: "bold", color: "#e8d5a3", marginBottom: ".25rem" }}>{c.name}</div>
                    <div style={{ fontSize: ".9rem", color: "#f5e090" }}>{EMOJI[c.cls]} {c.cls}</div>
                    <div style={{ fontSize: ".77rem", color: "#a09070", fontStyle: "italic" }}>{c.sub}</div>
                    {c.act > 1 && <div style={{ fontSize: ".66rem", marginTop: ".4rem", color: "#6a5530", letterSpacing: ".08em" }}>JOINS ACT {c.act}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div style={cardSt}>
              <h3 style={{ margin: "0 0 1rem", fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#c4a35a" }}>⚖️ Key Decisions</h3>
              {res.decisions.map(d => (
                <div key={d.cat} style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", padding: ".75rem .9rem", background: "rgba(196,163,90,.05)", borderRadius: "8px", border: "1px solid rgba(196,163,90,.1)", marginBottom: ".55rem" }}>
                  <span style={{ fontSize: "1.15rem", flexShrink: 0, marginTop: "1px" }}>{DEMOJI[d.cat] || "📌"}</span>
                  <div>
                    <div style={lbl}>{d.cat}</div>
                    <div style={{ color: "#f5e090", fontSize: ".93rem" }}>{d.choice}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button onClick={roll} style={{ flex: 1, padding: ".85rem", background: "rgba(196,163,90,.1)", border: "1px solid rgba(196,163,90,.3)", borderRadius: "8px", color: "#c4a35a", fontFamily: "Georgia,serif", fontSize: ".9rem", cursor: "pointer", letterSpacing: ".05em" }}>🎲 Reroll</button>
              <button onClick={copy} style={{ flex: 1, padding: ".85rem", background: ok ? "rgba(80,160,80,.13)" : "rgba(196,163,90,.1)", border: ok ? "1px solid rgba(80,160,80,.35)" : "1px solid rgba(196,163,90,.3)", borderRadius: "8px", color: ok ? "#90d090" : "#c4a35a", fontFamily: "Georgia,serif", fontSize: ".9rem", cursor: "pointer", transition: "all .25s" }}>{ok ? "✅ Copied!" : "📋 Copy to Clipboard"}</button>
            </div>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(196,163,90,.12)", color: "#4a3f28", fontSize: ".75rem" }}>
          All 12 classes · 46+ subclasses · 10 companions · Patch 8<br />
          <span style={{ fontStyle: "italic" }}>The Forgotten Realms await. May the dice be in your favour.</span>
        </div>
      </div>
    </div>
  );
}