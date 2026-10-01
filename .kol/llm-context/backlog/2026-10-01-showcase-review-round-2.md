# Showcase review, round 2 — the user's points, verbatim

**Raised:** 2026-10-01, ten messages against ui.kolkrabbi.io. Typos kept. `[Image #N]` are his screenshots (session images, not saved here).
**Plan:** `../plan-2026-10-01-showcase-review-round-2.md` — every point below is mapped to a W there by its P-number.

---

## P1 — Search overlay (⌘K)

> in search overlay (command k) when you type something in f.e. tag you get a tag suggestion [Image #1] which you can click to directly enter the atom, but if you press enter it takes you to the results page, I think enter should also take you to the atom but something like command enter take you to the index and make 'all results...' at the bottom also be a link to the results page. does that make sense?

## P2 — Search results page

> the search results page is a mess, [Image #2]
> - frontmatter can be hidden by default on this page (unhidden by the F), its not important to the results.
> - then we have 4 segmentedtoggle 'Results, Tags, Graph and A-Z which I presume is the index'
> - then section is search and the title is search, seems like redundant noise taking up space? can we find a search results page to reference, shadcn doesn have one, neither does minimax, if you know one, send me the url.
> - then we have results + number '29 results for "tag".'
> - then we have the text input with the entered search keyword along with 6 categories: 'Everything, Styles, Library, Docs, Search Development', and a 'read as' which lists a pill with the keyword: [Image #4] which interestingly is a pill not a tag component.
> - below that we have another set of tabs: Kind Category and Tags, which then list below 4 more tags: 'reference 12, component 8, doc 7, tool 2', at this point we have a divider, then again get the second line saying the 'Results + number'
> - then we get the results card component, + the matched keyword underlined, which does not match the underline we put on hover [Image #6] and hover doesnt do anything else. in general the results card is very low opacity so everything seems unimportant. I would rather on hover put the title to max opacity or use the other variant which had the background change, or both. And why do the cards have 3 keywords in mono, what does that mean? and why are some first letter capital, other not? and why do some have description other not, none have a path listed, which seems more relevant?
> - Shadcn uses icons [Image #7] we have icons, it would maybe visually make things more interesting?
> - Basic point here is why are there so many categories and options, is it relevant to the results we are seeking as a 'searcher', some of these belong in the search home space, but making that home also the results page wholesale might be a mistake?

## P3 — Tags and nodes

> in nodes, pressing a node souldnt take you out of node view, it should give you an option. maybe a list in the node view or sidebar of connected tags. And is the node viewer only showing tags,? in obsidian you also get files and orphans, and options, [Image #8] with settings [Image #9] not saying we need everything.
> also in obsidian pressing a tag opens it as a search result in the sidebar [Image #10]
>
> I wonder about tags, and the bother of tags having to have to go through code or the mds. can we not set it so that I can set tags myself? connect the site to a d1? or something that stores the tags I set there temorarily and then gets merged in a code session. just thinking out loud. lets talk about it, I'm not married to it, just a wandering thought.
>
> sidebar shows also results but only categories, and breaks the collapse rule, we need to think about this [Image #11]
>
> And if you go from results to tag to graph to results it doesnt take you to results, but to search home, thats a loop bug, should it not show you the search keyword again? (group with previous messaage about the search list)
>
> Tags home doesnt have frontmatter, nor does graph or index, results isnt even a page it just an alias to search which is the only one with frontmatter.
>
> these items have icons [Image #12] but I think nothing else in sidebars have icons, but we have a bunch of icons, it would be cool to think about implementing some of them? give the pages some life/breath no break up the text information overload.
>
> what does domain as a group have to do with search? I see it all the time all over the site as a parent tag, and Im trying to understand it. in search I would think search would be the parent or index or whatever parent group is in question then tags being actual serach or space related? it would be simpler for me to try to tag this out myself or we do some sort of back and forth about the tags as a special session.

## P4 — Development space, right rail, references

> - in development neither references or quarentine have homes.
> - related tools left sidebar breaks the collapse/expand rule [Image #13] there should be sub pages, or smth this is not allowed. lets talk about solution to this.
> - the on this page --and this is site wide-- in the right sidebar always skips the first part, just lists the next part, probably its h2 or something, but should on this page not also show the first part even if it is h1?
> - below references table theres a bug [Image #14] space missing above the divider
> - the content filters actually use tags [Image #15] while search results page use pills and buttons, clearly that is weird, lets talk about that (group with search results page)
> - reference page has nothing 'on this page' which I've said before is illegal, and just illogical, it cant happen something is always on this page. if on this page only lists markdown format, then it also reinforces the importance of concistently using markdowns and frontmatter.
> - open questions dont have frontmatter, only open questions home has, not the actual entries.

## P5 — Library rail, header, the reference home, intro pages

> - this is incorrect [Image #16] why does library as a home have to list it self as the parent? we dont need that in the sidebar, and I've never approved this new level in the sidebar introduced. it should just show group-by, composition and Collection as top level (uppercase) - talk about if you have questions
> - can library be nr 1 in the header, then styles nr 2?
> - I wonder if we can shortcut show everything in the sidebar? and where is the sitetree, just in /library? And I did ask about a page with conventions, syntax, namings, tiers, hierachy.. etc. did that ever get made? because I want that as a category in f.e. library, or the parent KOL? which would be what '/kol? or '/design-system? dunno, I just need to be able to quickly go and find things like the text opacity names, like the tier of mute f.e. strong? something I think 6 or 8 levels? I ofter need to reference it along with other tiers, and like here the site tree, we need a home for this I am saying is IMPORTANT and referenced alot information. can that be done?
> - and what does pin in right sidebar do? is there persistent memory in browser holding it in place?
> - and where are the copy copies? I dont see them anywhere but on the landing page once and in the components page and the packages base layer pages. just seems like buries information. Shadcn has introduction page [Image #17] and in their 'Sections' something I think we call 'Spaces' tho we dont mention or document it anywhere? theres also installation page [Image #18] which looks like [Image #19] - also look how they use gradient fade for information to reveals on scroll [Image #20]
> - we need another name for Blocks, thats shadcn lingo. lets talk about it.
> - also composition and collection items or just composition , can they have a landing page when going from showcase landing page? [Image #21] so we can use this format to scroll through components, blocks, apps, sets, packages? lets talk about it

## P6 — Resize handle

> - we should make another drag to resize variant: [Image #22] on hover this pointer, and either hover or click to highlight the border, with double click expanding (like if sidebar with icons)

## P7 — Landing page

> landing page has double padding [Image #23] both on the cards and on the page

## P8 — Component pages

> scandn reference https://ui.shadcn.com/docs/components/base/accordion read this and how they section the information, compare to ours.
>
> [Image #24] spacing issue
>
> section header (eyebrow?) has the path? not sure if thats relevant, not a huge issue
>
> double divider (or looks like) [Image #25] I think its because this minimal table variant puts a divider after last row? that maybe should be a prop and default off? and the table doesnt use the entire space, because look at this [Image #26] like these is padding, but I couldnt see padding there in the dev tools?
>
> in any case maybe there should also just be a bigger padding/gap btween the last item and the previous next nav.
>
> also [Image #27] what is this arrrow? not ours for sure. is this a component or ?
>
> [Image #28] same issue here space on the right, content doesnt extend to the width? its not a huge deal just wondering. But also there is a spacing issue from title to content, overlapping gap and paddingtop or margin? just look at the pixel space between Usage and the codebox vs. API and the table. devtools are very confusing with the classes. hard to decipher what is tailwind and what is hidden in classes.
>
> if I go to the button [Image #29] here the issue is not like in Action Button, how can 2 pages that use the same component to render the page have different spacing settings?
>
> [Image #30] this shows variant dropdown tone dropdown and size segmentedtoggle, I think size is self explanitory, but tone and variant arent. can we have in the variant dropdown say first item 'variant' then divider then the list? and in tone same, first line says 'tone' then divider and then the list? also what variant of segmentedtoggle is taht, it clashes with the dropdown having that border. maybe we change to dropdown? or make a new component with multi select dropdown toggle, like an 'overlay multi settings' component?
>
> then also at some point we have to go through the button, it has too many variants, that now the tone handles right? it could be simplified
>
> then also the preview background is so grey default tone/ (or primary variant) disapears. it has to be secondary tone or something.

## P9 — The components themselves

> if im in a component and press parent (atoms) in the sidebar it goes to atoms home, but collapses the list, but as we talked about the chevron collapses the title is a link, so I dont want to collapse the list like that when I just want to go to atoms home and still see the atoms list.
>
> there are many components still without preview, mostly in molecules it looks like, can this not be scanned, I think 3 times ive mentioned this.
>
> should audio player and video player not just be media player? whats the difference? you just ommit the video preview in audio and maybe a few props functionally? just wondering
>
> also how can audio player be an atom? it has nested items?
>
> badge with icon has no gap? [Image #31]
>
> avatar and profile avatar? why are they not the same component and variatns? or props?
>
> can we scan for overlap and reduncancy?
>
> and preview background clashes alot with the content, can we reduce the brightness, with just like fg-02, at least then you can see primary? or set default to secondary? dunno its werid not to see the border due to backgroudn, not very 'design system' of us.
>
> how can a chess board be an atom? arent chess pieces atoms? and chess board a molecule?
>
> rail section is also kind of a dropdown, famously a molecule?
>
> [Image #32] clearspace diagram is defineitely nested, has logomark, and grids? not an atom, and preview is broken
>
> [Image #33] rotary dial is an atom, but with the labels, arent they and many other hardware controls 'control+value lables'? which would be a molecule? or are they variants or porps of the atom? - and why is rocker switch with that background?
>
> why is close button lowercase with text? [Image #34] and what happened to the sizes of sectionlabel? oh they are in the stepper, then why show 3 lines?
>
> also 'back' loses the place vertically in the scroll. which sucks, now I have to scroll and find my place, lets use persistent memeory to go back to where you were ? at least incomponents + their home
>
> I think we need to audit the componetns, and define better whats an atom molecule organism, etc. maybe we need another category? or we have crazy overlap.
>
> HLS video how is that a visual component? is that specific the segmented video? if its a video player fine, but hls is very specifically visual ?
>
> in component preview, tones in segmentedtoggle have a bug, dont do anything. and why does sizing start at md? should it not be relative to size ramp from smallest to biggest?

## P10 — Action button, atoms home

> why is action button its own atom component, should it not be nested from a button or iconframe? then making it a molecule? just wondering.
>
> also in atoms home, maybe a dropdown for the biggest groupings? or dropdown toggle, say I just want to see the hardware control, or not show it. the contentfilters make it a bit backwards. Simpler would be a check list dropdown here [Image #35] on the right side? where often theres a text toggle.
