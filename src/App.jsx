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
  combatStyles: {
    Barbarian: ["Reckless frontliner — charge in and hit everything", "Tank it out — absorb damage for the party", "Rage and isolate — focus down one target at a time"],
    Bard: ["Buff and inspire from the backline", "Crowd control — keep enemies locked down", "Sneaky skirmisher — get in close and cause chaos"],
    Cleric: ["Pure healer — keep your party alive above all", "Battle cleric — armoured and on the front line", "Blaster — smite enemies with divine power from range"],
    Druid: ["Wild Shape brawler — transform and fight up close", "Summoner — let your creatures do the work", "Spell artillery — control the battlefield from safety"],
    Fighter: ["Relentless aggressor — never stop pressing the attack", "Tactical controller — use manoeuvres to dictate the fight", "Durable anchor — hold the line and protect allies"],
    Monk: ["Mobile striker — hit fast, move constantly", "Crowd controller — stun and lock down enemies", "Glass cannon — maximise damage output, stay out of range"],
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
    "Duergar": ["Duergar"],
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
const DEMOJI = { "Alignment":"⚖️", "Dialogue Approach":"💬", "Roleplay Focus":"🎭", "Origin":"🎭", "Act 1 — The Grove":"🌿", "Shadowheart's Path":"🌑", "Astarion's Fate":"🧛", "Act 3 — Allegiance":"🧠", "Ending":"👑" };

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
const CLS = Object.keys(DATA.classes);

function pickRace() {
  const race = pick(Object.keys(DATA.races));
  const subraces = DATA.races[race];
  const subrace = pick(subraces);
  return subrace === race ? subrace : subrace;
}

function generate(sp, cm) {
  const pc = pick(CLS);
  const pool = cm === "party" ? DATA.companions.filter(c => c.act === 1) : DATA.companions;
  const count = cm === "party" ? 3 : cm === "random" ? Math.floor(Math.random() * 4) + 3 : parseInt(cm);
  const comps = pickN(pool, count).map(c => { const ac = pick(CLS); return { ...c, cls: ac, sub: pick(DATA.classes[ac]) }; });
  const decisions = (sp === "safe" ? DATA.decisions.safe : [...DATA.decisions.safe, ...DATA.decisions.spoiler])
    .map(d => ({ cat: d.cat, choice: pick(d.opts) }));
  return {
    origin: sp === "safe" ? "Custom Character (Tav)" : pick(["Custom Character (Tav)", "Dark Urge"]),
    pClass: pc,
    pSub: pick(DATA.classes[pc]),
    pRace: pickRace(),
    combatStyle: pick(DATA.combatStyles[pc]),
    bg: pick(DATA.backgrounds),
    comps,
    decisions,
  };
}

const lbl = { fontSize: ".67rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#907050", marginBottom: ".3rem" };
const cardSt = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,163,90,.22)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.25rem" };
const secTitle = { margin: "0 0 1rem", fontSize: ".72rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#c4a35a" };

export default function App() {
  const [sp, setSp] = useState("safe");
  const [cm, setCm] = useState("random");
  const [res, setRes] = useState(null);
  const [ok, setOk] = useState(false);
  const roll = useCallback(() => { setRes(generate(sp, cm)); setOk(false); }, [sp, cm]);
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
      ...res.decisions.map(d => `${d.cat}: ${d.choice}`)
    ].join("\n");
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
          <h2 style={secTitle}>⚙️ Options</h2>
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
              <h3 style={secTitle}>🧙 Your Character</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".85rem", marginBottom: ".85rem" }}>
                {[
                  { l: "Origin", v: res.origin },
                  { l: "Race", v: res.pRace },
                  { l: "Background", v: res.bg },
                ].map(i => (
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
          All 12 classes · 46+ subclasses · 11 races · 10 companions · Patch 8<br />
          <span style={{ fontStyle: "italic" }}>The Forgotten Realms await. May the dice be in your favour.</span>
        </div>
      </div>
    </div>
  );
}