import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { AppRole } from '../../../core/models/team-pulse.models';

@Component({
  selector: 'tp-role-chip',
  standalone: true,
  imports: [TagModule],
  template: `<p-tag [value]="label" [icon]="icon" severity="contrast" />`
})
export class RoleChipComponent {
  @Input() role: AppRole | 'Guest' | null | undefined = 'Guest';

  get label(): string {
    return this.role === 'TeamMember' ? 'Team Member' : (this.role ?? 'Guest');
  }

  get icon(): string {
    return this.role === 'Manager' ? 'pi pi-shield' : this.role === 'TeamMember' ? 'pi pi-user' : 'pi pi-lock';
  }
}
