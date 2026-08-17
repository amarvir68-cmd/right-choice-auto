# Build status

The repository has been normalized for production hosting and includes standalone Next.js output configuration, Vercel configuration, Dockerfiles, environment templates, SQL/RLS policies, and deployment instructions.

A full `npm install && npm run build` could not be completed inside the artifact-generation environment because outbound npm package installation timed out. No `node_modules` directory is bundled. This is intentional for normal source deployments: Vercel/Docker installs dependencies during build.

Before production launch, the hosting provider should execute the normal build command from each app directory:

```bash
npm install
npm run build
```
