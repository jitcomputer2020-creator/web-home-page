# Security Specification — JIT Computer Training Institute Firestore Rules

## 1. Data Invariants
1. **Public Homepage State (`/siteContent/homepage`)**:
   - Only the single document `homepage` is readable (`get`) by public visitors; collection listing (`list`) is denied.
   - Only a verified administrator (`jitcomputer2020@gmail.com` with `email_verified == true` or registered in `/admins/{uid}`) may create or update `siteContent/homepage`.
   - Every write must include `updatedAt == request.time`, `updatedBy == request.auth.uid`, and strictly conform to the allowed top-level schema keys (`hasAll` + `hasOnly`) and bounded list sizes.
2. **Student Enquiries PII (`/enquiries/{enquiryId}`)**:
   - Student phone numbers (`mobile`), names, and inquiry messages are PII and must NEVER be readable (`get` or `list`) by public visitors or non-admin users.
   - Any visitor may `create` a new enquiry only if `enquiryId` matches `^[a-zA-Z0-9_-]+$`, `status == 'New'`, `mobile` matches `^[0-9]{10,12}$`, `type` is `'Demo'` or `'Enroll'`, and all strings respect strict bounds (`hasAll` + `hasOnly`).
   - Only a verified admin may `get`, `list`, `update` (status transitions only), or `delete` enquiries.
3. **Admin Registry (`/admins/{uid}`)**:
   - Users may only `get` their own document by UID; client-side writes/lists are blocked to prevent self-assigned privilege escalation.

## 2. Adversarial Payload Scenarios ("Dirty Dozen")
1. Unauthenticated write to `/siteContent/homepage` -> `PERMISSION_DENIED`.
2. Non-admin verified user write to `/siteContent/homepage` -> `PERMISSION_DENIED`.
3. Admin email claim with `email_verified: false` -> `PERMISSION_DENIED`.
4. Shadow/ghost field injection (`isSuperAdmin: true`) into `/siteContent/homepage` -> `PERMISSION_DENIED`.
5. Oversized array (>50 courses or >100 gallery items) in `/siteContent/homepage` -> `PERMISSION_DENIED`.
6. Deleting `/siteContent/homepage` -> `PERMISSION_DENIED`.
7. Public `get` or `list` on `/enquiries` -> `PERMISSION_DENIED` (PII protection).
8. Creating an enquiry with pre-set `status: 'Enrolled'` -> `PERMISSION_DENIED`.
9. Creating an enquiry with 1MB `message` string -> `PERMISSION_DENIED`.
10. Creating an enquiry with invalid `enquiryId` containing path/special chars -> `PERMISSION_DENIED`.
11. Updating an enquiry's `mobile` or `name` instead of `status` -> `PERMISSION_DENIED`.
12. Creating `/admins/{uid}` from client SDK -> `PERMISSION_DENIED`.
