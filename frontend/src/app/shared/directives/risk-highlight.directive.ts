import { Directive, HostBinding, Input } from '@angular/core';
import { RiskLevel } from '../../core/models/team-pulse.models';

@Directive({
  selector: '[tpRiskHighlight]',
  standalone: true
})
export class RiskHighlightDirective {
  @Input('tpRiskHighlight') risk: RiskLevel | string | null | undefined;

  @HostBinding('class.tp-risk-low') get low(): boolean {
    return this.risk === 'Low';
  }

  @HostBinding('class.tp-risk-medium') get medium(): boolean {
    return this.risk === 'Medium';
  }

  @HostBinding('class.tp-risk-high') get high(): boolean {
    return this.risk === 'High';
  }
}
