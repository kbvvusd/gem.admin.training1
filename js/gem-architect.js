/**
 * Gem Refinement Workshop
 * Section-by-section editor for the SPSA Data Coach prompt
 * Staff can tweak wording, add special instructions, then copy the final version
 */

window.GemArchitect = {
    initialized: false,

    // Editable sections of the prompt
    sections: [],

    // Extra instructions added by user
    specialInstructions: '',

    init() {
        this.container = document.getElementById('gem-architect-container');
        if (!this.container) return;

        this.loadSections();
        this.render();

        if (!this.initialized) {
            this.bindEvents();
            this.initialized = true;
        }
    },

    loadSections() {
        // Pull current state from the builder on Slide 3
        const builder = window.GemInstructionBuilder;
        const s = builder ? builder.state : {};

        // Tone
        const toneObj = builder?.tonePresets?.find(t => t.value === s.tone);
        const toneName = toneObj ? toneObj.label : 'Balanced and professional';
        const toneDesc = toneObj ? toneObj.desc : 'Clear, professional, approachable';
        const ti = s.toneIntensity || 5;
        const intensityLabel = builder?.toneIntensityLabels?.[ti] || '';

        let intensityGuidance = '';
        if (ti <= 2) intensityGuidance = 'Keep responses neutral and straightforward. The tone should be a faint background quality.';
        else if (ti <= 4) intensityGuidance = 'Let personality come through gently. Be polite and measured — noticeable but restrained.';
        else if (ti <= 6) intensityGuidance = 'Show a clear, balanced personality. Professional but with character — like hearing from a real colleague.';
        else if (ti <= 8) intensityGuidance = 'Be bold and distinctive. Don\'t hold back — let the tone drive communication. Be opinionated with vivid language.';
        else intensityGuidance = 'Go full personality. Be unapologetically expressive, highly opinionated, and push boundaries with your style.';

        // Custom questions
        let customQuestionsBlock = '';
        if (s.customQuestion1) {
            customQuestionsBlock += `\n### Additional Analysis Area 1\nWhen analyzing the documents, also address this question from the leadership team: "${s.customQuestion1}"\n`;
        }
        if (s.customQuestion2) {
            customQuestionsBlock += `\n### Additional Analysis Area 2\nWhen analyzing the documents, also address this question from the leadership team: "${s.customQuestion2}"\n`;
        }

        // Output format additions for custom questions
        let customOutputLines = '';
        if (s.customQuestion1) customOutputLines += `6. **Custom Analysis: Question 1** (response to team's specific inquiry)\n`;
        if (s.customQuestion2) {
            const num = s.customQuestion1 ? '7' : '6';
            customOutputLines += `${num}. **Custom Analysis: Question 2** (response to team's specific inquiry)\n`;
        }

        this.sections = [
            {
                id: 'role',
                title: 'Role & Identity',
                icon: 'user',
                color: 'pink',
                content: `You are an expert SPSA Compliance Officer and Data Analyst for VVUSD. Your goal is to help me refine my School Plan for Student Achievement.\n\nTone: ${toneName} — ${toneDesc}. On a personality scale of 1-10, operate at a ${ti}. ${intensityGuidance}`
            },
            {
                id: 'sources',
                title: 'Source Documents',
                icon: 'database',
                color: 'blue',
                content: `You will be provided two key documents:\n1. **School's SPSA** — Single Plan for Student Achievement with goals, needs assessment, strategies, and metrics\n2. **VVUSD SPSA Self-Reflection Tool** — District rubric with "Look Fors" for each SPSA section`
            },
            {
                id: 'task',
                title: 'Core Task & Compliance Rules',
                icon: 'target',
                color: 'teal',
                content: `Review my SPSA content (in your files) against the "VVUSD SPSA Self-Reflection Tool" (also in your files).\n\nYou must enforce 3 Strict Rules:\n\n### 1. The "So What?" Rule (Metrics & Alignment)\n- Check: Does every "Identified Need" lead to a specific "Goal"?\n- Metric Check: Flag metrics without specific Baseline and Expected Outcome\n- Critique: Reject vague metrics (e.g., "improve attendance"). Demand specific indicators (e.g., "Decrease chronic absenteeism rate from 12% to 10%")\n\n### 2. The "Prove It" Rule (Effectiveness)\n- Check: Compare Annual Review text to the "Look Fors" in the Rubric\n- Critique: If a strategy "went well," reject it. Demand evidence with aligned data/metrics of how specific student groups made growth\n\n### 3. The "Inequity" Rule\n- Check: Does the Comprehensive Needs Assessment identify resource inequities using Dashboard data (Red/Orange indicators)?\n- Critique: Ensure analysis of gaps between student groups (e.g., EL vs. EO, SED vs. Non-SED), not just overall school averages${customQuestionsBlock}`
            },
            {
                id: 'output',
                title: 'Output Format',
                icon: 'layout',
                color: 'amber',
                content: `Structure your response as:\n1. **Compliance Summary** (overall status against the 3 rules)\n2. **"So What?" Findings** (needs-to-goals alignment, flagged vague metrics)\n3. **"Prove It" Findings** (Annual Review evidence gaps, missing student group data)\n4. **"Inequity" Findings** (missing disaggregated data, unaddressed Dashboard indicators)\n5. **Recommended Revisions** (specific, actionable fixes for each finding)\n${customOutputLines}`
            },
            {
                id: 'guidelines',
                title: 'Guidelines',
                icon: 'shield',
                color: 'green',
                content: `- Ground every finding in specific text from the uploaded SPSA and rubric\n- Be direct about compliance gaps — do not soften findings that need attention\n- Frame recommendations as specific revisions, not general advice\n- Always reference which rubric "Look For" applies to each finding\n- When flagging vague metrics, provide an example of what a specific metric would look like\n- Consider equity implications: which student groups are missing from the analysis?\n- If data is incomplete or unclear, name what is missing rather than guessing`
            }
        ];
    },

    render() {
        this.container.innerHTML = `
            <div class="gem-workshop" style="max-width: 960px; margin: 0 auto; padding: 0 var(--space-6);">

                <!-- Intro -->
                <div class="gem-workshop-intro" style="text-align: center; margin-bottom: var(--space-8);">
                    <p style="color: var(--text-muted); font-size: var(--text-lg); max-width: 700px; margin: 0 auto;">
                        Review and refine each section of your Gem's instructions. Click any section to edit the wording, then copy when you're ready.
                    </p>
                </div>

                <!-- Editable Sections -->
                <div class="gem-workshop-sections" style="display: flex; flex-direction: column; gap: var(--space-4);">
                    ${this.sections.map((sec, i) => this.renderSection(sec, i)).join('')}

                    <!-- Special Instructions (always open) -->
                    <div class="gem-workshop-section" style="border-color: rgba(168, 85, 247, 0.25);">
                        <div class="gem-workshop-section-header" style="cursor: default;">
                            <div class="gem-workshop-section-icon" style="background: rgba(168, 85, 247, 0.1); color: var(--purple-400);">
                                <i data-lucide="plus-circle" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div class="gem-workshop-section-title">Special Instructions</div>
                            <span style="color: var(--text-muted); font-size: var(--text-sm);">Optional</span>
                        </div>
                        <div class="gem-workshop-section-body" style="display: block;">
                            <textarea class="gem-workshop-textarea" name="workshop-special"
                                placeholder="Add anything else your Gem should know — district priorities, specific protocols, things to avoid, etc."
                                rows="3">${this.escapeHtml(this.specialInstructions)}</textarea>
                        </div>
                    </div>
                </div>

                <!-- Combined Instructions Preview -->
                <div class="gem-workshop-combined">
                    <div class="gem-workshop-combined-header">
                        <div class="gem-workshop-combined-icon">
                            <i data-lucide="file-text" style="width: 20px; height: 20px;"></i>
                        </div>
                        <div class="gem-workshop-combined-title">Complete Instructions</div>
                    </div>
                    <div class="gem-workshop-combined-body">
                        <div class="gem-workshop-combined-prompt" id="workshop-combined-prompt">${this.escapeHtml(this.assembleFinalPrompt())}</div>
                    </div>
                </div>

                <!-- Final Actions -->
                <div style="margin-top: var(--space-10); text-align: center;">
                    <div class="gem-workshop-final-actions" style="display: flex; gap: var(--space-4); justify-content: center; margin-bottom: var(--space-6);">
                        <button class="btn--shiny" data-action="workshop-copy">
                            <i data-lucide="copy" style="width: 18px; height: 18px;"></i>
                            <span>Copy Final Instructions</span>
                        </button>
                        <a href="https://gemini.google.com/gems/create" target="_blank" class="btn btn--lg" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-default); color: var(--text-primary); text-decoration: none; gap: var(--space-2); display: inline-flex; align-items: center;">
                            <i data-lucide="external-link" style="width: 18px; height: 18px;"></i>
                            <span>Open Gemini</span>
                        </a>
                    </div>
                    <div style="padding: var(--space-4); background: rgba(0,0,0,0.2); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); max-width: 600px; margin: 0 auto;">
                        <p style="color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; margin: 0;">
                            <strong style="color: var(--text-secondary);">Remember:</strong> After pasting instructions in Gemini, upload your <strong style="color: var(--blue-400);">SPSA</strong> and <strong style="color: var(--blue-400);">VVUSD SPSA Self-Reflection Tool</strong> as knowledge base files.
                        </p>
                    </div>
                </div>
            </div>
        `;

        if (window.lucide) lucide.createIcons();
    },

    colorMap: {
        pink:   { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)',  fg: 'var(--pink-400)' },
        purple: { bg: 'rgba(168,85,247,0.1)',   border: 'rgba(168,85,247,0.2)',  fg: 'var(--purple-400)' },
        blue:   { bg: 'rgba(59,130,246,0.1)',    border: 'rgba(59,130,246,0.2)',  fg: 'var(--blue-400)' },
        teal:   { bg: 'rgba(20,184,166,0.1)',    border: 'rgba(20,184,166,0.2)',  fg: 'var(--teal-400)' },
        amber:  { bg: 'rgba(245,158,11,0.1)',    border: 'rgba(245,158,11,0.2)',  fg: 'var(--amber-400)' },
        green:  { bg: 'rgba(34,197,94,0.1)',     border: 'rgba(34,197,94,0.2)',   fg: 'var(--green-400)' }
    },

    renderSection(sec, index) {
        const c = this.colorMap[sec.color] || this.colorMap.purple;
        return `
            <div class="gem-workshop-section" style="border-color: ${c.border};">
                <div class="gem-workshop-section-header" data-toggle-section="${index}">
                    <div class="gem-workshop-section-icon" style="background: ${c.bg}; color: ${c.fg};">
                        <i data-lucide="${sec.icon}" style="width: 20px; height: 20px;"></i>
                    </div>
                    <div class="gem-workshop-section-title">${sec.title}</div>
                    <div class="gem-workshop-section-toggle" data-section-index="${index}">
                        <i data-lucide="chevron-down" style="width: 18px; height: 18px; color: var(--text-muted); transition: transform 0.2s ease;"></i>
                    </div>
                </div>
                <div class="gem-workshop-section-body" id="workshop-body-${index}" style="display: none;">
                    <textarea class="gem-workshop-textarea" name="workshop-section-${index}"
                        rows="${Math.max(8, sec.content.split('\n').length + 2)}">${this.escapeHtml(sec.content)}</textarea>
                </div>
            </div>
        `;
    },

    bindEvents() {
        this.container.addEventListener('click', (e) => {
            // Toggle sections
            const header = e.target.closest('[data-toggle-section]');
            if (header) {
                const index = header.dataset.toggleSection;
                const body = document.getElementById(`workshop-body-${index}`);
                const chevron = header.querySelector('i[data-lucide="chevron-down"]');
                if (body) {
                    const isOpen = body.style.display !== 'none';
                    body.style.display = isOpen ? 'none' : 'block';
                    if (chevron) chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
                }
                return;
            }

            // Copy
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action === 'workshop-copy') {
                this.copyFinalPrompt();
            }
        });

        // Track edits to sections and update combined view
        this.container.addEventListener('input', (e) => {
            const name = e.target.name;
            if (name === 'workshop-special') {
                this.specialInstructions = e.target.value;
            }
            // Track section edits
            const match = name?.match(/^workshop-section-(\d+)$/);
            if (match) {
                const idx = parseInt(match[1]);
                if (this.sections[idx]) {
                    this.sections[idx].content = e.target.value;
                }
            }
            // Live-update the combined instructions preview
            this.updateCombinedPreview();
        });
    },

    assembleFinalPrompt() {
        let prompt = '# SPSA Data Coach\n\n';

        this.sections.forEach(sec => {
            prompt += `## ${sec.title}\n${sec.content}\n\n`;
        });

        if (this.specialInstructions.trim()) {
            prompt += `## Special Instructions\n${this.specialInstructions.trim()}\n`;
        }

        return prompt.trim();
    },

    copyFinalPrompt() {
        const prompt = this.assembleFinalPrompt();
        navigator.clipboard.writeText(prompt).then(() => {
            const btn = this.container.querySelector('[data-action="workshop-copy"]');
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = '<i data-lucide="check" style="width: 18px; height: 18px;"></i><span>Copied!</span>';
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = original;
                    if (window.lucide) lucide.createIcons();
                }, 2000);
            }
        });
    },

    updateCombinedPreview() {
        const el = document.getElementById('workshop-combined-prompt');
        if (el) {
            el.textContent = this.assembleFinalPrompt();
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
};
