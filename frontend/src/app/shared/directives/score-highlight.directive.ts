import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[tpScoreHighlight]',
  standalone: true
})
export class ScoreHighlightDirective {
  @Input('tpScoreHighlight') score: number | null | undefined;

  @HostBinding('class.tp-score-low') get low(): boolean {
    return this.score !== null && this.score !== undefined && this.score < 70;
  }

  @HostBinding('class.tp-score-medium') get medium(): boolean {
    return this.score !== null && this.score !== undefined && this.score >= 70 && this.score < 85;
  }

  @HostBinding('class.tp-score-high') get high(): boolean {
    return this.score !== null && this.score !== undefined && this.score >= 85;
  }
}
