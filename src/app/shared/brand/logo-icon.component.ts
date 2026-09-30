import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Ícone/monograma oficial do Redamind — usado no sidebar, na landing page,
 * no login/cadastro, e como base do favicon (public/favicon.png é uma cópia
 * estática deste mesmo arquivo, ver public/brand/logo-icon.png).
 *
 * Uso:
 * <redamind-logo [size]="36"></redamind-logo>
 */
@Component({
  selector: 'redamind-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
<img
  src="brand/logo-icon.png"
  [attr.width]="size"
  [attr.height]="size"
  [attr.alt]="ariaLabel"
  class="rm-logo"
/>
  `,
  styles: [`
.rm-logo { display: block; flex-shrink: 0; border-radius: 22%; }
  `]
})
export class LogoIconComponent {
  @Input() size = 36;
  @Input() ariaLabel = 'Redamind';
}
