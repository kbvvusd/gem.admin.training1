/**
 * Gem Instruction Builder
 * Guided SPSA Data Coach builder that integrates into Slide 3's timeline
 * Staff customize context, tone, and custom questions while the core prompt is pre-built
 */

window.GemInstructionBuilder = {
    initialized: false,

    state: {
        tone: '',
        toneIntensity: 5,
        customQuestion1: '',
        customQuestion2: '',
        docsReady: { spsa: false, rubric: false }
    },

    // Tone presets
    tonePresets: [
        { value: 'reflective-coach', label: 'Reflective Coach', icon: 'heart-handshake', desc: 'Warm, inquiry-driven, like a trusted thought partner' },
        { value: 'direct-analyst', label: 'Direct Analyst', icon: 'bar-chart-3', desc: 'Concise, data-focused, gets to the point' },
        { value: 'supportive-mentor', label: 'Supportive Mentor', icon: 'heart', desc: 'Encouraging, frames gaps as opportunities' },
        { value: 'professional-strategist', label: 'Professional Strategist', icon: 'briefcase', desc: 'Formal, structured, policy-aware' }
    ],

    toneIntensityLabels: {
        1: 'Barely there — almost invisible',
        2: 'Very subtle — hint of personality',
        3: 'Gentle — polite and measured',
        4: 'Moderate — present but restrained',
        5: 'Balanced — clear personality, professional',
        6: 'Noticeable — confident and distinct',
        7: 'Strong — clearly opinionated, character-driven',
        8: 'Bold — unapologetic, very distinctive',
        9: 'Intense — pushes boundaries, highly expressive',
        10: 'Maximum — full personality, zero filter'
    },

    // Demographic chip options
    demographicOptions: [
        'English Learners', 'Students with Disabilities', 'Socioeconomically Disadvantaged',
        'Foster Youth', 'Homeless Youth', 'African American', 'Hispanic/Latino',
        'Asian', 'Pacific Islander', 'White', 'Two or More Races'
    ],

    // Framework chip options
    frameworkOptions: [
        'Danielson', 'Marzano', 'CSTP', 'MTSS', 'PBIS', 'UDL', 'PLC', 'Restorative Practices'
    ],

    // Example questions for chips
    exampleQuestions: [
        'Does every Identified Need in the SPSA connect to a specific, measurable Goal?',
        'Which metrics in the SPSA lack a specific Baseline and Expected Outcome?',
        'What evidence is cited in the Annual Review beyond "it went well"?',
        'Are achievement gaps between student groups (EL vs. EO, SED vs. Non-SED) addressed in the Needs Assessment?',
        'Do our resource allocations address the Red/Orange indicators from Dashboard data?',
        'Where does the SPSA reference specific student group growth data?'
    ],

    init() {
        if (this.initialized) return;

        this.injectBuilderCards();
        this.bindEvents();
        this.initialized = true;
    },

    injectBuilderCards() {
        // Role section — preview card
        const roleSlot = document.querySelector('[data-builder="role"]');
        if (roleSlot) roleSlot.innerHTML = this.renderPreviewCard('role');

        // Purpose section — preview card
        const purposeSlot = document.querySelector('[data-builder="purpose"]');
        if (purposeSlot) purposeSlot.innerHTML = this.renderPreviewCard('purpose');

        // Context section — interactive inputs
        const contextSlot = document.querySelector('[data-builder="context"]');
        if (contextSlot) contextSlot.innerHTML = this.renderContextCard();

        // Knowledge Base section — checklist
        const knowledgeSlot = document.querySelector('[data-builder="knowledge"]');
        if (knowledgeSlot) knowledgeSlot.innerHTML = this.renderKnowledgeCard();

        // Tone section — tone selector + intensity
        const toneSlot = document.querySelector('[data-builder="tone"]');
        if (toneSlot) toneSlot.innerHTML = this.renderToneCard();

        // Questions section — 2 custom question textareas
        const questionsSlot = document.querySelector('[data-builder="questions"]');
        if (questionsSlot) questionsSlot.innerHTML = this.renderQuestionsCard();

        // Final prompt at outro
        const outroSlot = document.querySelector('[data-builder="final"]');
        if (outroSlot) outroSlot.innerHTML = this.renderFinalPrompt();

        if (window.lucide) lucide.createIcons();

        // Observe newly injected elements for scroll animations
        // (The main GemTimeline observer ran before these were added)
        this.observeAnimations();
    },

    observeAnimations() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.gem-builder-slot [data-gem-animate]').forEach(el => {
            obs.observe(el);
        });
    },

    renderPreviewCard(section) {
        const content = {
            role: {
                title: 'Your Gem\'s Role',
                color: 'pink',
                icon: 'check-circle',
                text: 'Expert SPSA Compliance Officer and Data Analyst for VVUSD, specializing in reviewing School Plans for Student Achievement against district rubric standards.',
                badge: 'Pre-Built'
            },
            purpose: {
                title: 'Your Gem\'s Purpose',
                color: 'teal',
                icon: 'check-circle',
                text: 'Review SPSA content against the VVUSD SPSA Self-Reflection Tool rubric, enforcing three strict compliance rules around metrics, effectiveness evidence, and equity analysis.',
                badge: 'Pre-Built'
            }
        };

        const c = content[section];
        return `
            <div class="gem-builder-card gem-builder-preview gem-builder-preview--${c.color}" data-gem-animate>
                <div class="gem-builder-card-header">
                    <div class="gem-builder-badge gem-builder-badge--${c.color}">
                        <i data-lucide="${c.icon}" style="width: 14px; height: 14px;"></i>
                        ${c.badge}
                    </div>
                    <span class="gem-builder-card-title">${c.title}</span>
                </div>
                <div class="gem-builder-preview-text">${c.text}</div>
            </div>
        `;
    },

    renderContextCard() {
        return `
            <div class="gem-builder-card gem-builder-preview gem-builder-preview--purple" data-gem-animate>
                <div class="gem-builder-card-header">
                    <div class="gem-builder-badge gem-builder-badge--purple">
                        <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i>
                        Automatic
                    </div>
                    <span class="gem-builder-card-title">Context From Your SPSA</span>
                </div>
                <p class="gem-builder-card-desc">You don't need to enter school details manually. When you upload your SPSA to the knowledge base, the Gem will read your school's context directly &mdash; including school name, grade levels, demographics, SPSA priorities, and identified needs.</p>
                <div class="gem-builder-note">
                    <i data-lucide="info" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                    <span>This is one of the advantages of a knowledge base &mdash; the Gem already knows your school because it has your plan.</span>
                </div>
            </div>
        `;
    },

    renderKnowledgeCard() {
        const s = this.state;
        return `
            <div class="gem-builder-card gem-builder-card--blue" data-gem-animate>
                <div class="gem-builder-card-header">
                    <div class="gem-builder-badge gem-builder-badge--blue">
                        <i data-lucide="clipboard-check" style="width: 14px; height: 14px;"></i>
                        Document Check
                    </div>
                    <span class="gem-builder-card-title">Get Your Files Ready</span>
                </div>
                <p class="gem-builder-card-desc">You'll upload these documents directly to Gemini after creating your Gem.</p>

                <div class="gem-builder-checklist">
                    <label class="gem-builder-checklist-item">
                        <input type="checkbox" name="builder-doc-spsa" ${s.docsReady.spsa ? 'checked' : ''}>
                        <span class="gem-builder-checklist-check"></span>
                        <div class="gem-builder-checklist-content">
                            <span class="gem-builder-checklist-label">Your School's SPSA</span>
                            <span class="gem-builder-checklist-desc">Single Plan for Student Achievement with goals, needs assessment, and action steps</span>
                        </div>
                    </label>
                    <label class="gem-builder-checklist-item">
                        <input type="checkbox" name="builder-doc-rubric" ${s.docsReady.rubric ? 'checked' : ''}>
                        <span class="gem-builder-checklist-check"></span>
                        <div class="gem-builder-checklist-content">
                            <span class="gem-builder-checklist-label">VVUSD SPSA Self-Reflection Tool</span>
                            <span class="gem-builder-checklist-desc">District rubric with "Look Fors" for compliance and quality review</span>
                        </div>
                    </label>
                </div>

                <div class="gem-builder-note">
                    <i data-lucide="info" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
                    <span>These files become your Gem's knowledge base — it will review your SPSA against the rubric standards.</span>
                </div>
            </div>
        `;
    },

    renderToneCard() {
        const s = this.state;
        const intensity = s.toneIntensity;
        const intensityLabel = this.toneIntensityLabels[intensity] || '';

        return `
            <div class="gem-builder-card gem-builder-card--amber" data-gem-animate>
                <div class="gem-builder-card-header">
                    <div class="gem-builder-badge gem-builder-badge--amber">
                        <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                        Your Turn
                    </div>
                    <span class="gem-builder-card-title">Set Your Gem's Voice</span>
                </div>
                <p class="gem-builder-card-desc">How should your Gem communicate with your team?</p>

                <div class="gem-builder-tone-grid">
                    ${this.tonePresets.map(t => `
                        <label class="gem-builder-tone-option ${s.tone === t.value ? 'gem-builder-tone-option--active' : ''}">
                            <input type="radio" name="builder-tone" value="${t.value}" ${s.tone === t.value ? 'checked' : ''}>
                            <div class="gem-builder-tone-icon">
                                <i data-lucide="${t.icon}" style="width: 22px; height: 22px;"></i>
                            </div>
                            <div class="gem-builder-tone-label">${t.label}</div>
                            <div class="gem-builder-tone-desc">${t.desc}</div>
                        </label>
                    `).join('')}
                </div>

                ${s.tone ? `
                <div class="gem-builder-intensity">
                    <div class="gem-builder-intensity-header">
                        <i data-lucide="gauge" style="width: 18px; height: 18px; color: var(--amber-400);"></i>
                        <span>Personality Intensity</span>
                    </div>
                    <input type="range" name="builder-tone-intensity" min="1" max="10" value="${intensity}"
                        class="gem-builder-slider">
                    <div class="gem-builder-intensity-labels">
                        <span>1 — Subtle</span>
                        <span>5 — Balanced</span>
                        <span>10 — Bold</span>
                    </div>
                    <div class="gem-builder-intensity-value">
                        <span class="gem-builder-intensity-number" id="builder-intensity-value">${intensity}</span>
                        <span class="gem-builder-intensity-desc" id="builder-intensity-label">${intensityLabel}</span>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    },

    renderQuestionsCard() {
        const s = this.state;
        return `
            <div class="gem-builder-card gem-builder-card--green" data-gem-animate>
                <div class="gem-builder-card-header">
                    <div class="gem-builder-badge gem-builder-badge--green">
                        <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                        Your Turn
                    </div>
                    <span class="gem-builder-card-title">Add Your Questions</span>
                </div>
                <p class="gem-builder-card-desc">Your Gem will already analyze alignment and recommend focus areas. Add up to 2 additional questions you want it to address.</p>

                <div class="gem-builder-field">
                    <label class="gem-builder-label">Question 1 <span class="gem-builder-hint">(optional)</span></label>
                    <textarea class="gem-builder-input gem-builder-textarea" name="builder-question-1"
                        placeholder="e.g., Are our SPSA budget allocations aligned with our identified needs?"
                        rows="2">${this.escapeHtml(s.customQuestion1)}</textarea>
                    <div class="gem-builder-example-chips" data-question-target="1">
                        ${this.exampleQuestions.slice(0, 3).map(q => `
                            <button type="button" class="gem-builder-example-chip" data-example-question="${this.escapeHtml(q)}" data-question-target="1">${q}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="gem-builder-field">
                    <label class="gem-builder-label">Question 2 <span class="gem-builder-hint">(optional)</span></label>
                    <textarea class="gem-builder-input gem-builder-textarea" name="builder-question-2"
                        placeholder="e.g., Which strategies lack student group-specific evidence of effectiveness?"
                        rows="2">${this.escapeHtml(s.customQuestion2)}</textarea>
                    <div class="gem-builder-example-chips" data-question-target="2">
                        ${this.exampleQuestions.slice(3, 6).map(q => `
                            <button type="button" class="gem-builder-example-chip" data-example-question="${this.escapeHtml(q)}" data-question-target="2">${q}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderFinalPrompt() {
        const prompt = this.assemblePrompt();
        const hasTone = !!this.state.tone;

        return `
            <div class="gem-builder-final" data-gem-animate>
                <div class="gem-builder-final-header">
                    <div class="gem-builder-final-icon">
                        <i data-lucide="sparkles" style="width: 28px; height: 28px;"></i>
                    </div>
                    <div>
                        <h3 class="gem-builder-final-title">Your SPSA Data Coach</h3>
                        <p class="gem-builder-final-subtitle">Ready to copy and paste into Gemini</p>
                    </div>
                </div>

                ${!hasTone ? `
                <div class="gem-builder-final-hint">
                    <i data-lucide="arrow-up" style="width: 16px; height: 16px;"></i>
                    <span>Scroll up to customize your tone and questions — or copy the default version below.</span>
                </div>
                ` : ''}

                <div class="gem-builder-final-prompt-wrap">
                    <pre class="gem-builder-final-prompt" id="gem-builder-output">${this.escapeHtml(prompt)}</pre>
                </div>

                <div class="gem-builder-final-actions">
                    <button class="btn--shiny gem-builder-copy-btn" data-action="builder-copy">
                        <i data-lucide="copy" style="width: 18px; height: 18px;"></i>
                        <span>Copy Instructions</span>
                    </button>
                    <a href="https://gemini.google.com/gems/create" target="_blank" class="btn btn--lg gem-builder-gemini-btn">
                        <i data-lucide="external-link" style="width: 18px; height: 18px;"></i>
                        <span>Open Gemini</span>
                    </a>
                </div>

                <div class="gem-builder-final-steps">
                    <p><strong>Next steps:</strong></p>
                    <ol>
                        <li>Copy the instructions above</li>
                        <li>Open Gemini and create a new Gem</li>
                        <li>Paste the instructions into the Gem's instruction field</li>
                        <li>Upload your SPSA and the VVUSD SPSA Self-Reflection Tool as knowledge base files</li>
                        <li>Save and start chatting with your Gem</li>
                    </ol>
                </div>

                <button class="btn btn--ghost gem-builder-reset-btn" data-action="builder-reset">
                    <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
                    Start Over
                </button>
            </div>
        `;
    },

    assemblePrompt() {
        const s = this.state;

        // Tone description
        const toneObj = this.tonePresets.find(t => t.value === s.tone);
        const toneName = toneObj ? toneObj.label : 'Balanced and professional';
        const toneDesc = toneObj ? toneObj.desc : 'Clear, professional, approachable';

        // Intensity guidance
        let intensityGuidance = '';
        const ti = s.toneIntensity;
        if (ti <= 2) {
            intensityGuidance = 'Keep responses neutral and straightforward. The tone should be a faint background quality.';
        } else if (ti <= 4) {
            intensityGuidance = 'Let personality come through gently. Be polite and measured — noticeable but restrained.';
        } else if (ti <= 6) {
            intensityGuidance = 'Show a clear, balanced personality. Professional but with character — like hearing from a real colleague.';
        } else if (ti <= 8) {
            intensityGuidance = 'Be bold and distinctive. Don\'t hold back — let the tone drive communication. Be opinionated with vivid language.';
        } else {
            intensityGuidance = 'Go full personality. Be unapologetically expressive, highly opinionated, and push boundaries with your style.';
        }

        // Custom questions
        let customQuestionsSection = '';
        let customQuestionsOutput = '';
        if (s.customQuestion1) {
            customQuestionsSection += `\n### Additional Analysis Area 1\nWhen reviewing the SPSA, also address this question from the leadership team: "${s.customQuestion1}"\n`;
            customQuestionsOutput += `6. **Custom Analysis: Question 1** (response to team's specific inquiry)\n`;
        }
        if (s.customQuestion2) {
            customQuestionsSection += `\n### Additional Analysis Area 2\nWhen reviewing the SPSA, also address this question from the leadership team: "${s.customQuestion2}"\n`;
            const num = s.customQuestion1 ? '7' : '6';
            customQuestionsOutput += `${num}. **Custom Analysis: Question 2** (response to team's specific inquiry)\n`;
        }

        return `# SPSA Data Coach

## Role & Identity
You are an expert SPSA Compliance Officer and Data Analyst for VVUSD. Your goal is to help me refine my School Plan for Student Achievement.

Tone: ${toneName} — ${toneDesc}. On a personality scale of 1-10, operate at a ${s.toneIntensity}. ${intensityGuidance}

## Core Task
Review my SPSA content (in your files) against the "VVUSD SPSA Self-Reflection Tool" (also in your files).

You must enforce 3 Strict Rules:

### 1. The "So What?" Rule (Metrics & Alignment)
- Check: Does every "Identified Need" lead to a specific "Goal"?
- Metric Check: Flag metrics without specific Baseline and Expected Outcome
- Critique: Reject vague metrics (e.g., "improve attendance"). Demand specific indicators (e.g., "Decrease chronic absenteeism rate from 12% to 10%")

### 2. The "Prove It" Rule (Effectiveness)
- Check: Compare Annual Review text to the "Look Fors" in the Rubric
- Critique: If a strategy "went well," reject it. Demand evidence with aligned data/metrics of how specific student groups made growth

### 3. The "Inequity" Rule
- Check: Does the Comprehensive Needs Assessment identify resource inequities using Dashboard data (Red/Orange indicators)?
- Critique: Ensure analysis of gaps between student groups (e.g., EL vs. EO, SED vs. Non-SED), not just overall school averages
${customQuestionsSection}
## Source Documents
You will be provided two key documents:
1. **School's SPSA** — Single Plan for Student Achievement with goals, needs assessment, strategies, and metrics
2. **VVUSD SPSA Self-Reflection Tool** — District rubric with "Look Fors" for each SPSA section

## Output Format
Structure your response as:
1. **Compliance Summary** (overall status against the 3 rules)
2. **"So What?" Findings** (needs-to-goals alignment, flagged vague metrics)
3. **"Prove It" Findings** (Annual Review evidence gaps, missing student group data)
4. **"Inequity" Findings** (missing disaggregated data, unaddressed Dashboard indicators)
5. **Recommended Revisions** (specific, actionable fixes for each finding)
${customQuestionsOutput}
## Guidelines
- Ground every finding in specific text from the uploaded SPSA and rubric
- Be direct about compliance gaps — do not soften findings that need attention
- Frame recommendations as specific revisions, not general advice
- Always reference which rubric "Look For" applies to each finding
- When flagging vague metrics, provide an example of what a specific metric would look like
- Consider equity implications: which student groups are missing from the analysis?
- If data is incomplete or unclear, name what is missing rather than guessing`;
    },

    bindEvents() {
        // Use event delegation on slide-3
        const slide3 = document.getElementById('slide-3');
        if (!slide3) return;

        // Input changes
        slide3.addEventListener('input', (e) => {
            const name = e.target.name;
            if (name === 'builder-question-1') {
                this.state.customQuestion1 = e.target.value;
                this.updateFinalPrompt();
            }
            if (name === 'builder-question-2') {
                this.state.customQuestion2 = e.target.value;
                this.updateFinalPrompt();
            }
            if (name === 'builder-tone-intensity') {
                this.state.toneIntensity = parseInt(e.target.value);
                const label = document.getElementById('builder-intensity-label');
                const val = document.getElementById('builder-intensity-value');
                if (label) label.textContent = this.toneIntensityLabels[e.target.value] || '';
                if (val) val.textContent = e.target.value;
                this.updateFinalPrompt();
            }
        });

        // Select changes
        slide3.addEventListener('change', (e) => {
            const name = e.target.name;
            if (name === 'builder-tone') {
                this.state.tone = e.target.value;
                // Re-render tone card to show intensity slider
                const toneSlot = document.querySelector('[data-builder="tone"]');
                if (toneSlot) {
                    toneSlot.innerHTML = this.renderToneCard();
                    // Mark as visible immediately so it doesn't animate away
                    toneSlot.querySelectorAll('[data-gem-animate]').forEach(el => el.classList.add('visible'));
                    if (window.lucide) lucide.createIcons();
                }
                this.updateFinalPrompt();
            }
            if (name === 'builder-doc-spsa') {
                this.state.docsReady.spsa = e.target.checked;
            }
            if (name === 'builder-doc-rubric') {
                this.state.docsReady.rubric = e.target.checked;
            }
        });

        // Click events (chips, example questions, copy, reset)
        slide3.addEventListener('click', (e) => {
            // Demographic/framework chips
            const chip = e.target.closest('.gem-builder-chip');
            if (chip) {
                const value = chip.dataset.chipValue;
                const group = chip.dataset.chipGroup;
                if (group === 'demographics') {
                    this.toggleArrayItem(this.state.demographics, value);
                    chip.classList.toggle('gem-builder-chip--active');
                } else if (group === 'frameworks') {
                    this.toggleArrayItem(this.state.frameworks, value);
                    chip.classList.toggle('gem-builder-chip--active');
                }
                this.updateFinalPrompt();
                return;
            }

            // Example question chips
            const exChip = e.target.closest('.gem-builder-example-chip');
            if (exChip) {
                const question = exChip.dataset.exampleQuestion;
                const target = exChip.dataset.questionTarget;
                const textarea = slide3.querySelector(`textarea[name="builder-question-${target}"]`);
                if (textarea) {
                    textarea.value = question;
                    if (target === '1') this.state.customQuestion1 = question;
                    if (target === '2') this.state.customQuestion2 = question;
                    this.updateFinalPrompt();
                }
                return;
            }

            // Action buttons
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action === 'builder-copy') {
                this.copyToClipboard();
            }
            if (action === 'builder-reset') {
                this.resetState();
            }
        });
    },

    updateFinalPrompt() {
        const output = document.getElementById('gem-builder-output');
        if (output) {
            output.textContent = this.assemblePrompt();
        }
    },

    copyToClipboard() {
        const prompt = this.assemblePrompt();
        navigator.clipboard.writeText(prompt).then(() => {
            const btn = document.querySelector('[data-action="builder-copy"]');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i data-lucide="check" style="width: 18px; height: 18px;"></i><span>Copied!</span>';
                btn.classList.add('gem-builder-copy-btn--success');
                if (window.lucide) lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('gem-builder-copy-btn--success');
                    if (window.lucide) lucide.createIcons();
                }, 2000);
            }
        });
    },

    resetState() {
        this.state = {
            tone: '',
            toneIntensity: 5,
            customQuestion1: '',
            customQuestion2: '',
            docsReady: { spsa: false, rubric: false }
        };
        this.injectBuilderCards();
    },

    toggleArrayItem(arr, value) {
        const idx = arr.indexOf(value);
        if (idx === -1) arr.push(value);
        else arr.splice(idx, 1);
    },

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
};
