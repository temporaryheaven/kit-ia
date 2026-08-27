/**
 * =============================================================================
 * KIT IA DOCENTES FP - MOTOR DE PRESENTACIÓN Y CATÁLOGO DE FAMILIAS (v1.3.0)
 * =============================================================================
 */

import { slides } from '../data/slides-data.js';
import { FP_FAMILIES } from '../data/incual-families.js';
import { state } from '../core/state.js';
import { showToast } from '../core/toast.js';
import { loadTemplateToGenerator } from './generator.js';

export function initSlideDots() {
    const container = document.getElementById('slide-dots-container');
    if (!container) return;
    container.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-200 ${idx === state.currentSlideIndex ? 'bg-brand-400 w-6' : 'bg-slate-700 hover:bg-slate-500'}`;
        dot.title = `Ir a Diapositiva ${idx + 1}`;
        dot.onclick = () => goToSlide(idx);
        container.appendChild(dot);
    });
}

export function renderSlide(index) {
    if (index < 0 || index >= slides.length) return;
    state.currentSlideIndex = index;
    const slide = slides[index];
    const container = document.getElementById('slide-container');
    const backdropContainer = document.getElementById('slide-vector-backdrop');

    if (!container || !backdropContainer) return;

    container.classList.remove('slide-fade-in');
    void container.offsetWidth;
    container.classList.add('slide-fade-in');

    container.innerHTML = `
        <div class="space-y-6">
            <div class="border-b border-slate-800/80 pb-4 flex justify-between items-start">
                <div>
                    <span class="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[10px] font-mono font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider">${slide.badge}</span>
                    <h2 class="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white mt-3 tracking-tight">${slide.title}</h2>
                    <p class="text-xs sm:text-base text-slate-400 font-medium">${slide.subtitle}</p>
                </div>
            </div>
            <div>${slide.content}</div>
        </div>
    `;

    backdropContainer.innerHTML = slide.vectorSvg || '';

    const slideIndicator = document.getElementById('slide-indicator');
    if (slideIndicator) slideIndicator.innerText = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    
    const footerSlideNum = document.getElementById('footer-slide-num');
    if (footerSlideNum) footerSlideNum.innerText = index + 1;
    
    const speakerNotesText = document.getElementById('speaker-notes-text');
    if (speakerNotesText) speakerNotesText.innerHTML = slide.notes;
    
    const slideTimeTag = document.getElementById('slide-time-tag');
    if (slideTimeTag) slideTimeTag.innerText = slide.timeTag;

    const progress = ((index + 1) / slides.length) * 100;
    const progressBar = document.getElementById('slide-progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;

    initSlideDots();

    if (window.FontAwesome && window.FontAwesome.dom) {
        window.FontAwesome.dom.i2svg();
    }
}

export function prevSlide() {
    if (state.currentSlideIndex > 0) {
        state.currentSlideIndex--;
        renderSlide(state.currentSlideIndex);
    }
}

export function nextSlide() {
    if (state.currentSlideIndex < slides.length - 1) {
        state.currentSlideIndex++;
        renderSlide(state.currentSlideIndex);
    }
}

export function goToSlide(index) {
    state.currentSlideIndex = index;
    renderSlide(state.currentSlideIndex);
}

export function toggleNotes() {
    state.speakerNotesVisible = !state.speakerNotesVisible;
    const box = document.getElementById('speaker-notes-box');
    const btnText = document.getElementById('notes-btn-text');
    if (box) {
        if (state.speakerNotesVisible) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    }
    if (btnText) {
        btnText.innerText = state.speakerNotesVisible ? 'Ocultar Notas' : 'Notas Ponente';
    }
}

export function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    const display = document.getElementById('timer-display');
    if (!state.timerRunning) {
        state.timerInterval = setInterval(() => {
            state.timerSeconds++;
            const mins = String(Math.floor(state.timerSeconds / 60)).padStart(2, '0');
            const secs = String(state.timerSeconds % 60).padStart(2, '0');
            if (display) display.innerText = `${mins}:${secs}`;
        }, 1000);
        state.timerRunning = true;
        if (btn) {
            btn.innerText = 'Pausar';
            btn.classList.replace('bg-slate-800', 'bg-amber-600');
        }
    } else {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        if (btn) {
            btn.innerText = 'Reanudar';
            btn.classList.replace('bg-amber-600', 'bg-slate-800');
        }
    }
}

export function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timerSeconds = 0;
    const display = document.getElementById('timer-display');
    if (display) display.innerText = "00:00";
    const btn = document.getElementById('timer-btn');
    if (btn) {
        btn.innerText = "Iniciar";
        btn.classList.replace('bg-amber-600', 'bg-slate-800');
    }
}

export function renderFilterPills() {
    const container = document.getElementById('family-pills-container');
    if (!container) return;

    let html = `
        <button onclick="setPromptFilter('all')" class="family-filter-btn active text-xs px-3.5 py-1.5 rounded-xl font-semibold bg-brand-600 text-white border border-brand-500 transition">
            Todas las Familias (${FP_FAMILIES.length})
        </button>
    `;

    FP_FAMILIES.forEach(f => {
        html += `
            <button onclick="setPromptFilter('${f.code}')" class="family-filter-btn text-xs px-3 py-1.5 rounded-xl font-medium bg-slate-950 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5">
                <i class="${f.icon} text-slate-400"></i>
                <span>${f.code}</span>
            </button>
        `;
    });

    container.innerHTML = html;
}

export function renderFamilyCards() {
    const grid = document.getElementById('prompts-grid');
    if (!grid) return;

    grid.innerHTML = '';
    FP_FAMILIES.forEach((f) => {
        const card = document.createElement('div');
        card.className = `prompt-card ${f.code} glass-panel-dark p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4 shadow-xl hover:border-brand-500/40 transition duration-300 flex flex-col justify-between`;
        card.dataset.family = f.code;
        card.dataset.title = f.title.toLowerCase();
        card.dataset.name = f.name.toLowerCase();

        card.innerHTML = `
            <div class="space-y-3.5">
                <div class="flex justify-between items-start gap-2">
                    <div class="space-y-1">
                        <span class="inline-flex items-center gap-1.5 ${f.color} text-[10px] font-mono font-bold uppercase px-3 py-0.5 rounded-full border">
                            <i class="${f.icon}"></i> ${f.code} • ${f.name}
                        </span>
                        <h3 class="font-heading font-bold text-white text-base sm:text-lg mt-1 leading-snug">${f.title}</h3>
                    </div>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 whitespace-nowrap">${f.level}</span>
                </div>

                <div class="bg-rose-950/30 border border-rose-500/30 p-2.5 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <i class="fa-solid fa-xmark text-rose-400 shrink-0"></i>
                    <div><strong>Prompt Vago Ineficaz:</strong> <em>"${f.vague}"</em></div>
                </div>

                <div class="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap border border-slate-800/80 leading-relaxed shadow-inner" id="prompt-txt-${f.code}"># ENTRADA ESTRUCTURADA (T-C-R)
[TAREA & ROL]: ${f.task}
[CONTEXTO]: ${f.context}
[REFERENCIAS]: ${f.ref}

# FASE HUMAN-IN-THE-LOOP (E-I)
[EVALUACIÓN DEL OUTPUT]: ${f.eval}
[2ª ITERACIÓN / REPROMPTING]: ${f.iter}</div>
            </div>

            <div class="pt-3 border-t border-slate-800 flex justify-between items-center gap-2">
                <button onclick="loadTemplateToGenerator('${f.code}')" class="text-xs bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-700">
                    <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i> Cargar en Generador
                </button>
                <button onclick="copyPromptText('prompt-txt-${f.code}')" class="text-xs bg-brand-600 hover:bg-brand-500 text-white px-3.5 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 shadow-md">
                    <i class="fa-regular fa-copy"></i> Copiar
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    if (window.FontAwesome && window.FontAwesome.dom) {
        window.FontAwesome.dom.i2svg();
    }
}

export function setPromptFilter(category) {
    state.currentFamilyFilter = category;

    document.querySelectorAll('.family-filter-btn').forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white', 'border-brand-500');
        btn.classList.add('bg-slate-950', 'text-slate-300', 'border-slate-800');
    });

    if (window.event && window.event.target) {
        const activeBtn = window.event.target.closest('button');
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-950', 'text-slate-300', 'border-slate-800');
            activeBtn.classList.add('bg-brand-600', 'text-white', 'border-brand-500');
        }
    }

    filterPrompts();
}

export function filterPrompts() {
    const query = (document.getElementById('prompt-search-input')?.value || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.prompt-card');

    cards.forEach(card => {
        const cardFamily = card.dataset.family;
        const cardTitle = card.dataset.title || '';
        const cardName = card.dataset.name || '';
        const fullText = card.innerText.toLowerCase();

        const matchesCategory = (state.currentFamilyFilter === 'all' || cardFamily === state.currentFamilyFilter);
        const matchesSearch = query === '' || fullText.includes(query) || cardFamily.toLowerCase().includes(query) || cardName.includes(query);

        if (matchesCategory && matchesSearch) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

export function copyPromptText(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("¡Prompt Copiado!", "Texto copiado al portapapeles con éxito.", "check");
    });
}

export function updateAuditScore() {
    const checks = document.querySelectorAll('.audit-check');
    let count = 0;
    checks.forEach(c => {
        if (c.checked) count++;
    });

    const scoreDisplay = document.getElementById('audit-score');
    const bar = document.getElementById('audit-progress-bar');

    if (scoreDisplay) scoreDisplay.innerText = `${count} / ${checks.length} Cumplidos`;
    const pct = (count / checks.length) * 100;
    if (bar) bar.style.width = `${pct}%`;

    if (count === checks.length) {
        showToast("¡Auditoría Completa!", "Material 100% verificado y conforme a RGPD.", "shield");
    }
}
