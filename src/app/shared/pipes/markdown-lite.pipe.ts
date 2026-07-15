import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Converte um markdown bem simples (só o que as aulas usam) em HTML:
 * - **negrito**
 * - listas com "- item" (inclusive "- [ ] item" como checklist)
 * - parágrafos separados por linha em branco
 * Não é um parser de markdown completo de propósito — o conteúdo das aulas
 * é escrito por nós, não por usuários, então não precisa cobrir todo o spec.
 */
@Pipe({ name: 'markdownLite', standalone: true })
export class MarkdownLitePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    const blocos = texto.trim().split(/\n\s*\n/);

    const html = blocos.map(bloco => {
      const linhas = bloco.split('\n').map(l => l.trim()).filter(Boolean);
      const ehLista = linhas.every(l => l.startsWith('- '));

      if (ehLista) {
        const itens = linhas.map(l => {
          const texto = l.replace(/^- \[ \]\s*/, '☐ ').replace(/^- /, '');
          return `<li>${negrito(texto)}</li>`;
        }).join('');
        return `<ul>${itens}</ul>`;
      }

      return `<p>${negrito(linhas.join(' '))}</p>`;
    }).join('');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

function negrito(texto: string): string {
  return texto.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
