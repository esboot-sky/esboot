# AGENTS.md Guidance Design

## Goal

Add a root-level `AGENTS.md` that gives coding agents accurate, concise guidance for this repository and directs all esboot-related work through the user's already-installed `esboot` skill.

## Scope

- Adapt the structure of the referenced Code Atlas `AGENTS.md` to this repository.
- Describe only project structure, commands, and conventions that can be verified from the repository.
- Add an explicit esboot workflow rule: for esboot configuration, commands, development, troubleshooting, upgrades, or related questions, invoke the installed `esboot` skill before proceeding.
- Assume the `esboot` skill is already installed. Do not search for it, suggest installation, or run an installation flow unless skill invocation reports that it is unavailable.
- Keep the guidance short enough to remain useful as always-on agent context.

## Proposed Structure

1. Repository summary.
2. Project shape and important directories.
3. Common package commands taken from `package.json`.
4. esboot skill policy.
5. General working and verification rules based on existing scripts and project conventions.

## Validation

- Confirm the file is named exactly `AGENTS.md` at the repository root.
- Confirm every documented command exists in `package.json`.
- Confirm the esboot policy covers development, configuration, troubleshooting, and upgrades, while treating the skill as preinstalled.
- Review the final diff for unsupported project claims.
