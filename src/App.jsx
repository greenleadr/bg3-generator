import { useState, useCallback } from "react";
import emailjs from "@emailjs/browser";

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
  combatStyles: {
    Barbarian: ["Reckless frontliner — charge in and hit everything", "Tank it out — absorb damage for the party", "Rage and isolate — focus down one target at a time"],
    Bard: ["Buff and inspire from the backline", "Crowd control — keep enemies locked down", "Sneaky skirmisher — get in close and cause chaos"],
    Cleric: ["Pure healer — keep your party alive above all", "Battle cleric — armoured and on the front line", "Blaster — smite enemies with divine power from range"],
    Druid: ["Wild Shape brawler — transform and fight up close", "Summoner — let your creatures do the work", "Spell artillery — control the battlefield from safety"],
    Fighter: ["Relentless aggressor — never stop pressing the attack", "Tactical controller — use manoeuvres to dictate the fight", "Durable anchor — hold the line and protect allies"],
    Monk: ["Mobile striker — hit fast, move constantly", "Crowd controller — stun and lock down enemies", "Glass cannon — maximise damage, stay out of range"],
    Paladin: ["Smite everything — front line holy damage dealer", "Protector — keep allies alive with auras and healing", "Intimidating tank — draw fire and punish attackers"],
    Ranger: ["Pure archer — stay at max range at all times", "Beast companion focus — let your animal do the heavy lifting", "Ambush striker — stealth approach, devastating opening attack"],
    Rogue: ["Classic assassin — stealth kill before combat begins", "Skirmisher — attack from flanks and stay mobile", "Arcane trickster — use spells to set up sneak attacks"],
    Sorcerer: ["Metamagic blaster — maximise damage on every spell", "Crowd controller — slow, sleep, and dominate enemies", "Volatile wild card — embrace chaos and unpredictability"],
    Warlock: ["Eldritch Blast spammer — simple but devastating", "Summoner and commander — let minions fight for you", "Debuffer — hex everything and let the party clean up"],
    Wizard: ["Pure spell artillery — glass cannon from the back row", "Crowd controller — web, hold, and dominate enemies", "Necromancer — build an undead army and watch it work"],
  },
  races: {
    "Human": ["Human"],
    "Elf": ["High Elf", "Wood Elf", "Drow"],
    "Half-Elf": ["High Half-Elf", "Wood Half-Elf", "Drow Half-Elf"],
    "Dwarf": ["Gold Dwarf", "Shield Dwarf", "Duergar"],
    "Halfling": ["Lightfoot Halfling", "Strongheart Halfling"],
    "Gnome": ["Rock Gnome", "Forest Gnome", "Deep Gnome"],
    "Tiefling": ["Asmodeus Tiefling", "Mephistopheles Tiefling", "Zariel Tiefling"],
    "Half-Orc": ["Half-Orc"],
    "Githyanki": ["Githyanki"],
    "Dragonborn": ["Black Dragonborn", "Blue Dragonborn", "Brass Dragonborn", "Bronze Dragonborn", "Copper Dragonborn", "Gold Dragonborn", "Green Dragonborn", "Red Dragonborn", "Silver Dragonborn", "White Dragonborn"],
  },
  backgrounds: ["Acolyte", "Charlatan", "Criminal", "Entertainer", "Folk Hero", "Guild Artisan", "Noble", "Outlander", "Sage", "Soldier", "Urchin"],
  companions: [
    { name: "Shadowheart", act: 1 }, { name: "Astarion", act: 1 }, { name: "Gale", act: 1 },
    { name: "Lae'zel", act: 1 }, { name: "Wyll", act: 1 }, { name: "Karlach", act: 1 },
    { name: "Halsin", act: 2 }, { name: "Minthara", act: 2 }, { name: "Jaheira", act: 2 }, { name: "Minsc", act: 3 },
  ],
  decisions: {
    safe: [
      { cat: "Alignment", opts: [
        { text: "Heroic — help everyone you can", align: "good" },
        { text: "Self-serving — your needs come first", align: "evil" },
        { text: "Chaotic — let morality be situational", align: null },
      ]},
      { cat: "Dialogue Approach", opts: [
        { text: "Persuasion & charm", align: "good" },
        { text: "Intimidation", align: "evil" },
        { text: "Deception & lies", align: "evil" },
        { text: "Insight — read everyone", align: null },
      ]},
      { cat: "Roleplay Focus", opts: [
        { text: "Min-max every build", align: null },
        { text: "Lean into your character concept", align: null },
        { text: "Complete every side quest", align: "good" },
        { text: "Rush the main story", align: null },
      ]},
    ],
    spoiler: [
      { cat: "Origin", opts: [
        { text: "Play as Tav (custom character)", align: null },
        { text: "Play as Dark Urge", align: "evil" },
      ]},
      { cat: "Act 1 — The Grove", opts: [
        { text: "Save the Grove (defeat the goblin leaders)", align: "good" },
        { text: "Side with the goblins (Minthara route)", align: "evil" },
        { text: "Knock out Minthara — recruit both her and Halsin", align: null },
      ]},
      { cat: "Act 3 — Allegiance", opts: [
        { text: "Side with the Emperor (Mind Flayer)", align: null },
        { text: "Trust Orpheus the Githyanki Prince", align: "good" },
        { text: "Sacrifice a companion to become a Mind Flayer", align: "evil" },
      ]},
      { cat: "Ending", opts: [
        { text: "Destroy the Netherbrain", align: "good" },
        { text: "Dominate the Netherbrain and seize power", align: "evil" },
      ]},
    ],
  },
  companionQuests: [
    { cat: "Shadowheart", opts: [
      { text: "Help Shadowheart embrace Shar's will", align: "evil" },
      { text: "Guide Shadowheart away from Shar toward the light", align: "good" },
    ]},
    { cat: "Astarion", opts: [
      { text: "Let Astarion perform the Rite of Profane Ascension", align: "evil" },
      { text: "Convince Astarion to remain a regular spawn — and be free", align: "good" },
    ]},
    { cat: "Gale", opts: [
      { text: "Help Gale resist the orb and find a cure", align: "good" },
      { text: "Encourage Gale to detonate the orb for godhood", align: "evil" },
      { text: "Support Gale in becoming the new god of ambition", align: "evil" },
    ]},
    { cat: "Wyll", opts: [
      { text: "Help Wyll break his pact with Mizora and free his father", align: "good" },
      { text: "Let Wyll renew his pact — his soul for his father's life", align: "evil" },
      { text: "Encourage Wyll to embrace being the Blade of Avernus", align: null },
    ]},
  ],
};

const EMOJI = { Barbarian:"⚔️", Bard:"🎵", Cleric:"✨", Druid:"🌿", Fighter:"🛡️", Monk:"👊", Paladin:"⚜️", Ranger:"🏹", Rogue:"🗡️", Sorcerer:"🌀", Warlock:"👁️", Wizard:"🔮" };
const ALIGN_LABEL = { good: { icon: "🌟", color: "#90d4a0" }, evil: { icon: "💀", color: "#d47090" } };

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
const CLS = Object.keys(DATA.classes);

function pickRace() {
  const race = pick(Object.keys(DATA.races));
  return pick(DATA.races[race]);
}

function weightedPick(opts, alignment) {
  if (!alignment) return pick(opts);
  const aligned = opts.filter(o => o.align === alignment);
  const neutral = opts.filter(o => o.align === null);
  const pool = [...aligned, ...aligned, ...neutral];
  return pick(pool.length ? pool : opts);
}

function generate(sp, cm, alignment) {
  const pc = pick(CLS);
  const pool = cm === "party" ? DATA.companions.filter(c => c.act === 1) : DATA.companions;
  const count = cm === "party" ? 3 : cm === "random" ? Math.floor(Math.random() * 4) + 3 : parseInt(cm);
  const comps = pickN(pool, count).map(c => { const ac = pick(CLS); return { ...c, cls: ac, sub: pick(DATA.classes[ac]) }; });
  const decisionSets = sp === "safe" ? DATA.decisions.safe : [...DATA.decisions.safe, ...DATA.decisions.spoiler];
  const decisions = decisionSets.map(d => {
    const chosen = weightedPick(d.opts, alignment);
    return { cat: d.cat, choice: chosen.text, align: chosen.align };
  });
  const companionQuests = DATA.companionQuests.map(d => {
    const chosen = weightedPick(d.opts, alignment);
    return { cat: d.cat, choice: chosen.text, align: chosen.align };
  });
  return {
    origin: sp === "safe" ? "Custom Character (Tav)" : weightedPick([
      { text: "Custom Character (Tav)", align: "good" },
      { text: "Dark Urge", align: "evil" },
    ], alignment).text,
    pClass: pc,
    pSub: pick(DATA.classes[pc]),
    pRace: pickRace(),
    combatStyle: pick(DATA.combatStyles[pc]),
    bg: pick(DATA.backgrounds),
    comps,
    decisions,
    companionQuests,
  };
}

const lbl = { fontSize: ".67rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#907050", marginBottom: ".3rem" };
const cardSt = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,163,90,.22)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.25rem" };
const secTitle = { margin: "0 0 1rem", fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#c4a35a" };

export default function App() {
  const [sp, setSp] = useState("safe");
  const [cm, setCm] = useState("random");
  const [alignment, setAlignment] = useState(null);
  const [res, setRes] = useState(null);
  const [ok, setOk] = useState(false);
  const [showFeature, setShowFeature] = useState(false);
  const [featureText, setFeatureText] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");

  const roll = useCallback(() => { setRes(generate(sp, cm, alignment)); setOk(false); }, [sp, cm, alignment]);

  const copy = () => {
    if (!res) return;
    const txt = [
      "BG3 PLAYTHROUGH PARAMETERS", "",
      "CHARACTER",
      `Origin: ${res.origin}`,
      `Race: ${res.pRace}`,
      `Class: ${res.pClass} — ${res.pSub}`,
      `Background: ${res.bg}`,
      `Combat Style: ${res.combatStyle}`,
      "", "PARTY",
      ...res.comps.map(c => `${c.name}: ${c.cls} — ${c.sub}`),
      "", "KEY DECISIONS",
      ...res.decisions.map(d => `${d.cat}: ${d.choice}`),
      "", "COMPANION QUESTS",
      ...res.companionQuests.map(d => `${d.cat}: ${d.choice}`),
    ].join("\n");
    navigator.clipboard.writeText(txt).then(() => { setOk(true); setTimeout(() => setOk(false), 2500); });
  };

  const submitFeature = async () => {
    if (!featureText.trim()) return;
    setSubmitStatus("sending");
    try {
      await emailjs.send(
        "service_lmctiqe",
        "template_gn9uspd",
        { message: featureText },
        "tJsPBE_KNDTMKvTdS"
      );
      setSubmitStatus("sent");
      setFeatureText("");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  const OBtn = ({ v, cur, set, main, sub }) => (
    <button onClick={() => set(v)} style={{ display: "block", width: "100%", textAlign: "left", padding: ".65rem .9rem", borderRadius: "8px", border: cur === v ? "1px solid #c4a35a" : "1px solid rgba(196,163,90,.18)", background: cur === v ? "rgba(196,163,90,.13)" : "rgba(255,255,255,.025)", cursor: "pointer", color: cur === v ? "#f5e090" : "#907868", fontFamily: "Georgia,serif", marginBottom: ".4rem" }}>
      <span style={{ fontWeight: "bold", fontSize: ".875rem" }}>{main}</span>
      {sub && <><br /><span style={{ fontSize: ".72rem", opacity: .7 }}>{sub}</span></>}
    </button>
  );

  const AlignBtn = ({ v, label, desc, color }) => (
    <button onClick={() => setAlignment(alignment === v ? null : v)} style={{ flex: 1, padding: ".65rem .9rem", borderRadius: "8px", border: alignment === v ? `1px solid ${color}` : "1px solid rgba(196,163,90,.18)", background: alignment === v ? `${color}22` : "rgba(255,255,255,.025)", cursor: "pointer", color: alignment === v ? color : "#907868", fontFamily: "Georgia,serif", textAlign: "center" }}>
      <div style={{ fontWeight: "bold", fontSize: ".875rem" }}>{label}</div>
      <div style={{ fontSize: ".72rem", opacity: .7 }}>{desc}</div>
    </button>
  );

  const DecisionRow = ({ d }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", padding: ".75rem .9rem", background: "rgba(196,163,90,.05)", borderRadius: "8px", border: "1px solid rgba(196,163,90,.1)", marginBottom: ".55rem" }}>
      <div style={{ flexGrow: 1 }}>
        <div style={lbl}>{d.cat}</div>
        <div style={{ color: "#f5e090", fontSize: ".93rem" }}>{d.choice}</div>
      </div>
      {d.align && alignment && (
        <span style={{ fontSize: ".75rem", fontWeight: "bold", color: ALIGN_LABEL[d.align].color, flexShrink: 0, marginTop: ".2rem", background: `${ALIGN_LABEL[d.align].color}22`, padding: ".2rem .5rem", borderRadius: "4px" }}>
          {ALIGN_LABEL[d.align].icon} {d.align}
        </span>
      )}
    </div>
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

        {/* Options */}
        <div style={cardSt}>
          <h2 style={secTitle}>⚙️ Options</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.25rem" }}>
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
          <div style={{ ...lbl, marginBottom: ".75rem" }}>Playthrough Alignment <span style={{ opacity: .6, textTransform: "none", letterSpacing: 0 }}>(optional — click to toggle)</span></div>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <AlignBtn v="good" label="🌟 Good" desc="Lean toward heroic choices" color="#90d4a0" />
            <AlignBtn v="evil" label="💀 Evil" desc="Lean toward dark choices" color="#d47090" />
          </div>
          {alignment && <div style={{ marginTop: ".75rem", fontSize: ".78rem", color: "#907050", fontStyle: "italic" }}>Alignment labels will appear on your rolled decisions. Choices are weighted but not guaranteed — chaos finds a way.</div>}
        </div>

        {/* Roll button */}
        <button onClick={roll} style={{ width: "100%", padding: "1.05rem", background: alignment === "evil" ? "linear-gradient(135deg,#5a1020,#c04060,#5a1020)" : alignment === "good" ? "linear-gradient(135deg,#1a4a20,#40a060,#1a4a20)" : "linear-gradient(135deg,#7a5910,#c4a35a,#7a5910)", border: "none", borderRadius: "10px", color: "#fff", fontFamily: "Georgia,serif", fontSize: "1.05rem", fontWeight: "bold", letterSpacing: ".1em", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 22px rgba(196,163,90,.28)", marginBottom: "1.75rem", transition: "background .4s" }}>🎲 Roll My Playthrough</button>

        {/* Results */}
        {res && (
          <div className="fu">
            <div style={cardSt}>
              <h3 style={secTitle}>🧙 Your Character</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".85rem", marginBottom: ".85rem" }}>
                {[{ l: "Origin", v: res.origin }, { l: "Race", v: res.pRace }, { l: "Background", v: res.bg }].map(i => (
                  <div key={i.l} style={{ background: "rgba(196,163,90,.07)", borderRadius: "8px", padding: ".9rem", borderLeft: "3px solid rgba(196,163,90,.5)" }}>
                    <div style={lbl}>{i.l}</div>
                    <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#f5e090" }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".85rem" }}>
                <div style={{ background: "rgba(196,163,90,.07)", borderRadius: "8px", padding: ".9rem", borderLeft: "3px solid rgba(196,163,90,.5)" }}>
                  <div style={lbl}>Class</div>
                  <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#f5e090" }}>{EMOJI[res.pClass]} {res.pClass}</div>
                  <div style={{ fontSize: ".78rem", color: "#c4a35a", marginTop: ".15rem", fontStyle: "italic" }}>{res.pSub}</div>
                </div>
                <div style={{ background: "rgba(196,163,90,.07)", borderRadius: "8px", padding: ".9rem", borderLeft: "3px solid rgba(196,163,90,.5)" }}>
                  <div style={lbl}>⚔️ Combat Style</div>
                  <div style={{ fontSize: ".93rem", color: "#f5e090", lineHeight: 1.4 }}>{res.combatStyle}</div>
                </div>
              </div>
            </div>

            <div style={cardSt}>
              <h3 style={secTitle}>👥 Your Party ({res.comps.length} companions)</h3>
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
              <h3 style={secTitle}>⚖️ Key Decisions</h3>
              {res.decisions.map(d => <DecisionRow key={d.cat} d={d} />)}
            </div>

            <div style={cardSt}>
              <h3 style={secTitle}>🧩 Companion Quests</h3>
              {res.companionQuests.map(d => <DecisionRow key={d.cat} d={d} />)}
            </div>

            <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.75rem" }}>
              <button onClick={roll} style={{ flex: 1, padding: ".85rem", background: "rgba(196,163,90,.1)", border: "1px solid rgba(196,163,90,.3)", borderRadius: "8px", color: "#c4a35a", fontFamily: "Georgia,serif", fontSize: ".9rem", cursor: "pointer", letterSpacing: ".05em" }}>🎲 Reroll</button>
              <button onClick={copy} style={{ flex: 1, padding: ".85rem", background: ok ? "rgba(80,160,80,.13)" : "rgba(196,163,90,.1)", border: ok ? "1px solid rgba(80,160,80,.35)" : "1px solid rgba(196,163,90,.3)", borderRadius: "8px", color: ok ? "#90d090" : "#c4a35a", fontFamily: "Georgia,serif", fontSize: ".9rem", cursor: "pointer", transition: "all .25s" }}>{ok ? "✅ Copied!" : "📋 Copy to Clipboard"}</button>
            </div>
          </div>
        )}

        {/* Feature Request */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,163,90,.22)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.25rem" }}>
          <button
            onClick={() => setShowFeature(!showFeature)}
            style={{ width: "100%", padding: "1rem 1.5rem", background: "none", border: "none", cursor: "pointer", color: "#c4a35a", fontFamily: "Georgia,serif", fontSize: ".9rem", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>💡 Request a Feature</span>
            <span style={{ fontSize: ".8rem", opacity: .6 }}>{showFeature ? "▲ collapse" : "▼ expand"}</span>
          </button>
          {showFeature && (
            <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid rgba(196,163,90,.15)" }}>
              <p style={{ fontSize: ".85rem", color: "#907050", margin: ".9rem 0 .75rem", fontStyle: "italic" }}>Got an idea to make this generator better? Let us know.</p>
              <textarea
                value={featureText}
                onChange={e => setFeatureText(e.target.value)}
                placeholder="Describe your feature idea..."
                rows={4}
                style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,163,90,.25)", borderRadius: "8px", padding: ".75rem", color: "#e8d5a3", fontFamily: "Georgia,serif", fontSize: ".9rem", resize: "vertical", boxSizing: "border-box", outline: "none" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: ".75rem" }}>
                <button
                  onClick={submitFeature}
                  disabled={submitStatus === "sending" || !featureText.trim()}
                  style={{ padding: ".7rem 1.5rem", background: submitStatus === "sent" ? "rgba(80,160,80,.2)" : "rgba(196,163,90,.15)", border: submitStatus === "sent" ? "1px solid rgba(80,160,80,.4)" : "1px solid rgba(196,163,90,.35)", borderRadius: "8px", color: submitStatus === "sent" ? "#90d090" : "#c4a35a", fontFamily: "Georgia,serif", fontSize: ".9rem", cursor: submitStatus === "sending" || !featureText.trim() ? "not-allowed" : "pointer", opacity: !featureText.trim() ? .5 : 1, transition: "all .25s" }}>
                  {submitStatus === "sending" ? "Sending..." : submitStatus === "sent" ? "✅ Sent!" : submitStatus === "error" ? "❌ Failed — try again" : "Send Request"}
                </button>
                {submitStatus === "sent" && <span style={{ fontSize: ".8rem", color: "#907050", fontStyle: "italic" }}>Thanks! We'll consider it for a future update.</span>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(196,163,90,.12)", color: "#4a3f28", fontSize: ".75rem" }}>
          All 12 classes · 46+ subclasses · 11 races · 10 companions · Patch 8<br />
          <span style={{ fontStyle: "italic" }}>The Forgotten Realms await. May the dice be in your favour.</span>
          <div style={{ marginTop: "1rem" }}>
            <a href="https://account.venmo.com/u/greenleadermusic" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", padding: ".5rem 1.25rem", background: "rgba(196,163,90,.12)", border: "1px solid rgba(196,163,90,.3)", borderRadius: "8px", color: "#c4a35a", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: ".85rem", letterSpacing: ".05em" }}>
              💛 Donate via Venmo
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}