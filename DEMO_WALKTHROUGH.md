# Demo Walkthrough — 3 minutes

The single sentence everything orbits:

> **PublicWire is not a chatbot that writes local news. It is an autonomous civic newsroom that checks public sources, decides what matters, verifies it, publishes it, and shows its work.**

That sentence is the spine. Every beat below serves it.

---

## What this demo must prove

The five things the judges should walk away believing:

1. **It acts before the user asks.** Agents are running the desk. The user opens an already-maintained edition.
2. **It monitors many overlooked sources.** Local civic information is technically public but functionally hidden.
3. **It publishes useful local briefs.** Not a dashboard, not a chatbot — a real-feeling local newspaper.
4. **It refuses or resends weak claims.** Hallucinations are caught, not published.
5. **It leaves an inspectable source-and-agent trail.** Every brief ships with its receipts.

---

## What we never say on stage

| Avoid | Say instead |
|---|---|
| *"We scrape websites and use AI to summarize them."* | *"Agents monitor public sources, detect meaningful changes, verify claims, and publish traceable civic briefs."* |
| *"Some of this is mocked."* | *"For the hackathon, we curated a polished demo edition. The agent pipeline runs on the same schema in production."* |
| *"Confidence is medium-high."* | *"The reader sees the evidence and the mentor's judgment. Technical confidence lives in the trace."* |
| *"This is just a Next.js site."* | *"This is a self-running civic newsroom. The frontend is the reader-facing surface; the agent swarm is the engine."* |

---

## Pre-demo checklist (run 2 minutes before going on)

- [ ] `npm run dev` running on a known port. Browser pre-opened on `/`.
- [ ] Hero parallax loads smoothly on the projector resolution (test the demo machine — desktop 1440×900 or 1080p is the safe target).
- [ ] At least one full pass through the demo path so Next.js has the route trees warmed.
- [ ] Browser zoom at **90–100%**, devtools closed, all extensions off.
- [ ] Cursor visible, font scaling at normal, no system dark mode override.
- [ ] Search dialog tested with **New Brunswick, NJ** — confirms the `LIVE` chip works.
- [ ] A second tab pre-opened on `/local/new-brunswick` as a fallback if the search dialog hiccups live.

---

## Beat-by-beat — the 3-minute script

### 0:00–0:25 — The problem (Landing, hero scroll)

**Voice line**
> "Local civic information is technically public, but functionally hidden. To know what's affecting them today, a resident would have to manually check city notices, county pages, council agendas, transit alerts, school updates, weather notices, PDFs, and campus event calendars."

**On-screen**
- Open `/`. The newspaper hero is full-bleed. Scroll once, slowly — the parallax pulls the image down while the content rises into view.
- Let the *Problem* section come into frame. Pause for one second on *"Public information, privately ignored."*

**Closer**
> "PublicWire turns that scattered public information into a self-running local newspaper."

---

### 0:25–0:50 — The product premise (Search dialog → area page)

**Voice line**
> "The agents have already been running the local desk. This isn't a chatbot where I ask for news. When I search, I'm being routed to an edition the system has been maintaining."

**On-screen**
- Click **Find your edition →** in the masthead (or scroll to the closing CTA and click there).
- The search dialog opens. Click the **New Brunswick, NJ · LIVE** chip. Hit Enter (or click Submit).
- The page fades to `/local/new-brunswick` via the global `PageTransition`.

**Optional aside**
> "For the demo we built one polished New Brunswick edition with several selectable locations. The operating model is the same for every place: sources, snapshots, agent decisions, published briefs."

---

### 0:50–1:25 — The edition (Today's Civic Briefing)

**Voice line**
> "This is the New Brunswick edition. It shows what was checked, what was found, what was rejected, and what was published. The feed is ordered by time and civic impact, so high-impact or freshly drafted entries lead."

**On-screen — point to (no clicks yet):**
- The dateline + edition queue panel ("28 source surfaces · 3 meaningful updates · 9 routine items filtered").
- The **Lead** badge on George Street construction. The **Monitoring** label on the parking agenda. The **Upcoming** label on the Rutgers event.
- The focus chips at the top (if you came in with `?focus=transportation,city-hall`).
- The rejected items column — *"Routine administrative minutes posted — no resident-facing change."* This is the **filter** moment.

**Key phrase**
> "The product is optimized for news worth reading, not maximum scraping volume."

---

### 1:25–2:10 — Open a brief + the trust layer (THE BIG MOMENT)

This is the demo's centerpiece. Slow down. This is the beat that wins the prize.

**Voice line**
> "Every brief includes the normal reader-facing version — summary, why it matters, who's affected, sources. But the important part is what's underneath. Watch."

**On-screen**
- Click **Investigate top brief** (or pick the **parking agenda** brief — its investigation trace has the verifier resend, which is the strongest visual). The Investigate dialog opens.
- Walk down the timeline:
  - `Source Monitor — checked` — agent opened the city agenda source
  - `Extractor — checked` — pulled the parking item but couldn't confirm policy status
  - **`Verifier — needs-evidence` (amber)** — *"Refused the first draft. The source supported 'agenda includes discussion' but not 'parking fees are changing.'"*
  - **`Editor — resent`** — *"Sent it back to Source Scout for corroboration instead of publishing an overclaim or silently dropping a useful update."*
  - `Source Scout — checked` — pulled secondary parking-authority context
  - `Verifier — verified` (green) — *"Approved a revised claim: the agenda includes a downtown parking discussion."*
  - `Mentor — published` — *"Required follow-up after the meeting."*

**The line that wins the prize**
> "Most AI systems would have either published this unverified or silently dropped it. PublicWire caught the unsupported claim, sent it back for more evidence, and only published a cautious version once the source actually backed it. **This is what a hallucination looks like in our system — caught, not published.**"

Pause for one beat after that sentence.

---

### 2:10–2:40 — The sponsor stack, told through the trace

Do **not** open a separate sponsor section. Stay inside the Investigate dialog and point at the per-step labels.

**Voice line, tied to what's already on the screen**
> "Under the hood: **Nimble** is the agent's browser for messy public websites and PDFs — the Source Monitor and Source Scout steps are both Nimble fetches. **ClickHouse** is the newsroom's memory — it tells the desk what's been seen before, which similar claims got rejected, and when a topic crosses an inquiry threshold. **Datadog** records every span you're scrolling through right now — the Investigate trace *is* a translated Datadog trace, made readable for the public. **Senso slash cited.md** closes the loop — every approved brief is published as a public, citeable artifact other agents can discover."

**Optional pointer at the bottom of the brief**
- The `cited.md demo artifact` label shows the sponsor handoff.

**The one-sentence framing for Datadog**
> "Datadog isn't just our debugger. It's the reader's magnifying glass. Every span the agents emit becomes a panel the reader can scroll through. **You're watching the detectives work.**"

---

### 2:40–3:00 — Close

**Voice line**
> "PublicWire is civic infrastructure. Autonomous agents monitor public sources, produce readable local updates, and expose the evidence trail. It makes local information easier to find, harder to fake, and more useful to residents."

**Final sentence — say it slowly, then stop**
> "**It is a newspaper where the newsroom is made of agents, and every story ships with its receipts.**"

---

## Navigation cheat sheet

| Beat | URL | Click target |
|---|---|---|
| Open | `/` | (none — scroll only) |
| Search | `/` | Hero CTA or masthead → search dialog → "New Brunswick, NJ · LIVE" chip → Enter |
| Edition | `/local/new-brunswick` | (none — scroll through metrics, queue, briefs, rejected) |
| Investigate | `/local/new-brunswick` | "Investigate top brief" button (or any brief's Investigate link) |
| Brief detail (backup beat) | `/briefs/george-street-construction` | masthead-style page with the full brief, audit log, mentor review, sources, artifact label |
| Cited.md handoff | Inside Investigate dialog | Point at the `artifactLabel` text in the published brief footer |

---

## What to optimize so it lands

1. **First paint of `/`** — Hero must render parallax smoothly within 800ms. No layout shift. Test the demo laptop's actual scroll behavior; framer-motion + Lenis can fight on lower-end displays.
2. **Search dialog → area page** — must route in under 1.2 seconds. The `PageTransition` fade-in covers any small jank.
3. **Above-the-fold on `/local/new-brunswick`** — top-story headline + edition queue panel must be visible on a 1440×900 demo screen *without* scrolling.
4. **Investigate dialog opens instantly** — no fetch on click, all data is in the static content layer.
5. **The amber step is unmissable** — the `needs-evidence` color in the trace must read as "wrong" at a glance. If it doesn't pop on the projector, bump the contrast before going on.
6. **The mentor review quote** — read aloud during the trace beat. *"Approved with cautious language. The brief should describe the agenda item, not claim a final policy change."* That sentence does enormous trust-layer work in 12 seconds.

---

## If something breaks

| Problem | Fallback |
|---|---|
| Dev server crashes mid-demo | Keep `npm run start` (production build) ready as a backup on a second port. |
| Search dialog won't open | Open `/local/new-brunswick` directly from the URL bar — the search dialog is *a* path in, not the only one. |
| Investigate dialog won't open | Open `/briefs/downtown-parking-agenda` directly — the same trace renders on the per-brief detail page. |
| Network glitch | Everything is statically rendered. Nothing in this branch fetches anything. You're fine. |
| Projector resolution is weird | The site is fully responsive; verify the masthead chips don't wrap. If they do, drop browser zoom to 90%. |

---

## What to skip if time is tight

If the room is running over and you're at the 2:00 mark with no Investigate beat shown yet:
- Skip the second-brief detail and the agent console.
- Go straight from the edition queue to the Investigate dialog on the **parking agenda** brief (it has the strongest amber-resend trace).
- The sponsor-stack section can collapse to a single sentence: *"Nimble fetches, ClickHouse remembers, Datadog records, Senso publishes — and every step you just watched is one of theirs."*

---

## What to extend if you have a bonus minute

- Show the per-brief detail page (`/briefs/george-street-construction`) — gives a more "real newspaper article" feel than the dialog.
- Re-open the search dialog and pick a *different* area (Newark or Jersey City) to demonstrate that the system has more than one edition.
- Open the rejected items list — point at *"Calendar formatting changed — page changed but the civic facts did not."* That single line is the entire "we filter noise" story in 12 words.

---

## Single-sentence backup pitches

If you only get 30 seconds with a judge in the hallway:
> "PublicWire is an autonomous civic newsroom — agents monitor public sources, verify claims, and publish short cited briefs. Every story ships with its receipts."

If you only get 10:
> "It's a self-running local newspaper made of agents that show their work."

If you only get 5:
> "Civic newsroom. Agents. Receipts."
