---
title: A design system that outgrew its brand
type: narrative
status: draft
created: 2026-10-14
updated: 2026-10-14
description: The conceptual draft of the KOL post
aliases:
  - stack-conceptual
tags:
  - domain/stack
  - audience/public
related:
  - "[[02-technical|technical]]"
  - "[[03-mixed|mixed]]"
  - "[[04-graphics|graphics]]"
---

# A design system that outgrew its brand

KOL started as the visual language of one studio. Four months in, it is a system of parts that
any tool I build can wear, and the studio's own brand is just one of the things it can be told
to look like. This is what that turned into, what worked, and what did not.

## Origin

Every studio ends up with a pile of interface pieces. A button here, a card there, a colour
scale somebody tuned once and nobody dared to touch. Ours lived inside one website, then inside
three, each copy a little different from the last.

The fix was obvious and late: pull the pieces out, give them one home, and make the websites
borrow them instead of owning them. That home is KOL. The name is the first three letters of
Kolkrabbi, and for a while the system was the brand, drawn in code.

It is not anymore. The brand is now a manifest: four colours, three typefaces, a logo and its
clearspace. KOL reads that manifest and dresses itself. Hand it a different manifest and the
same parts come out looking like somebody else's work. The system kept the structure; the brand
became an input.

## The shape

KOL is not one thing. It is a stack of small things, each with a job, each depending only on the
layer beneath it.

At the bottom is the foundation: one file of colour, type and spacing rules, and one set of
icons drawn on the same grid. On top of that sit the components, from a single button up to a
whole editor panel. Above those are the parts that only some tools need: charts for a
dashboard, a chess board, a rack of synthesiser controls, a type specimen page, a shop.

The rule for where something lives is simple. A part earns its own box when a second tool
needs it. Until then it stays where it was born.

There is no build step. What is published is the source itself, readable and patchable by
whoever installs it. One exception exists, and it is the whole design editor, which is an
application rather than a part.

## The seam

Inside the repo everything links to everything, and a change shows up everywhere at once. That
is fast and correct for the people maintaining the system.

Outside the repo nothing links. A tool installs a numbered version from the package registry,
the same way it installs any other dependency. It gets exactly what was published, nothing
newer, nothing stale, nothing that depends on which laptop it was built on.

Keeping those two worlds apart is the one rule that has never been broken. It is also where the
trouble starts.

## Round trips

Here is the loop. A tool needs a change to a component. It files a request. The system builds
the change, checks it, publishes a new version. The tool updates to that version and checks
again. Five hops, and a one-line fix takes all five.

The loop is correct. It is how every shared library works. The problem is that most of our
parts have exactly one consumer, so the loop protects nobody. It just slows the one tool that
cares.

We ran it anyway, and kept count. Since August the system has closed 326 of those requests, most
of them from two tools. The ledger is honest about what they were: a label that rotated with its
box, a menu row that would not go full width, a close button a hundred pixels from the row it
belonged to. Real fixes, each one the full round trip.

## Fork & return

So we broke the rule, on purpose, for one case.

The design editor is the largest thing KOL ships and the most active thing we build. Running
its development through the loop was absurd. So the tool that drives the editor took the
source home. It builds the editor where it is used, ships it, and the system refreshes its own
copy afterwards and publishes that for everyone else.

The system still owns the parts. The tool owns the tool. The system catches up after the fact
rather than gating every step. We expect to do this again, and we expect to regret it
sometimes.

## Function first

A design system is supposed to be the place where the visual rules live. In KOL the rules
arrived late, because the tools arrived first.

A synthesiser rack needs a fader that is a two-pixel line on a panel, not a chunky slider. A
compositor needs an inspector that fits two hundred controls into a column. Those parts were
built to work, in the tool, under real use. Then the rules were written to match them: one
height per control size, one ladder of ink strengths, icons that take a stroke colour and
never a fill.

That order is backwards by the book. It is also the only order that produced parts anyone
wanted to use. The rules now hold, and the system checks itself against thirty-odd gates on
every change. But the gates were written to catch what we had already got wrong, not to
predict what we would.

## What works

One copy of each thing. Two tools once carried the same application shell, hand-copied, and
drifted. Now there is one, and the bug fixed once is fixed in both.

Requests as records. Every change that came from a tool has a file, a reason and the version
that closed it. Nothing is a mystery later.

Prove by use. A new system is built as a tiny working app first, with fake data and real
clicks, before anything is published. It is surprising how much that catches.

Live documentation. The site that documents the parts renders the parts. If a preview breaks,
the docs break, and someone notices.

## What doesn't

One consumer per part. The round trip is overhead with no payoff until a second tool arrives.

The system ruling on things it cannot see. The system once decided how tall an article card
should be, twice, and got it wrong twice. The site that renders cards knows; the system does
not. That decision moved.

Things published from the wrong place. The editor was published from its own tool for two
months, outside every check. The lesson was not the build, it was the boundary: a part is
versioned at the system, or it is not versioned at all.

## Next

KOL is a system that gets rebuilt while it is being used, and it shows. That is the point. It
is not a finished kit; it is the current state of an argument about what the tools need, kept
in one place so the argument does not have to be had twice.

## Sources

- KOL, the live system: https://ui.kolkrabbi.io
- The packages: https://www.npmjs.com/org/kolkrabbi
- The source: https://github.com/Tor-Grimsson/kol-ds
