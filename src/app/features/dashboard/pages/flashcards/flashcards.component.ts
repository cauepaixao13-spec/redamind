import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Flashcard } from '../../../../core/services/data.service';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="page">
  <div class="page-header">
    <div>
      <p class="eyebrow">REPETIÇÃO ESPAÇADA</p>
      <h1>Flashcards de <span class="highlight">redação</span></h1>
      <p class="page-sub">Active recall + algoritmo de repetição espaçada para fixação duradoura.</p>
    </div>
    <div class="session-info">
      <span class="session-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Sessão de revisão de hoje
      </span>
    </div>
  </div>

  @if (!finished()) {
    <div class="cards-layout">
      <!-- Progress bar -->
      <div class="card-progress-wrap">
        <div class="card-counter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          Card {{ currentIndex() + 1 }} de {{ cards().length }}
        </div>
        <div class="card-progress-bar">
          <div class="card-progress-fill" [style.width.%]="((currentIndex()) / cards().length) * 100"></div>
        </div>
      </div>

      <!-- Flashcard -->
      <div class="flashcard-container" [class.flipped]="showAnswer()">
        <div class="flashcard" (click)="!showAnswer() && revealAnswer()">
          <div class="card-face card-front">
            <span class="face-label">PERGUNTA</span>
            <p class="card-text">{{ currentCard()?.question }}</p>
            @if (!showAnswer()) {
              <button class="reveal-btn" (click)="revealAnswer()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                Mostrar resposta
              </button>
            }
          </div>

          <div class="card-face card-back">
            <span class="face-label answer">RESPOSTA</span>
            <p class="card-text">{{ currentCard()?.answer }}</p>
            <div class="rating-btns">
              <button class="rate-btn hard" (click)="rateCard('hard')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Difícil
              </button>
              <button class="rate-btn easy" (click)="rateCard('easy')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Acertei!
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini stats -->
      <div class="mini-stats">
        <div class="mini-stat">
          <span class="mini-val easy-val">{{ easyCount() }}</span>
          <span class="mini-lbl">Acertadas</span>
        </div>
        <div class="mini-stat">
          <span class="mini-val hard-val">{{ hardCount() }}</span>
          <span class="mini-lbl">Difíceis</span>
        </div>
        <div class="mini-stat">
          <span class="mini-val">{{ cards().length - currentIndex() }}</span>
          <span class="mini-lbl">Restantes</span>
        </div>
      </div>
    </div>
  } @else {
    <!-- Session complete -->
    <div class="session-complete">
      <div class="complete-icon">🎉</div>
      <h2>Sessão concluída!</h2>
      <p>Você revisou todos os {{ cards().length }} flashcards de hoje.</p>
      <div class="complete-stats">
        <div class="c-stat ok">
          <span class="c-val">{{ easyCount() }}</span>
          <span class="c-lbl">Acertadas</span>
        </div>
        <div class="c-stat warn">
          <span class="c-val">{{ hardCount() }}</span>
          <span class="c-lbl">Para revisar</span>
        </div>
      </div>
      <button class="btn-primary" (click)="resetSession()">
        Reiniciar sessão →
      </button>
    </div>
  }
</div>
  `,
  styles: [`
.page { max-width: 780px; margin: 0 auto; animation: fadeIn 0.4s ease; }
.eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
h1 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
.page-sub { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.session-badge {
  display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 6px;
  background: rgba(0,196,255,0.06); border: 1px solid var(--border); font-size: 0.78rem; color: var(--accent);
}

.cards-layout { display: flex; flex-direction: column; gap: 24px; align-items: center; }

.card-progress-wrap { width: 100%; display: flex; flex-direction: column; gap: 8px; }
.card-counter {
  display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted);
  font-weight: 500;
}
.card-progress-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.card-progress-fill { height: 100%; background: linear-gradient(90deg,#0080d0,var(--accent)); border-radius: 2px; transition: width 0.4s; }

/* Flashcard flip */
.flashcard-container {
  width: 100%; max-width: 600px; height: 260px;
  perspective: 1000px; cursor: pointer;
}
.flashcard {
  width: 100%; height: 100%; position: relative;
  transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
}
.flashcard-container.flipped .flashcard { transform: rotateY(180deg); cursor: default; }
.card-face {
  position: absolute; inset: 0; backface-visibility: hidden;
  background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 36px; text-align: center; gap: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.card-back { transform: rotateY(180deg); background: var(--bg-card-hover); border-color: var(--border); }
.face-label {
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; color: var(--text-muted);
  text-transform: uppercase;
  &.answer { color: var(--accent); }
}
.card-text { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; }
.reveal-btn {
  display: flex; align-items: center; gap: 7px; padding: 9px 20px;
  background: linear-gradient(135deg, #0080d0, var(--accent)); color: white;
  border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 0 20px var(--accent-glow); }
}
.rating-btns { display: flex; gap: 12px; }
.rate-btn {
  display: flex; align-items: center; gap: 7px; padding: 10px 24px;
  border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &.hard {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: var(--red);
    &:hover { background: rgba(239,68,68,0.2); }
  }
  &.easy {
    background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: var(--green);
    &:hover { background: rgba(16,185,129,0.2); }
  }
}

.mini-stats { display: flex; gap: 32px; }
.mini-stat { text-align: center; }
.mini-val { display: block; font-size: 1.4rem; font-weight: 800; color: var(--text-secondary); line-height: 1.1; }
.easy-val { color: var(--green); }
.hard-val { color: var(--red); }
.mini-lbl { font-size: 0.72rem; color: var(--text-muted); }

/* Session complete */
.session-complete {
  display: flex; flex-direction: column; align-items: center; gap: 20px;
  padding: 64px 32px; text-align: center;
  background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-xl);
}
.complete-icon { font-size: 3rem; }
.session-complete h2 { font-size: 1.8rem; font-weight: 800; }
.session-complete p { color: var(--text-muted); font-size: 0.95rem; }
.complete-stats { display: flex; gap: 32px; }
.c-stat { padding: 16px 28px; border-radius: var(--radius-md); text-align: center; }
.c-stat.ok { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); }
.c-stat.warn { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); }
.c-val { display: block; font-size: 2rem; font-weight: 900; }
.c-stat.ok .c-val { color: var(--green); }
.c-stat.warn .c-val { color: var(--amber); }
.c-lbl { font-size: 0.78rem; color: var(--text-muted); }
  `]
})
export class FlashcardsComponent implements OnInit {
  cards = signal<Flashcard[]>([]);
  currentIndex = signal(0);
  showAnswer = signal(false);
  easyCount = signal(0);
  hardCount = signal(0);

  currentCard = computed(() => this.cards()[this.currentIndex()]);
  finished = computed(() => this.currentIndex() >= this.cards().length && this.cards().length > 0);

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.cards.set(this.dataService.getFlashcards());
  }

  revealAnswer() {
    this.showAnswer.set(true);
  }

  rateCard(rating: 'easy' | 'hard') {
    if (rating === 'easy') this.easyCount.update(v => v + 1);
    else this.hardCount.update(v => v + 1);

    setTimeout(() => {
      this.showAnswer.set(false);
      this.currentIndex.update(i => i + 1);
    }, 300);
  }

  resetSession() {
    this.currentIndex.set(0);
    this.showAnswer.set(false);
    this.easyCount.set(0);
    this.hardCount.set(0);
  }
}
