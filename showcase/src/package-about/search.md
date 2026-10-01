The search engine behind this site's search box. You give it a list of things, each with a title, tags, a kind and a description, and it gives you back ranked results, the reason each one ranked where it did, and counts for every filter.

**What you can type.** Plain words must all match somewhere. Quote a phrase to match it exactly. Put `-` in front of a word to exclude it. Filter with `tag:` or `#`, `kind:` or `is:`, `space:` or `in:`, and `category:`, and bound dates with `after:` and `before:`. A bare word that names a category, such as `atom`, becomes that filter on its own.

**How it ranks.** A word scores by where it lands: an exact title match counts most, then the start of the title, a word inside it, a tag, a heading, a keyword, the description and the body.

Plain JavaScript, no interface and no dependencies.
