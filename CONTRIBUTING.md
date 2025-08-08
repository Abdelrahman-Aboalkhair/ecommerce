# Contributing to the E-Commerce Platform

Thank you for your interest in contributing to our e-commerce platform! This document outlines the guidelines for contributing to ensure a smooth and consistent development process. Whether you're fixing bugs, adding features, or improving documentation, your contributions are valued.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Development Workflow](#development-workflow)
  - [Finding Issues to Work On](#finding-issues-to-work-on)
  - [Creating a Pull Request](#creating-a-pull-request)
  - [Branch Naming](#branch-naming)
- [Coding Standards](#coding-standards)
  - [TypeScript and Next.js](#typescript-and-nextjs)
  - [Prisma and Backend](#prisma-and-backend)
  - [Component Structure](#component-structure)
  - [Styling](#styling)
- [Testing](#testing)
- [Committing Changes](#committing-changes)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure all interactions are respectful and inclusive.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **pnpm**: Version 8.x or higher
- **PostgreSQL**: Version 14.x or higher (or another database compatible with Prisma)
- **Git**: Latest stable version
- **Docker** (optional): For running services like the database
- A code editor like **VS Code** with extensions for TypeScript, ESLint, and Prettier

### Setting Up the Development Environment

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/ecommerce-platform.git
   cd ecommerce-platform
   ```

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**:

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your database URL and other required variables (e.g., `DATABASE_URL`, `NEXTAUTH_SECRET`).

4. **Set Up the Database**:

   - Ensure your PostgreSQL server is running.
   - Run Prisma migrations:
     ```bash
     pnpm prisma migrate dev
     ```
   - Optionally, seed the database with mock data:
     ```bash
     pnpm prisma db seed
     ```

5. **Run the Development Server**:
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

## Development Workflow

### Finding Issues to Work On

- Check the [Issues](https://github.com/your-username/ecommerce-platform/issues) tab for open issues labeled `good first issue` or `help wanted`.
- If you have a feature idea or bug fix, create a new issue to discuss it before starting work.

### Creating a Pull Request

1. **Fork the Repository** (if you're an external contributor).
2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**:
   - Follow the [Coding Standards](#coding-standards).
   - Ensure your changes are focused and address a single issue or feature.
4. **Run Linting and Tests**:
   ```bash
   pnpm lint
   pnpm test
   ```
5. **Commit Changes**:
   - Use clear commit messages (see [Committing Changes](#committing-changes)).
   ```bash
   git add .
   git commit -m "feat: add product filtering to dashboard"
   ```
6. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**:
   - Go to the repository on GitHub and create a PR.
   - Link the PR to the relevant issue (e.g., `Fixes #123`).
   - Provide a clear description of your changes and any testing steps.

### Branch Naming

Use the following conventions:

- `feature/<feature-name>`: For new features (e.g., `feature/product-search`).
- `fix/<bug-description>`: For bug fixes (e.g., `fix/login-error`).
- `docs/<doc-update>`: For documentation updates (e.g., `docs/readme-update`).
- `chore/<task-description>`: For maintenance tasks (e.g., `chore/update-dependencies`).

## Coding Standards

### TypeScript and Next.js

- Use TypeScript for all code. Ensure strict typing and avoid `any` unless absolutely necessary.
- Follow Next.js conventions for file-based routing and API routes.
- Use functional components with React hooks.
- Organize code in a modular structure:
  ```
  /app
    /components
      /atoms
      /molecules
      /organisms
      /templates
    /pages
    /hooks
    /store
  ```

### Prisma and Backend

- Use Prisma for database interactions. Keep schema definitions in `prisma/schema.prisma`.
- Structure API logic in separate files:
  ```
  /server
    /controllers
    /services
    /resolvers
    /utils
  ```
- Write services for business logic and controllers for API endpoints.
- Handle errors gracefully with try-catch blocks and return meaningful error messages.

### Component Structure

- Break down components into reusable atoms, molecules, and organisms.
- Use descriptive names (e.g., `ProductCard`, `DashboardSearchBar`).
- Pass props explicitly and use interfaces for type safety:
  ```typescript
  interface ProductCardProps {
    id: string;
    name: string;
    price: number;
  }
  ```

### Styling

- Use Tailwind CSS for styling.
- Follow a mobile-first approach with responsive classes (e.g., `sm:`, `md:`, `lg:`).
- Avoid inline styles unless necessary for dynamic values.
- Ensure accessibility with proper ARIA attributes and semantic HTML.

## Testing

- Write unit tests for services and utilities using Jest.
- Use React Testing Library for component tests.
- Ensure all tests pass before submitting a PR:
  ```bash
  pnpm test
  ```
- Aim for at least 80% test coverage for critical paths (e.g., authentication, product management).

## Committing Changes

- Follow Conventional Commits format:
  <type>(<scope>): <subject>

  Examples:
  feat(auth): add password reset endpoint
  fix(cart): correct total price calculation
  docs(readme): update setup instructions
  chore(deps): update dependencies

- Allowed Types:
  feat – New feature
  fix – Bug fix
  docs – Documentation-only changes
  style – Code style changes (formatting, no logic changes)
  refactor – Code refactoring without behavior change
  perf – Performance improvements
  test – Adding or updating tests
  build – Build system or dependency changes
  ci – CI/CD configuration changes
  chore – Maintenance tasks not affecting source/test files
  revert – Revert a previous commit

- Subject Rules:
  • Must be lowercase — no sentence case, start case, PascalCase, or ALL CAPS
  • Use imperative mood (e.g., "add", not "added" or "adds")
  • No period at the end
  • Keep under 50–72 characters

- Body & Footer (optional):
  • Leave a blank line before the body
  • Body explains what and why, not how
  • Footer for breaking changes or issue references:
  BREAKING CHANGE: auth API no longer accepts plaintext passwords
  Closes #123

- Keep commits small and focused.

Example:
git add .
git commit -m "feat(user-profile): add user profile component"

## Documentation

- Update the [README.md](README.md) or other relevant docs for new features or changes.
- Add inline comments in code for complex logic.
- Use clear, concise language in documentation, following Markdown best practices.

## Getting Help

- For questions or clarifications, open a [Discussion](https://github.com/your-username/ecommerce-platform/discussions) or join our community chat (link TBD).
- Report bugs or suggest features via the [Issues](https://github.com/your-username/ecommerce-platform/issues) tab.
- Reach out to maintainers for guidance on complex contributions.

Thank you for contributing to our e-commerce platform! Your efforts help make this project better for everyone.
