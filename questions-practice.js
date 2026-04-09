// questions-practice.js — 20 practice questions
const PRACTICE_Q = [
  {s:"Customer Support Agent",sc:"sp-1",d:1,
  q:"Production data shows that in 12% of cases, your agent skips <code>get_customer</code> entirely and calls <code>lookup_order</code> using only the customer's stated name, occasionally leading to misidentified accounts. What change would most effectively address this reliability issue?",
  opts:["Add a programmatic prerequisite that blocks <code>lookup_order</code> and <code>process_refund</code> calls until <code>get_customer</code> has returned a verified customer ID","Enhance the system prompt to state that customer verification via <code>get_customer</code> is mandatory before any order operations","Add few-shot examples showing the agent always calling <code>get_customer</code> first","Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type"],
  c:0,exp:"When a specific tool sequence is required for critical business logic, programmatic enforcement provides deterministic guarantees. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than ordering."},

  {s:"Customer Support Agent",sc:"sp-1",d:2,
  q:"Production logs show the agent frequently calls <code>get_customer</code> when users ask about orders (e.g., 'check my order #12345'), instead of calling <code>lookup_order</code>. Both tools have minimal descriptions and accept similar identifier formats. What's the most effective first step?",
  opts:["Add few-shot examples to the system prompt demonstrating correct tool selection, with 5–8 examples showing order queries routing to <code>lookup_order</code>","Expand each tool's description to include input formats, example queries, edge cases, and boundaries explaining when to use it vs similar tools","Implement a routing layer that parses user input and pre-selects the appropriate tool based on keywords","Consolidate both tools into a single <code>lookup_entity</code> tool"],
  c:1,exp:"Tool descriptions are the primary mechanism LLMs use for tool selection. Minimal descriptions mean the model lacks context to differentiate similar tools. Expanding descriptions is the lowest-effort, highest-leverage fix. Few-shot examples add token overhead without fixing the root cause. A routing layer bypasses the model's natural language understanding. Consolidating is a valid but more complex architecture change."},

  {s:"Customer Support Agent",sc:"sp-1",d:5,
  q:"Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward damage replacement cases while attempting to autonomously handle complex policy exception situations. What's the most effective fix?",
  opts:["Add explicit escalation criteria with few-shot examples demonstrating when to escalate vs resolve autonomously","Have the agent self-report a confidence score (1–10) and route to humans when confidence falls below a threshold","Deploy a separate classifier trained on historical tickets to predict which requests need escalation","Implement sentiment analysis to detect customer frustration and escalate when negative sentiment exceeds a threshold"],
  c:0,exp:"Explicit criteria with few-shot examples directly address unclear decision boundaries — the proportionate first response before adding infrastructure. LLM self-reported confidence (B) is poorly calibrated. A separate classifier (C) is over-engineered before prompt optimization has been tried. Sentiment (D) doesn't correlate with case complexity."},

  {s:"Customer Support Agent",sc:"sp-1",d:1,
  q:"You need to intercept outgoing tool calls and block refunds above $500, redirecting them to human escalation. Which Agent SDK approach provides deterministic enforcement?",
  opts:["PostToolUse hook that checks the refund amount after it executes and logs violations","A pre-execution tool call interception hook that inspects outgoing <code>process_refund</code> calls and blocks those exceeding the threshold before execution","System prompt rule: 'Refunds above $500 require manager approval'","A schema validator attached to the <code>process_refund</code> tool's input"],
  c:1,exp:"Pre-execution tool call interception blocks policy-violating actions before they execute. PostToolUse (A) runs after the tool has already executed — too late. System prompt rules (C) are probabilistic. A schema validator (D) enforces data types, not business rule thresholds."},

  {s:"Multi-Agent Research",sc:"sp-3",d:1,
  q:"After running the system on 'impact of AI on creative industries,' each subagent completes successfully but the report covers only visual arts, missing music, writing, and film. Coordinator logs show it decomposed the topic into: 'AI in digital art creation,' 'AI in graphic design,' and 'AI in photography.' What is the most likely root cause?",
  opts:["The synthesis agent lacks instructions for identifying coverage gaps","The coordinator's task decomposition is too narrow, assigning subtasks that don't cover all relevant domains","The web search agent's queries are not comprehensive enough","The document analysis agent filters out non-visual sources"],
  c:1,exp:"The coordinator logs reveal the root cause directly: it assigned only visual arts subtasks. Subagents executed their assigned tasks correctly — the problem is what they were assigned, not how they executed it."},

  {s:"Multi-Agent Research",sc:"sp-3",d:5,
  q:"The web search subagent times out while researching a complex topic. Which error propagation approach best enables intelligent coordinator recovery?",
  opts:["Return structured error context to the coordinator including failure type, attempted query, partial results, and potential alternative approaches","Implement automatic retry with exponential backoff, returning a generic 'search unavailable' status only after all retries are exhausted","Catch the timeout within the subagent and return an empty result set marked as successful","Propagate the timeout exception to a top-level handler that terminates the entire workflow"],
  c:0,exp:"Structured error context gives the coordinator the information it needs to make intelligent recovery decisions. Generic status (B) hides context. Masking failure as success (C) prevents any recovery. Terminating the workflow (D) is unnecessary when recovery strategies could succeed."},

  {s:"Multi-Agent Research",sc:"sp-3",d:2,
  q:"The synthesis agent frequently needs to verify simple facts, causing 40% latency increase from round-trips through the coordinator. 85% of verifications are simple lookups; 15% require deeper investigation. What's the most effective approach?",
  opts:["Give the synthesis agent a scoped <code>verify_fact</code> tool for simple lookups, while complex verifications continue through the coordinator","Have the synthesis agent batch all verification needs and return them at end-of-pass to the coordinator","Give the synthesis agent access to all web search tools to eliminate round-trips","Have the web search agent proactively cache extra context during initial research"],
  c:0,exp:"A scoped verify_fact tool applies least-privilege: handles the 85% common case without coordinator overhead while preserving the existing pattern for complex cases. Batching (B) creates blocking dependencies. Over-provisioning (C) violates separation of concerns. Speculative caching (D) can't reliably predict what the synthesis agent will need."},

  {s:"Code Generation",sc:"sp-2",d:3,
  q:"You want a <code>/review</code> slash command available to every developer when they clone the repository. Where should you create this command file?",
  opts:["In <code>.claude/commands/</code> in the project repository","In <code>~/.claude/commands/</code> in each developer's home directory","In the <code>CLAUDE.md</code> file at the project root","In a <code>.claude/config.json</code> file with a commands array"],
  c:0,exp:"Project-scoped slash commands in .claude/commands/ are version-controlled and available to all developers on clone or pull. ~/.claude/commands/ is for personal commands not shared via version control. CLAUDE.md is for context, not command definitions. config.json with a commands array doesn't exist in Claude Code."},

  {s:"Code Generation",sc:"sp-2",d:3,
  q:"You've been assigned to restructure a monolithic application into microservices — changes across dozens of files, decisions about service boundaries and dependencies. Which approach should you take?",
  opts:["Enter plan mode to explore the codebase and design an approach before making changes","Start with direct execution and make changes incrementally, letting the implementation reveal natural service boundaries","Use direct execution with comprehensive upfront instructions detailing how each service should be structured","Begin in direct execution and only switch to plan mode if unexpected complexity emerges"],
  c:0,exp:"Plan mode is designed for complex tasks with large-scale changes, multiple valid approaches, and architectural decisions — exactly what monolith-to-microservices restructuring requires. Direct execution first (B, D) risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure without exploring the code."},

  {s:"Code Generation",sc:"sp-2",d:3,
  q:"Your codebase has distinct conventions for React components, API handlers, and database models. Test files are spread throughout alongside the code they test (e.g., <code>Button.test.tsx</code> next to <code>Button.tsx</code>). What's the most maintainable way to auto-apply correct conventions when generating code?",
  opts:["Create rule files in <code>.claude/rules/</code> with YAML frontmatter glob patterns to conditionally apply conventions by file path","Consolidate all conventions in root <code>CLAUDE.md</code> under headers, relying on Claude to infer which section applies","Create skills in <code>.claude/skills/</code> for each code type with conventions in their <code>SKILL.md</code> files","Place a separate <code>CLAUDE.md</code> in each subdirectory with that area's conventions"],
  c:0,exp:".claude/rules/ with glob patterns (e.g., **/*.test.tsx) applies conventions based on file path regardless of directory — essential for test files spread throughout the codebase. Inference (B) is unreliable. Skills (C) require manual invocation. Subdirectory CLAUDE.md (D) can't handle files spread across many directories."},

  {s:"CI/CD Pipeline",sc:"sp-5",d:3,
  q:"Your pipeline script runs <code>claude \"Analyze this pull request for security issues\"</code> but the job hangs indefinitely waiting for interactive input. What's the correct approach?",
  opts:["Add the <code>-p</code> flag: <code>claude -p \"Analyze this pull request...\"</code>","Set the environment variable <code>CLAUDE_HEADLESS=true</code> before running","Redirect stdin from <code>/dev/null</code>: <code>claude \"...\" < /dev/null</code>","Add the <code>--batch</code> flag: <code>claude --batch \"Analyze this pull request...\"</code>"],
  c:0,exp:"The -p (--print) flag is the documented way to run Claude Code in non-interactive mode. The other options reference non-existent features (CLAUDE_HEADLESS, --batch) or Unix workarounds that don't properly address Claude Code's command syntax."},

  {s:"CI/CD Pipeline",sc:"sp-5",d:4,
  q:"Your manager proposes switching both a blocking pre-merge check and an overnight technical debt report to the Message Batches API for 50% cost savings. How should you evaluate this?",
  opts:["Use batch processing for technical debt reports only; keep real-time calls for pre-merge checks","Switch both workflows to batch processing with status polling for completion","Keep real-time calls for both to avoid batch result ordering issues","Switch both to batch processing with a timeout fallback to real-time if batches take too long"],
  c:0,exp:"The Message Batches API has up to 24-hour processing with no latency SLA — unsuitable for blocking pre-merge checks but ideal for overnight reports. Batch results can be correlated via custom_id (C is wrong about ordering). Option D adds unnecessary complexity."},

  {s:"CI/CD Pipeline",sc:"sp-5",d:4,
  q:"A PR modifying 14 files produces inconsistent results: detailed feedback for some files, superficial for others, missed bugs, and contradictory findings across the same PR. How should you restructure the review?",
  opts:["Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused cross-file pass","Require developers to split large PRs into submissions of 3–4 files","Switch to a higher-tier model with a larger context window","Run three independent review passes and only flag issues appearing in at least two of the three runs"],
  c:0,exp:"Multi-pass reviews address attention dilution. File-by-file analysis ensures consistent depth; a separate integration pass catches cross-file issues. Burdening developers (B) doesn't fix the system. Larger context windows (C) don't solve attention quality. Consensus-required flagging (D) suppresses real bugs caught inconsistently."},

  {s:"Structured Extraction",sc:"sp-6",d:4,
  q:"You're using <code>tool_use</code> with a JSON schema for structured extraction. Several fields are marked required but some source documents simply don't contain that information. What do you observe, and how do you fix it?",
  opts:["The model returns an error when required fields are absent — add default values","The model fabricates plausible-looking values to satisfy required fields — make those fields optional (nullable) in the schema","The extraction fails entirely — catch the exception and retry without the problematic fields","The model skips absent fields silently — add explicit extraction instructions in the prompt"],
  c:1,exp:"Required fields in JSON schemas cause the model to fabricate values rather than return null. Making fields optional/nullable is the correct fix. Default values (A) mask the absence. Runtime retries (C) are complex and brittle. Prompt instructions (D) are probabilistic."},

  {s:"Structured Extraction",sc:"sp-6",d:5,
  q:"Your extraction pipeline achieves 97% overall accuracy, and you're considering reducing human review. What must you verify before doing so?",
  opts:["Run a 100-document spot check to confirm the 97% figure holds","Analyze accuracy by document type and field segment to verify consistent performance across all subgroups before reducing review for any segment","Calculate whether 3% errors fall below the downstream error-cost budget","Reduce review for fields where model confidence scores exceed 0.9"],
  c:1,exp:"Aggregate accuracy (97%) can mask poor subgroup performance. Before automating any segment, you must verify consistent performance across all document types and fields. A spot check (A) may not surface subgroup gaps. Cost analysis (C) doesn't replace accuracy validation. Confidence scores (D) need calibration validation first."},

  {s:"Multi-Agent Research",sc:"sp-3",d:4,
  q:"You want to enforce that the model always calls <code>extract_metadata</code> before any enrichment tools in a pipeline. What tool_choice configuration achieves this?",
  opts:["Set <code>tool_choice: 'auto'</code> and list <code>extract_metadata</code> first in the tools array","Set <code>tool_choice: {'type': 'tool', 'name': 'extract_metadata'}</code> for the first API call, then use auto for subsequent calls","Set <code>tool_choice: 'any'</code> to guarantee a tool is called","Add a system prompt instruction: 'Always call extract_metadata before enrichment tools'"],
  c:1,exp:"Forced tool selection with {'type': 'tool', 'name': 'extract_metadata'} guarantees the specific tool is called first. tool_choice: auto with array ordering (A) doesn't influence selection. tool_choice: any (C) guarantees a call but not which one. Prompt instructions (D) are probabilistic."},

  {s:"Developer Productivity",sc:"sp-4",d:2,
  q:"Your developer productivity agent has 18 tools available. Tool selection reliability is poor. What structural fix most improves reliability?",
  opts:["Add a comprehensive tool selection guide to the system prompt explaining when to use each of the 18 tools","Restrict each subagent to only the tools needed for its role, distributing tools across specialized subagents","Set <code>tool_choice: 'any'</code> to ensure the model always calls a tool","Rename tools to have more distinctive names to reduce selection confusion"],
  c:1,exp:"Scoped tool access per agent role is the primary fix for tool selection degradation from large tool sets. The exam guide states that 18 tools instead of 4-5 degrades reliability. A system prompt guide (A) doesn't reduce decision complexity. tool_choice: any (C) ensures a call is made but not the correct one. Renaming helps marginally but doesn't address fundamental complexity."},

  {s:"Developer Productivity",sc:"sp-4",d:2,
  q:"An engineer asks your agent 'What does the <code>handlePayment</code> function do and who calls it?' Which built-in tool sequence most efficiently answers this?",
  opts:["Read all source files, then search for <code>handlePayment</code> across all of them","Use Grep to find the function definition, then Grep to find all callers, then Read to examine the relevant files","Use Glob to find all <code>.js</code> files, then Read each one looking for <code>handlePayment</code>","Use Bash with <code>grep -r</code> to search recursively, avoiding multiple tool calls"],
  c:1,exp:"Grep for content search (function definitions, callers) followed by targeted Read is the correct pattern. The exam guide specifically identifies Grep as the tool for searching code content and Read for loading file contents. Reading all files (A) is inefficient. Glob (C) finds files by name pattern, not content. Bash/grep (D) works but the exam tests built-in tool roles."},

  {s:"Developer Productivity",sc:"sp-4",d:3,
  q:"You want a skill that runs a comprehensive codebase analysis producing thousands of lines of output, without polluting the main conversation context. What frontmatter option achieves this?",
  opts:["Add <code>max-output: 500</code> to truncate the skill's output","Add <code>context: fork</code> to run the skill in an isolated sub-agent context, returning only a summary to the main session","Move the skill to <code>~/.claude/skills/</code> to run it with personal scope","Add <code>allowed-tools: []</code> to restrict tool access, reducing output volume"],
  c:1,exp:"context: fork runs the skill in an isolated sub-agent context, preventing verbose output from polluting the main conversation. The main session receives only the summary result. max-output (A) is not a valid frontmatter option. Moving to personal scope (C) doesn't affect output isolation. allowed-tools (D) restricts tool access, not output verbosity."},

  {s:"Customer Support Agent",sc:"sp-1",d:2,
  q:"Your MCP tool <code>get_customer</code> returns a 40-field JSON object but the agent only needs 5 fields for most support tasks. Context window is filling up after many turns. What is the most effective fix?",
  opts:["Increase the context window budget to accommodate verbose tool outputs","Trim verbose tool outputs to only the relevant fields before they accumulate in context","Add a system prompt instruction to ignore irrelevant fields","Create a separate lightweight tool that returns only the 5 core fields"],
  c:1,exp:"Trimming tool outputs before they enter the context prevents token accumulation over multi-turn sessions. Larger context budgets (A) delay but don't prevent the problem. Prompt-based ignoring (C) doesn't prevent tokens from being consumed. A separate lightweight tool (D) is a valid architectural approach but requires backend changes — trimming is the most direct fix."},
];
