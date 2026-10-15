---
title: Function first, brand later
type: narrative
status: draft
created: 2026-10-14
updated: 2026-10-14
description: The mixed draft of the KOL post
aliases:
  - stack-mixed
tags:
  - domain/stack
  - audience/public
related:
  - "[[01-conceptual|conceptual]]"
  - "[[02-technical|technical]]"
  - "[[04-graphics|graphics]]"
---

# Function first, brand later

KOL is the design system behind the tools I build: a compositor, a synthesiser rack, a notes
app, a chess archive, this site. It began as the Kolkrabbi brand written in code. It is now a
set of parts that reads a brand as input. Here is how that happened, and the part of the
process that is backwards on purpose.

## Origin

Four months ago the system was one application with good bones. We split the bones into four
packages: the CSS, the icons, the components, and the site shell. Everything since has been
one move repeated: when a second tool needs a part, the part gets its own package. Today there
are twenty-two of them, from a single button up to a whole design editor.

The brand went the other way. It used to be the system. Now it is a small manifest, four
colours, three typefaces, a logo and the space around it, that the system reads at startup.
Swap the manifest and the same parts render as somebody else's product. The system kept the
logic; the look became a setting.

## The shape

```text
foundation   the CSS · 344 icons on one grid
core         components · site shell · app shell
domain       dashboards · chess · hardware · content · store · foundry · notes · decks
engines      markdown · search  (plain JavaScript, no interface)
app          the design editor  (the one package that is a program, not parts)
```

Dependencies point down and never up. A dashboard card uses a button; a button never knows
dashboards exist. That rule has held for four months and it is the reason the stack can be
taken apart.

Everything ships as source. There is no build step between what we wrote and what a tool
installs. If a component is wrong, the person using it can open the file and read why.

## The seam

Inside the repo, every package links to every other and a change is live on save. Outside the
repo, nothing links: a tool installs a numbered version from npm like any other dependency.

That line between inside and outside is the one rule we have never bent. It is also where the
cost lives.

## Round trips

A tool needs a change. It files a ticket: what, where, and the evidence. The system builds
it, runs its checks, publishes a version. The tool bumps to that version and verifies. Five
hops.

That is how every shared library works, and it works because many consumers share the cost of
each change. KOL's packages mostly have one consumer. So the loop runs at full cost and
protects nobody in particular.

We ran it anyway, and kept the receipts: 326 tickets closed since mid-August. Most are small. A
menu row that would not stretch. A dropdown with no accessible name. A size label that turned
with the box it labelled. One-line fixes, each with a five-hop trip.

## Fork & return

For the editor, we stopped.

The design editor is the biggest thing KOL ships and the thing under the heaviest development.
Pushing every change through the loop was the wrong kind of discipline. So the tool that drives
the editor took the source home and builds it there. The system keeps a mirror, refreshes it
after the fact, and publishes that copy for everyone else.

The split is clean on paper. The system still owns the parts: a button is a button wherever it
appears, and the editor files for one like any other tool. The tool owns the application. We
expect to do this again. We also expect it to bite, because the checks that live in the system
no longer see the change until it is already made.

## Function first

A design system is meant to be where the look is decided. In KOL the look was decided last.

The rack needed a fader that is a two-pixel line on a panel. The compositor needed an
inspector that fits two hundred controls in a column. Those were built to work, in the tool,
under real use, and they looked like what they were. Then the rules were written to fit: one
height per control size, one ladder of ink strengths, icons drawn in a stroke colour and never
a fill.

Backwards by the book. But the rules written first, for tools that did not exist yet, would
have been guesses. These were measurements. The system now checks itself against thirty-odd
gates on every change, and nearly every gate exists because the thing it checks had already
gone wrong once.

## What works

- **One copy of each thing.** Two tools used to carry the same app shell, hand-copied. They
  drifted, including the same bug twice. Now there is one shell and one fix.
- **Tickets as specs.** Every change that came from a tool has a file: the ask, the evidence,
  the version that closed it. Nothing is folklore.
- **Prove by use.** A new system is built as a small working app over fake data before it is
  published. Clicking it finds what reading it misses.
- **Docs that render the parts.** The site documenting the system runs the system. When a part
  breaks, the page breaks.

## What doesn't

- **One consumer per package.** The round trip is pure overhead until a second consumer
  arrives, and for most packages none has.
- **Ruling blind.** The system decided how tall an article card should be, twice, and was wrong
  twice. The site that renders the cards knows. That decision moved there.
- **Versioning from the wrong place.** The editor was published from its own tool for two
  months, outside every check, pinned to a package that no longer existed. The boundary is the
  lesson: a part is versioned at the system or it is not versioned at all.

## Next

KOL is rebuilt while it is being used. It is not a finished kit. It is the current state of an
argument about what the tools need, kept in one place so the argument is only had once.

## Sources

- KOL, the live system: https://ui.kolkrabbi.io
- The packages: https://www.npmjs.com/org/kolkrabbi
- The source: https://github.com/Tor-Grimsson/kol-ds
