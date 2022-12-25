import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Permissions } from '../data/permissions';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[permit]',
  standalone: true
})
export class PermitDirective {

  private allowedRoles?: string[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService 
  ) { }

  @Input() set permit(permName: string) {
    console.log('perm name', permName);
    
    this.allowedRoles = Permissions.perms.get(permName);
    const userRole = this.authService.user.role;
    this.checkRoles(userRole);
  }

  checkRoles(userRole: any): boolean {
    console.log('user role', userRole);
    console.log('allowed roles', this.allowedRoles);
    
    
    if (!userRole) {
      return false;
    }

    if (this.allowedRoles) {
      if (this.allowedRoles.includes(userRole)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
