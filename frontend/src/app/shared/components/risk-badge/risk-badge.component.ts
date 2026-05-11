import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { RiskLevel } from '../../../core/models/team-pulse.models';
import { RiskLabelPipe } from '../../pipes/risk-label.pipe';

@Component({
  selector: 'tp-risk-badge',
  standalone: true,
  imports: [RiskLabelPipe, TagModule],
  template: `<p-tag [value]="risk | riskLabel" [severity]="severity" styleClass="risk-tag" />`
})
export class RiskBadgeComponent {
  @Input({ required: true }) risk: RiskLevel = 'Low';

  get severity(): 'success' | 'warn' | 'danger' {
    if (this.risk === 'High') {
      return 'danger';
    }

    return this.risk === 'Medium' ? 'warn' : 'success';
  }
}
