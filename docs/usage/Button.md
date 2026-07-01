# Button

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 591 across 182 files in 17 apps
- **Used in:** kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-distress, kol-divs, kol-draw-3d, kol-editor, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-noter, kol-radar, kol-radial, kol-resume

## Import

```jsx
import { Button } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-divs/src/components/site/CopyButton.jsx`:

```jsx
<Button variant="outline" size={size} onClick={handle} className={className}>
      {copied ? 'copied' : 'copy'}
    </Button>
```

From `kol-apparat/kol-docs/kol-noter/src/components/app-shell/ConflictResolutionDialog.tsx`:

```jsx
<Button
              variant={localNewer ? 'default' : 'secondary'}
              onClick={onKeepLocal}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
```

From `kol-apparat/kol-editors/kol-draw-3d/src/components/studio/LayersPanel.jsx`:

```jsx
<Button
          variant="primary"
          size="sm"
          animateIcon
          quiet
          iconOnly="plus"
          iconSize={12}
          aria-label="Insert layer"
          title="Insert layer"
          style={{ padding: 6 }}
        />
```

From `kol-apparat/kol-editors/kol-editor/src/components/organisms/InspectorPanel.jsx`:

```jsx
<Button
            variant="primary"
            onClick={onExpandBooleanGroup}
            className="w-full"
          >
            Expand Vector Shape
          </Button>
        </div>
      )}

    </>
```

From `kol-apparat/kol-editors/kol-radar/src/App.jsx`:

```jsx
<Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} iconLeft="upload" className="w-full">
          Upload Image
        </Button>

        {sourceImage && (
          <Button variant="primary" size="sm" onClick={handleDownload} iconLeft="download" className="w-full">
            Download
          </Button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,.svg" onChange={handleFileUpload} className="hidden" />
```
