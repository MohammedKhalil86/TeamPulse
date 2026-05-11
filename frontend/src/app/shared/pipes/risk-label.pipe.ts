import { Pipe, PipeTransform } from '@angular/core';
import { RiskLevel } from '../../core/models/team-pulse.models';

@Pipe({
  name: 'riskLabel',
  standalone: true
})
export class RiskLabelPipe implements PipeTransform {
  transform(risk: RiskLevel | string | null | undefined): string {
    return risk ? `${risk} Risk` : 'No Risk';
  }
}
