# Before claiming that the skill helps a model

Use a fixed, original task set covering long labels, zero and missing values, duplicate observations, European number formats, paired X/Y, bars with signed values and coordinate geometry. Freeze the source data and exact task prompt. Record model identifier/version, date, runtime, available tools, dependency versions and rendering settings.

Run the baseline without this skill and the comparison with this skill in fresh, equivalently configured contexts. Keep the original outputs, failed runs and repair attempts. Repeat tasks enough to expose variation; disclose the sample size. Score source preservation, declared calculations, axis semantics and actual export usability separately. Inspect images without revealing which condition produced them when practical.

Do not use a deliberately broken authored chart as the model baseline. Do not count a passing checker as proof of visual quality or educational effectiveness. Publish the exact fixtures, prompts, commands, outputs and limitations with any comparison gallery. Until this evaluation exists, describe the skill as experimental and its scripts as deterministic validation aids.

## Frozen original tasks

Use `fixtures/evaluation-tasks.json` as version 1 of the task set. It contains seven original prompts and datasets, not generated outputs. Append `outputContract` to each task prompt identically in both conditions; prepend the skill only in the skill condition. The European-number case declares a parsing transformation and therefore uses `expectedParsedRows` for a separate parsing assertion; do not pass the source strings off as a numeric identity projection. Missing observations require an explicit gap policy and cannot pass the unchanged finite-numeric projection checker as-is.

For each run retain `task-id/condition/repeat/{output.svg,render-spec.json,decisions.md,run.json}`. Record the exact model ID, prompt, tool access, dependency versions, timestamp and attempts in `run.json`. Score data preservation, numerical method, scale semantics and export readability separately; record failures rather than repairing one condition silently. Have a reader inspect anonymized SVGs at the target size when possible. A single pair is only a smoke experiment, not evidence of reliable improvement.

Current status: no model-generated baseline or skill-assisted run is included. The application's tested diagrams and authored failure fixtures must not be presented as those runs.
