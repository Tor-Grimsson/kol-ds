    prevPathname.current = location.pathname

    // Skip scroll reset on browser back/forward — browser restores position natively
    if (navigationType === 'POP') return
    // …and when only an overlay opened or closed over a page that never unmounted
    if (sameOverlayGroup(prev, location.pathname)) return
    scrollToTop()
  }, [location])

  return (
    <>
      {isLoading && location.pathname === '/' && <IntroLoader onEnter={handleEnter} />}
      <RouteLoader />
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route index element={<Home />} />
          <Route path="studio" element={<Studio />} />
          <Route path="work" element={<Suspense fallback={<div className="min-h-screen bg-surface-secondary" />}><Work /></Suspense>} />
          <Route path="work/:slug" element={<Suspense fallback={<div className="min-h-screen bg-surface-primary" />}><WorkDetail /></Suspense>} />
          <Route path="foundry" element={<FoundryTypefaces />} />
          <Route path="foundry/typefaces" element={<Navigate to="/foundry" replace />} />
          <Route path="foundry/typefaces/malromur" element={<FoundryMalromur />} />
          <Route path="foundry/typefaces/root" element={<FoundryRoot />} />
          <Route path="foundry/typefaces/trollatunga" element={<FoundryTrollatunga />} />
          <Route path="foundry/typefaces/dylgjur" element={<FoundryDylgjur />} />
          <Route path="foundry/typefaces/gullhamrar" element={<FoundryGullhamrar />} />
          <Route path="foundry/licensing" element={<FoundryLicensing />} />
          <Route path="stack" element={<Stack />} />
          <Route path="stack/:slug" element={<StackArticle />} />
          <Route path="prints" element={<Prints />}>
            <Route index element={null} />
            <Route path=":slug" element={null} />
          </Route>
          {/* Redirects: the docs left the live site (2026-10-05) */}
          <Route path="docs/*" element={<Navigate to="/workshop" replace />} />
          <Route path="workshop" element={<Workshop />}>
            <Route element={<WorkshopChrome />}>
              <Route index element={<WorkshopIntroduction />} />
              {/* One page per app, from data/workshop/pages; the open-in-place
                * frame lives at <id>/live for a page that declares `embed`. */}
              {PAGES.map((p) => (
                <Route key={p.id} path={p.id} element={<WorkshopPage id={p.id} />} />
              ))}
              {PAGES.filter((p) => p.embed).map((p) => (
                <Route key={`${p.id}-live`} path={`${p.id}/live`} element={<EmbedFrame src={p.url} title={p.title} />} />
              ))}
