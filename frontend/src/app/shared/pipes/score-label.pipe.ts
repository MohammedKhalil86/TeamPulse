import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scoreLabel',
  standalone: true
})
export class ScoreLabelPipe implements PipeTransform {
  transform(score: number | null | undefined): string {
    if (score === null || score === undefined) {
      return 'No score';
    }

    if (score >= 85) {
      return 'High';
    }

    if (score >= 70) {
      return 'Medium';
    }

    return 'Low';
  }
}
