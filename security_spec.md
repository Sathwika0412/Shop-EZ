# ShopEZ E-Commerce Security Specification

This document details the Zero-Trust Security Specification, Data Invariants, and Red Team "Dirty Dozen" payloads used to validate our Firestore rules.

## 1. Core Data Invariants

1. **Anonymous / Unauthenticated Read Access**: Anyone can browse the product catalog and read reviews.
2. **Identity Integrity**: For reviews and orders, the `userId` field in the incoming document MUST exactly match the authenticated user's UID (`request.auth.uid`).
3. **Admin Privilege Enforcement**: Only verified administrators can create, update, or delete products. Admin status is determined via lookups on `/admins/$(request.auth.uid)`.
4. **Order Ownership**: A customer can only read or list their own orders. Regular users cannot inspect other people's orders.
5. **No Direct Modifying of System Fields**: Fields like `createdAt` are immutable after document creation.
6. **Temporal Integrity**: Creation and modification timestamps must match the server's clock (`request.time`).
7. **Value Bounds**: Ratings must be integers between 1 and 5. Product prices and order total amounts must be positive numbers.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads represent attacks designed to break the laws of Identity, Integrity, and State, which MUST be rejected by the rules:

### A. Product Catalog Attacks (Admin-only Collection)
1. **Unauthenticated Product Creation**: Attempting to list a product as an unauthenticated or non-admin user.
2. **Product Price Value Poisoning**: Attempting to set a negative price `{"price": -250.50}` or an excessively large price.
3. **Denial of Wallet (ID Injection)**: Injecting a 2MB string as a product ID or creating a product with an invalid ID pattern.
4. **Regular User Price Manipulation**: Regular customer attempts to update a product's price from ₹50,000 to ₹1.

### B. Order Collection Attacks (Customer-only Writes)
5. **Order Identity Spoofing**: Signed-in user `user_A` attempts to write an order where `userId` is set to `user_B`'s UID.
6. **Order Price Poisoning**: Creating an order with `totalAmount: -1500` or a non-numeric total.
7. **Order State Shortcutting**: A customer attempts to update their order status directly to `Delivered` without going through the seller's workflow.
8. **Direct Order Reading (Privacy Breach)**: User `user_B` attempts to read user `user_A`'s order document by guessing the order ID.

### C. Product Reviews Attacks
9. **Review Identity Spoofing**: Signed-in user attempts to post a review as `userName: "Official Admin"` with `userId: "admin_uid"`.
10. **Review Rating Poisoning**: A competitor posts a review with rating `rating: 0` or `rating: 100` to break average rating math.
11. **Review Comment Flood**: Posting a comment containing a 50,000-character spam block.
12. **Reviewing Without Authentication**: An unauthenticated guest user attempts to write a product review.

---

## 3. Mock Test Cases for Security Audit

The corresponding rules checks are implemented in `firestore.rules`.
Every update block is guarded by `isValid[Entity]` and `affectedKeys().hasOnly()` actions.
The `admins` collection contains a document named after the admin's UID to authorize admin capabilities.
