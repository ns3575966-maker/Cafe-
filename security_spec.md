# Security Specification - CafeDesk

## Data Invariants
1. Orders must contain valid non-negative totals and a valid 10-digit customer phone number.
2. Menu items can only be updated or created by authorized Cafe staff/owner.
3. Customers can read and create orders from public QR view, but cannot alter order status directly once created.
4. Reward redemption and stamp increments can only be performed by authenticated Staff/Owner.
5. All document IDs must be validated string types (`isValidId`).

## Dirty Dozen Payloads Audit
1. Negative order total (`total: -500`) -> BLOCKED
2. Invalid status shortcutting (`status: "Served"` on creation) -> BLOCKED (starts at `Received`)
3. ID Poisoning (1MB string key) -> BLOCKED by `isValidId()`
4. Unauthenticated Menu Item deletion -> BLOCKED
5. Customer phone number format poisoning (`customerPhone: "<script>..."`) -> BLOCKED
6. Self-assigned staff privileges -> BLOCKED
7. Spoofed timestamp in campaign sentAt -> BLOCKED
8. Direct modification of reward `isRedeemed` by unauthorized user -> BLOCKED
9. Updating `createdAt` on an existing order -> BLOCKED
10. Unbounded array injection in order items (> 50 items) -> BLOCKED
11. Blanket read access to PII phone numbers -> RESTRICTED
12. Arbitrary key injection into `settings/config` -> BLOCKED

## Firestore Security Rules Blueprint
Rules version 2. Default deny catch-all enabled. Public read for menu_items and settings/config. Public write for orders (create only for table QR ordering). Staff/Owner access for menu modification, order status updates, stamp management, and campaign tracking.
