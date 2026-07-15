# TypeSpecCard

- **Package:** `@kolkrabbi/kol-foundry`
- **Category:** flat
- **Real-world usages found:** 15 across 2 files in 2 apps
- **Used in:** kol-client-canalix, kol-client-canalix-contract

## Import

```jsx
import { TypeSpecCard } from '@kolkrabbi/kol-foundry'
```

## Real usage

From `kol-apps/kol-client-canalix-contract/src/pages/foundations/Typography.jsx`:

```jsx
<TypeSpecCard key={t.cls} label={t.role} meta={[['Class', `.${t.cls}`], ['Spec', t.spec]]}>
            <p className={t.cls}>{t.node}</p>
          </TypeSpecCard>
```

From `kol-apps/kol-client-canalix/src/_archive/pages/Typography.jsx`:

```jsx
<TypeSpecCard
            key={d.token}
            label={d.token}
            meta={[
              ['Family',       'Montserrat'],
              ['Weight',       weightName(d.weight)],
              ['Size',         `${d.size}px`],
              ['Line height',  `${d.lh}px`],
              ['Letter spacing','0'],
            ]}
          >
            <p style={{ fontFamily: MONT, fontWeight: d.weight, fontSize: d.size, lineHeight: `${d.lh}px`, letterSpacing: 0 }}>
              {d.sample}
            </p>
          </TypeSpecCard>
```

From `kol-apps/kol-client-canalix-contract/src/pages/foundations/Typography.jsx`:

```jsx
<TypeSpecCard key={t.cls} label={t.role} meta={[['Class', `.${t.cls}`], ['Spec', t.spec]]}>
            <p className={t.cls}>{t.sample}</p>
          </TypeSpecCard>
```

From `kol-apps/kol-client-canalix/src/_archive/pages/Typography.jsx`:

```jsx
<TypeSpecCard
            key={h.token}
            label={h.token}
            meta={[
              ['Family',       'Montserrat'],
              ['Weight',       weightName(h.weight)],
              ['Size',         `${h.size}px`],
              ['Line height',  `${h.lh}px`],
              ['Letter spacing','0'],
            ]}
          >
            <p style={{ fontFamily: MONT, fontWeight: h.weight, fontSize: h.size, lineHeight: `${h.lh}px`, letterSpacing: 0 }}>
              {h.sample}
            </p>
          </TypeSpecCard>
```

From `kol-apps/kol-client-canalix/src/_archive/pages/Typography.jsx`:

```jsx
<TypeSpecCard
            key={s.token}
            label={s.token}
            meta={[
              ['Family',       'Montserrat'],
              ['Weight',       weightName(s.weight)],
              ['Style',        s.italic ? 'Italic' : 'Regular'],
              ['Size',         '24px'],
              ['Line height',  '32px'],
              ['Letter spacing','0'],
            ]}
          >
            <p style={{ fontFamily: MONT, fontWeight: s.weight, fontSize: 24, lineHeight: '32px', letterSpacing: 0, fontStyle: s.italic ? 'italic' : 'normal' }}>
              The innovative path we have chosen has not become a limiting factor.
            </p>
          </TypeSpecCard>
```
