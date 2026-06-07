# Rho App - Session Verification Checklist

## ✅ Completed

### Growth Chart (Groei Page)
- [x] WHO percentile curves visible (P3, P15, P50, P85, P97)
- [x] Data points (measurements) plotted as white dots on curves
- [x] Dots properly aligned with measurement date (age in weeks)
- [x] Dots larger (r=7) with stronger ring effect
- [x] All 3 tabs render (Gewicht, Lengte, Hoofd)
- [x] Hover tooltips show: date (nl-NL format), value, percentile
- [x] Measurements list below chart shows all data
- [x] Add measurement button (?new=1) functional

### Milestones Page
- [x] View modal: read-only display of milestone
- [x] Edit modal: allows changing date, description, photos
- [x] Modal content scrollable (flex-1 overflow-y-auto)
- [x] Delete button visible and accessible
- [x] Success message shown on save (✓ Opgeslagen!)
- [x] Photo upload with compression (optional)
- [x] Photo delete (×) button immediate removal from UI
- [x] Optimistic UI: save/delete closes modal immediately
- [x] Background sync to database

## 🔄 Pending Verification

### Milestones - Scroll & Delete Test
- [ ] Modal scrolls smoothly when content exceeds viewport
- [ ] Delete button visible on first view (no scroll required)
- [ ] Delete button sticky at bottom while content scrolls
- [ ] Delete confirmation modal appears
- [ ] Delete removes milestone from grid after confirmation
- [ ] Deleted milestone actually removed from database (refresh shows gone)

### Photo Upload Timing
- [ ] Photo compression feedback shown (spinner visible)
- [ ] Photos appear in preview immediately after selection
- [ ] Save shows success feedback
- [ ] Performance acceptable (user feedback noted as "takes a while")

## Test Instructions

```bash
# Growth chart hover tooltip
- Navigate to /groei
- Hover over any white data point (circle) on the chart
- Verify tooltip appears with: date, value, percentile

# Milestone scroll & delete
- Navigate to /milestones
- Click on any achieved milestone card
- Check if delete button visible without scrolling
- Scroll content up/down - verify buttons stay sticky at bottom
- Click delete button
- Confirm deletion in dialog
- Verify milestone removed from grid
- Refresh page - verify deleted milestone stays gone
```
