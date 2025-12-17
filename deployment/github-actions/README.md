# GitHub Pages Deployment Guide

## Prerequisites

1. Your repository must be public
2. GitHub Pages must be enabled in your repository settings
3. Node.js (v18 or higher) installed on your local machine

## Steps to Deploy

### 1. Enable GitHub Pages in Your Repository

1. Go to your GitHub repository
2. Navigate to "Settings" → "Pages"
3. Under "Source", select "Deploy from a branch"
4. Select "gh-pages" as the branch and "/ (root)" as the folder
5. Click "Save"

### 2. Update GitHub Actions Permissions (if needed)

1. Go to your repository
2. Navigate to "Settings" → "Actions" → "General"
3. Under "Workflow permissions", select "Read and write permissions"
4. Click "Save"

### 3. Push Changes to GitHub

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 4. View GitHub Actions Workflow

1. Go to your repository
2. Navigate to "Actions" tab
3. You should see the "Deploy to GitHub Pages" workflow running
4. After completion, your site will be deployed

### 5. Access Your Deployed Site

Your textbook will be available at:
`https://[your-username].github.io/[repository-name]`

For this repository, it will be:
`https://MuhammadTayyab8.github.io/hackathon-1`

## Manual Deployment (Alternative Option)

If you prefer to deploy manually:

```bash
# Install dependencies
cd textbook
npm install

# Build the site
npm run build

# The build output will be in textbook/build/
# You can manually copy these files to gh-pages branch
```

## Troubleshooting

1. **Workflow not running**: Make sure GitHub Actions are enabled for your repository
2. **Permission errors**: Check that the workflow has proper permissions 
3. **Build errors**: Check the GitHub Actions logs for specific error messages
4. **Content not updating**: Make sure to push changes to the main branch

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a CNAME file to your repository root with your domain
2. Update the `deploy-docs.yml` workflow to uncomment and configure the `cname` setting
3. Configure your DNS provider to point to GitHub Pages

## Notes

- The site automatically rebuilds and deploys when you push to the main branch
- The deployment process usually takes 1-5 minutes
- The site will be available at the GitHub Pages URL once deployment is complete