## Import Review Flow – Conversation Notes

### Current Behavior
- Imports now land in `pending_review` only when there are new or conflicted transactions; fully matched imports auto-complete.
- Import detail page shows account info, counters, donut chart, transaction table with selection + bulk approval, and a review drawer for single approvals.
- Import actions (approve/reject) require the import to be linked to an account. A banner with combobox lets the user relink if the original account was deleted.
- All success/error feedback for approvals and rejections now comes from backend flashes (via `FlashableForInertia` exceptions) instead of local toasts.

### Recent Fixes
1. **Account Relinking**
   - `imports/{import}/account` endpoint lets users choose another account.
   - Frontend blocks actions until an account exists and highlights the banner when a blocked action is attempted.

2. **Bulk Approval UX**
   - Toolbar layout adjusted to avoid clipping.
   - Disabled when approvals are not possible; banner highlight replaces ad-hoc toasts.

3. **Matched Transactions**
   - Rows show tooltip + “Ver transação” link for reconciled entries and no longer open the drawer.

4. **Counters & Chart**
   - `RefreshImportStatus` recalculates new/matched/conflicted counts so stats stay accurate after each action.
   - Added donut chart in summary card to visualize distribution.

5. **Notification & Toast Handling**
   - Review drawer and bulk actions no longer call `toast.success`; rely on backend flash messages.
   - New `ImportRequiresAccountException` and `ImportTransactionActionException` are Flashable for consistent frontend toasts.

### Follow-ups / Ideas
- Consider sticky bulk-action toolbar on scroll.
- Maybe expose conflict resolution helpers (e.g., quick comparison view).
- Evaluate if donut chart needs a legend or combined label.
