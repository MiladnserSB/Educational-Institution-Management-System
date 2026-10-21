# Educational-Institution-Management-System
Educational Institution Management System (Monorepo) with a React frontend and Express backend, featuring JWT-based authentication, role-based access control, and management of students, teachers, and curricula

## Backend route checker

Start the backend, then run the non-destructive route checker from the `Backend` directory:

```powershell
$env:ROUTE_CHECK_CONFIRM = "YES"
npm.cmd run check:routes
```

The checker creates uniquely named test accounts and school records in the configured MongoDB database and leaves them there. It updates only the test records it created and never deletes records. It does not change document IDs. Do not run the regular `npm run seed` command for this check; that seeder clears existing collections.
