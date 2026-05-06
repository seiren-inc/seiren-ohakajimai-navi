/taskmaster

Use `.agent/workflows/task-intake-and-routing.md` as the master router for this task.

## Mission
- Run intake first.
- Select the correct skill chain.
- Execute in order with safety gates.
- Report in the required 5-part format.

## Step 1: Intake (ask briefly if missing)
Collect and lock:
- Goal
- Scope
- Constraints
- Done Definition
- Priority

If any are unclear, ask before implementation.

## Step 2: Safety gate
If task may affect DB/Auth/Stripe/WebAuthn/SEO routing or protected UI structure, stop and request explicit approval.

## Step 3: Route to skill chain
- Dashboard design via branching questionnaire (Animo-like, variants, GEO/MEO/SEO dashboard):
  - `dashboard-variant-designer` **first**
  - If user selects a variant and wants code shipped: chain into `implementation-flow`
  - `ui-qa-check` **only after** variants are locked and scoped
  - `docs-writer` if spec must be persisted (architecture note, rollout notes)
- Bug or failure:
  - `bugfix-flow`
  - `db-safe-update` (if DB/Auth/Stripe/WebAuthn involved)
  - `ui-qa-check` (if UI touched)
- Feature or code implementation:
  - `implementation-flow`
  - `db-safe-update` (if DB/Auth/Stripe/WebAuthn involved)
  - `ui-qa-check` (if UI touched)
  - `docs-writer` (if docs must change)
- Documentation task:
  - `docs-writer`
- Context too large or task switched:
  - `context-trim-flow`

## Step 4: Commit and handoff hooks
- If user explicitly asks to commit: run `commit-writer`.
- If session is ending or handoff requested: run `handoff-flow`.

## Step 5: Verification
Run the smallest relevant checks first, then expand as needed:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Output format (mandatory)
Return only:
1. status
2. files changed
3. why
4. validation
5. next step
